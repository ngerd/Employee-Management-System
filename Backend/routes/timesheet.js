import express from "express";
import pool from "../DB.js";

const router = express.Router();

// GET Timesheet endpoint
router.post("/getTimesheet", async (req, res) => {
  const { employee_id, days } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: "Missing employee_id" });
  }

  try {
    let query = `
      SELECT 
        ta.assignment_id,
        p.project_name,
        t.task_name,
        ta.emp_startdate,
        ta.emp_enddate,
        e.firstname,
        e.lastname
      FROM task_assignment ta
      JOIN task t ON ta.task_id = t.task_id
      JOIN project p ON t.project_id = p.project_id
      JOIN employee e ON ta.employee_id = e.employee_id
      WHERE ta.employee_id = $1
        AND ta.emp_startdate IS NOT NULL
        AND ta.emp_enddate IS NOT NULL
    `;
    const params = [employee_id];

    // Optional: filter by "days" if provided
    if (days) {
      const daysInt = parseInt(days, 10);
      if (!isNaN(daysInt)) {
        const filterDate = new Date();
        filterDate.setDate(filterDate.getDate() - daysInt);
        query += " AND ta.emp_startdate >= $2";
        params.push(filterDate);
      }
    }

    query += " ORDER BY ta.emp_startdate DESC";

    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No timesheet records found" });
    }

    // Add new fields without changing the existing ones
    const transformedRows = result.rows.map(row => {
      const start = new Date(row.emp_startdate);
      const end = new Date(row.emp_enddate);
      return {
        ...row,
        date: start.getDate(),
        month: start.getMonth() + 1,
        year: start.getFullYear(),
        duration: (end - start) / (1000 * 60 * 60)
      };
    });

    return res.json(transformedRows);
  } catch (err) {
    console.error("Error retrieving timesheet:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// CREATE Timesheet endpoint (updated without project_id input)
router.post("/createTimesheet", async (req, res) => {
  const { employee_ids, task_id, startdate, enddate } = req.body;

  // Validate required fields
  if (!employee_ids || !Array.isArray(employee_ids) || employee_ids.length === 0 || !task_id) {
    return res.status(400).json({ error: "Missing required fields: employee_ids (array) and task_id" });
  }

  // If one of startdate or enddate is provided without the other, return an error.
  if ((startdate && !enddate) || (!startdate && enddate)) {
    return res.status(400).json({ error: "Both startdate and enddate must be provided together" });
  }

  // If provided, ensure startdate < enddate.
  if (startdate && enddate) {
    if (new Date(startdate) >= new Date(enddate)) {
      return res.status(400).json({ error: "startdate must be before enddate" });
    }
  }

  try {
    // 1) Verify that the task exists and retrieve its project and date range.
    const taskResult = await pool.query(
      "SELECT project_id, start_date, due_date FROM task WHERE task_id = $1",
      [task_id]
    );
    if (taskResult.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    const { project_id: taskProject, start_date: taskStart, due_date: taskDue } = taskResult.rows[0];

    // If dates are provided, ensure they fall within the task's date range.
    if (startdate && enddate) {
      if (new Date(startdate) < new Date(taskStart) || new Date(startdate) > new Date(taskDue)) {
        return res.status(400).json({ error: "Start date is out of the task range" });
      }
      if (new Date(enddate) < new Date(taskStart) || new Date(enddate) > new Date(taskDue)) {
        return res.status(400).json({ error: "End date is out of the task range" });
      }
    }

    const results = [];

    // 2) Process each employee in the list.
    for (const emp_id of employee_ids) {
      // Check if the employee is assigned to the project (via project_employee table).
      const pmResult = await pool.query(
        "SELECT * FROM project_employee WHERE employee_id = $1 AND project_id = $2",
        [emp_id, taskProject]
      );
      if (pmResult.rowCount === 0) {
        results.push({ employee_id: emp_id, status: "Employee is not assigned to the project of this task" });
        continue;
      }

      // 3) Check for overlapping timesheet records.
      // Only check if startdate and enddate are provided.
      if (startdate && enddate) {
        const overlapCheck = await pool.query(
          `SELECT assignment_id FROM task_assignment
           WHERE employee_id = $1
             AND task_id = $2
             AND emp_startdate IS NOT NULL
             AND emp_enddate IS NOT NULL
             AND (
               ($3 BETWEEN emp_startdate AND emp_enddate)
               OR ($4 BETWEEN emp_startdate AND emp_enddate)
               OR (emp_startdate BETWEEN $3 AND $4)
               OR (emp_enddate BETWEEN $3 AND $4)
             )`,
          [emp_id, task_id, startdate, enddate]
        );
        if (overlapCheck.rowCount > 0) {
          results.push({ employee_id: emp_id, status: "time duplicate" });
          continue;
        }
      }

      // 4) Check if an existing timesheet record exists for this employee and task.
      const existing = await pool.query(
        `SELECT assignment_id, emp_startdate, emp_enddate
         FROM task_assignment
         WHERE employee_id = $1 AND task_id = $2
         ORDER BY assignment_id DESC
         LIMIT 1`,
        [emp_id, task_id]
      );

      if (existing.rowCount === 0) {
        // No existing record → create a new one.
        await pool.query(
          `INSERT INTO task_assignment (emp_startdate, emp_enddate, employee_id, task_id)
           VALUES ($1, $2, $3, $4)`,
          [startdate || null, enddate || null, emp_id, task_id]
        );
        results.push({ employee_id: emp_id, status: "timesheet not found; new record created" });
      } else {
        const record = existing.rows[0];
        if (record.emp_startdate === null && record.emp_enddate === null) {
          // Update the existing record with provided dates.
          await pool.query(
            `UPDATE task_assignment
             SET emp_startdate = $1, emp_enddate = $2
             WHERE assignment_id = $3`,
            [startdate || null, enddate || null, record.assignment_id]
          );
          results.push({ employee_id: emp_id, status: "updated existing record" });
        } else {
          // Create a new record with the provided dates.
          await pool.query(
            `INSERT INTO task_assignment (emp_startdate, emp_enddate, employee_id, task_id)
             VALUES ($1, $2, $3, $4)`,
            [startdate || null, enddate || null, emp_id, task_id]
          );
          results.push({ employee_id: emp_id, status: "new record created" });
        }
      }
    }

    return res.json({ results });
  } catch (err) {
    console.error("Error creating timesheet:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//DELETE Timesheet
router.post("/deleteTimesheet", async (req, res) => {
  const { assignment_id } = req.body;

  if (!assignment_id) {
    return res.status(400).json({ error: "Missing assignment_id" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM task_assignment WHERE assignment_id = $1 RETURNING *",
      [assignment_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Timesheet record not found" });
    }

    return res.json({ message: "delete successfully" });
  } catch (err) {
    console.error("Error deleting timesheet:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE Timesheet
router.post("/updateTimesheet", async (req, res) => {
  const { assignment_id, startdate, enddate } = req.body;

  if (!assignment_id || !startdate || !enddate) {
    return res.status(400).json({ error: "Missing assignment_id, startdate, or enddate" });
  }

  // Ensure startdate is before enddate
  if (new Date(startdate) >= new Date(enddate)) {
    return res.status(400).json({ error: "startdate must be before enddate" });
  }

  try {
    // 1) Get the existing timesheet record to know employee_id and task_id.
    const existingResult = await pool.query(
      "SELECT employee_id, task_id FROM task_assignment WHERE assignment_id = $1",
      [assignment_id]
    );
    if (existingResult.rowCount === 0) {
      return res.status(404).json({ message: "Timesheet record not found" });
    }
    const { employee_id, task_id } = existingResult.rows[0];

    // 2) Retrieve the task's date range.
    const taskResult = await pool.query(
      "SELECT start_date, due_date FROM task WHERE task_id = $1",
      [task_id]
    );
    if (taskResult.rowCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    const { start_date: taskStart, due_date: taskDue } = taskResult.rows[0];

    // 3) Validate that the new dates fall within the task's date range.
    if (new Date(startdate) < new Date(taskStart) || new Date(startdate) > new Date(taskDue)) {
      return res.status(400).json({ error: "Start date is out of the task range" });
    }
    if (new Date(enddate) < new Date(taskStart) || new Date(enddate) > new Date(taskDue)) {
      return res.status(400).json({ error: "End date is out of the task range" });
    }

    // 4) Check for overlapping timesheets for the same employee and task,
    //    excluding the current record.
    const overlapResult = await pool.query(
      `SELECT assignment_id FROM task_assignment
       WHERE employee_id = $1
         AND task_id = $2
         AND assignment_id <> $3
         AND emp_startdate IS NOT NULL
         AND emp_enddate IS NOT NULL
         AND (
           ($4 BETWEEN emp_startdate AND emp_enddate)
           OR ($5 BETWEEN emp_startdate AND emp_enddate)
           OR (emp_startdate BETWEEN $4 AND $5)
           OR (emp_enddate BETWEEN $4 AND $5)
         )`,
      [employee_id, task_id, assignment_id, startdate, enddate]
    );
    if (overlapResult.rowCount > 0) {
      return res.status(400).json({ error: "time duplicate" });
    }

    // 5) Update the record with the new start and end dates.
    const updateResult = await pool.query(
      `UPDATE task_assignment
       SET emp_startdate = $1, emp_enddate = $2
       WHERE assignment_id = $3
       RETURNING *`,
      [startdate, enddate, assignment_id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: "Timesheet record not found" });
    }

    return res.json({ message: "update timesheet successfully" });
  } catch (err) {
    console.error("Error updating timesheet:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


export default router;

import express from "express";
import pool from "../DB.js";
const router = express.Router();

function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  // Add leading zero for minutes if needed
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

//Test

router.get("/", (req, res) => {
  res.send("Task hello");
});

//Get_task

router.post("/get", async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required." });
  }

  try {
    const query = `SELECT * FROM public."task" WHERE project_id = $1`;
    const result = await pool.query(query, [projectId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Get Task info

router.post("/info", async (req, res) => {
  const { taskId } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required." });
  }

  try {
    // Query to fetch task details from the "Task" table
    const taskQuery = `SELECT * FROM public."task" WHERE task_id = $1`;
    const taskResult = await pool.query(taskQuery, [taskId]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    const task = taskResult.rows[0];

    // Query to fetch assigned employees for this task from "Task_Assignment" and "Employee" tables
    const employeesQuery = `
      SELECT 
        e.employee_id,
        e.firstname,
        e.lastname,
        e.email,
        ta.emp_startdate,
        ta.emp_enddate
      FROM public."task_assignment" ta
      JOIN public."employee" e ON ta.employee_id = e.employee_id
      WHERE ta.task_id = $1
    `;
    const employeesResult = await pool.query(employeesQuery, [taskId]);

    res.json({
      task,
      employees: employeesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching task info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add Task

router.post("/add", async (req, res) => {
  const {
    projectId,
    taskName,
    taskDescription,
    startDate,
    dueDate,
    taskStatus, // optional; if not provided, we default to "pending"
  } = req.body;

  // Validate required fields
  if (!projectId || !taskName || !taskDescription || !startDate || !dueDate) {
    return res.status(400).json({
      error:
        "Project ID, task name, task description, start date, and due date are required in the request body.",
    });
  }

  // Default task status to "pending" if not provided
  const status = taskStatus || "pending";

  try {
    // Check if the project exists before adding the task
    const projectQuery = `
      SELECT project_id 
      FROM public."project" 
      WHERE project_id = $1
    `;
    const projectResult = await pool.query(projectQuery, [projectId]);

    if (projectResult.rows.length === 0) {
      return res
        .status(400)
        .json({ error: `Project with ID ${projectId} does not exist.` });
    }

    // Insert the new task since the project exists
    const insertQuery = `
      INSERT INTO public."task" (project_id, task_name, task_description, start_date, due_date, task_status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING task_id
    `;
    const values = [
      projectId,
      taskName,
      taskDescription,
      startDate,
      dueDate,
      status,
    ];
    const result = await pool.query(insertQuery, values);

    res.status(201).json({ taskId: result.rows[0].task_id });
  } catch (error) {
    console.error("Error adding new task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Assign Task

router.post("/assign", async (req, res) => {
  const { employeeId, taskId } = req.body;

  if (!employeeId || !taskId) {
    return res
      .status(400)
      .json({ error: "Both employeeId and taskId are required." });
  }

  try {
    // Check if the employee exists
    const employeeQuery = `
      SELECT employee_id 
      FROM public."employee" 
      WHERE employee_id = $1
    `;
    const employeeResult = await pool.query(employeeQuery, [employeeId]);
    if (employeeResult.rows.length === 0) {
      return res.status(400).json({
        error: `Employee with ID ${employeeId} does not exist.`,
      });
    }

    // Check if the task exists and retrieve its project_id
    const taskQuery = `
      SELECT task_id, project_id 
      FROM public."task" 
      WHERE task_id = $1
    `;
    const taskResult = await pool.query(taskQuery, [taskId]);
    if (taskResult.rows.length === 0) {
      return res.status(400).json({
        error: `Task with ID ${taskId} does not exist.`,
      });
    }
    const { project_id } = taskResult.rows[0];

    // Check if the employee is part of the project
    const membershipQuery = `
      SELECT * 
      FROM public."project_employee" 
      WHERE employee_id = $1 AND project_id = $2
    `;
    const membershipResult = await pool.query(membershipQuery, [
      employeeId,
      project_id,
    ]);
    if (membershipResult.rows.length === 0) {
      return res.status(400).json({
        error: `Employee with ID ${employeeId} is not a member of project with ID ${project_id}.`,
      });
    }

    // Check if the assignment already exists
    const duplicateQuery = `
      SELECT * 
      FROM public."task_assignment" 
      WHERE employee_id = $1 AND task_id = $2
    `;
    const duplicateResult = await pool.query(duplicateQuery, [
      employeeId,
      taskId,
    ]);
    if (duplicateResult.rows.length > 0) {
      return res.status(400).json({
        error: `Assignment for employee ${employeeId} and task ${taskId} already exists.`,
      });
    }

    // Insert the new assignment
    const insertQuery = `
      INSERT INTO public."task_assignment" (employee_id, task_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [employeeId, taskId]);

    res.status(201).json({
      message: "Task assigned successfully",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update Task

router.post("/update", async (req, res) => {
  const {
    taskId,
    projectId,
    taskName,
    taskDescription,
    startDate,
    dueDate,
    taskStatus,
  } = req.body;

  if (!taskId) {
    return res
      .status(400)
      .json({ error: "Task ID is required in the request body." });
  }

  // Check if at least one field to update is provided
  if (
    projectId === undefined ||
    (taskName === undefined &&
      taskDescription === undefined &&
      startDate === undefined &&
      dueDate === undefined &&
      taskStatus === undefined)
  ) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided to update." });
  }

  try {
    // If projectId is provided, verify that the project exists
    if (projectId !== undefined) {
      const projectQuery = `
        SELECT project_id 
        FROM public."project" 
        WHERE project_id = $1
      `;
      const projectResult = await pool.query(projectQuery, [projectId]);
      if (projectResult.rows.length === 0) {
        return res
          .status(400)
          .json({ error: `Project with ID ${projectId} does not exist.` });
      }
    }

    const updateQuery = `
      UPDATE public."task" 
      SET project_id = COALESCE($1, project_id),
          task_name = COALESCE($2, task_name),
          task_description = COALESCE($3, task_description),
          start_date = COALESCE($4, start_date),
          due_date = COALESCE($5, due_date),
          task_status = COALESCE($6, task_status)
      WHERE task_id = $7
      RETURNING *
    `;
    const values = [
      projectId,
      taskName,
      taskDescription,
      startDate,
      dueDate,
      taskStatus,
      taskId,
    ];
    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete Task

router.delete("/delete", async (req, res) => {
  const { taskId } = req.body;

  if (!taskId) {
    return res
      .status(400)
      .json({ error: "Task ID is required in the request body." });
  }

  try {
    // Delete the task and return the deleted row(s)
    const deleteTaskQuery =
      'DELETE FROM public."task" WHERE task_id = $1 RETURNING *';
    const taskResult = await pool.query(deleteTaskQuery, [taskId]);

    // If no rows are returned, the task wasn't found
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    // After deleting the task, delete the related task assignments
    const deleteAssignmentQuery =
      'DELETE FROM public."task_assignment" WHERE task_id = $1';
    await pool.query(deleteAssignmentQuery, [taskId]);

    res.json({ message: "Task and related assignments deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Unassign Tasks
router.delete("/unassign", async (req, res) => {
  const { employeeId, taskId } = req.body;

  if (!employeeId || !taskId) {
    return res.status(400).json({
      error: "Both employeeId and taskId are required in the request body.",
    });
  }

  try {
    const deleteQuery = `
      DELETE FROM public."task_assignment"
      WHERE employee_id = $1
        AND task_id = $2
        AND emp_startdate IS NULL
        AND emp_enddate IS NULL
      RETURNING *
    `;
    const result = await pool.query(deleteQuery, [employeeId, taskId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Assignment not found or already ended." });
    }

    res.json({ message: "Task unassigned successfully." });
  } catch (error) {
    console.error("Error unassigning task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Employee Task endpoint
router.post("/getEmployeeTask", async (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: "Missing employee_id" });
  }

  try {
    const query = `
      SELECT DISTINCT ON (t.task_id)
        p.project_name,
        t.task_name,
        t.task_id,
        t.start_date,        -- NEW: include start_date
        t.due_date,          -- NEW: include due_date
        ta.assignment_id
      FROM public."task_assignment" ta
      JOIN public."task" t ON ta.task_id = t.task_id
      JOIN public."project" p ON t.project_id = p.project_id
      WHERE ta.employee_id = $1
      ORDER BY t.task_id, ta.assignment_id;
    `;
    const result = await pool.query(query, [employee_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No tasks found for the given employee" });
    }

    return res.json(result.rows);
  } catch (err) {
    console.error("Error fetching employee tasks:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

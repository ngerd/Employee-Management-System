import express from "express";
import pool from "../DB.js";
const router = express.Router();

router.post("/create_project", async (req, res) => {
  const {
    project_name,
    project_description,
    start_date,
    due_date,
    customername,
    nation,
    cost,
  } = req.body;
  const project_status = `In Progress`;
  // Validate input
  if (!project_name ) {
    return res
      .status(400)
      .json({ error: "Missing required field: projectName" });
  }

  try {
    // Insert the new project into the Project table
    const result = await pool.query(
      `INSERT INTO public.project ("project_name", "project_description", "start_date", "due_date","project_status","customername","nation","cost") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *`,
      [
        project_name,
        project_description,
        start_date,
        due_date,
        project_status,
        customername,
        nation,
        cost,
      ]
    );
    return res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Get all employess's Projects
router.post("/get-project", async (req, res) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(400).json({ error: "employee ID is required" });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM public.project_employee pm JOIN public.project p on pm.project_id = p.project_id WHERE employee_id = $1',
      [employee_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({ projects: result.rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Get Project info
router.post("/info", async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res
      .status(400)
      .json({ error: "Project ID is required as a query parameter." });
  }

  try {
    // Query to get project details
    const projectQuery = 'SELECT * FROM public."project" WHERE project_id = $1';
    const projectResult = await pool.query(projectQuery, [projectId]);

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    const project = projectResult.rows[0];

    // Query to get employees assigned to this project along with their roles
    const employeesQuery = `
      SELECT e.employee_id, e.firstname, e.lastname, e.email, r.role_name
      FROM public."project_employee" ep
      JOIN public."employee" e ON ep.employee_id = e.employee_id
      JOIN public."role" r ON e.role_id = r.role_id
      WHERE ep.project_id = $1;
    `;
    const employeesResult = await pool.query(employeesQuery, [projectId]);

    res.json({
      project: {
        project_id: project.project_id,
        project_name: project.project_name,
        project_description: project.project_description,
        start_date: project.start_date,
        end_date: project.end_date,
        created_at: project.created_at,
      },
      employees: employeesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching project info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update Project
router.post("/update", async (req, res) => {
  const {
    project_id,
    project_name,
    project_description,
    due_date,
    project_status,
    customerName,
    nation,
    cost,
  } = req.body;

  if (!project_id) {
    return res.status(400).json({ error: "Project ID must be provided" });
  }

  if (
    project_name === undefined &&
    project_description === undefined &&
    due_date === undefined &&
    project_status === undefined &&
    customerName === undefined &&
    nation === undefined &&
    cost === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Missing required field to be updated" });
  }

  try {
    const updateQuery = `UPDATE public."project" 
                           SET  project_name = COALESCE($1, project_name),
                                project_description = COALESCE($2, project_description),
                                due_date = COALESCE($3, due_date),
                                project_status = COALESCE($4, project_status),
                                customername = COALESCE($5, customername),
                                nation = COALESCE($6, nation),
                                cost = COALESCE($7, cost)
                            WHERE project_id = $8
                            RETURNING *`;

    const value = [
      project_name,
      project_description,
      due_date,
      project_status,
      customerName,
      nation,
      cost,
      project_id,
    ];
    const result = await pool.query(updateQuery, value);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }
    return res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add employee to project
router.post("/add-employee", async (req, res) => {
  const { employee_id, project_id, ismanager } = req.body;

  if (!employee_id || !project_id) {
    return res.status(400).json({ error: "Missing reqiured field" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    //Insert employee into project_member
    const addEmployeeQuery = `INSERT INTO public."project_employee" (ismanager, project_id, employee_id)
                              VALUES ($1, $2, $3) RETURNING *`;
    const employeeResult = await client.query(addEmployeeQuery, [
      ismanager,
      project_id,
      employee_id,
    ]);

    const query = `SELECT p.nation, p.cost, r.pay_rate_sg, r.pay_rate_vn
                  FROM public."project" p
                  JOIN public."project_employee" pm ON pm.project_id = p.project_id
                  JOIN public."employee" e ON pm.employee_id = e.employee_id
                  JOIN public."role" r ON r.role_id = e.role_id
                  WHERE pm.employee_id = $1 AND pm.project_id = $2`;

    const result = await client.query(query, [employee_id, project_id]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Project or Employee not found" });
    }

    const {
      nation,
      cost: currentCost,
      pay_rate_sg,
      pay_rate_vn,
    } = result.rows[0];

    //Determine the correct pay rate based on the project nation
    const payRate = nation === "Singapore" ? pay_rate_sg : pay_rate_vn;

    //Calculate and update the new project
    const newCost = parseFloat(currentCost) + parseFloat(payRate);

    await client.query(
      `UPDATE public."project" SET cost = $1 WHERE project_id = $2`,
      [newCost, project_id]
    );
    await client.query("COMMIT");

    return res.status(201).json({
      data: employeeResult.rows[0],
      updated_cost: newCost,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

//Delete employee from project
router.post("/delete-employee", async (req, res) => {
  const { employee_id, project_id } = req.body;
  if (!employee_id && !project_id) {
    return res.status(400).json({ error: "Missing reqired field" });
  }
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //Fetch project's detail and pay rate
    const query = `SELECT p.nation, p.cost, r."pay_rate_sg", r."pay_rate_vn"
                    FROM public."project" p
                    JOIN public."project_employee" pm ON pm.project_id = p.project_id
                    JOIN public."employee" e ON pm.employee_id = e.employee_id
                    JOIN public."role" r ON r.role_id = e.role_id
                    WHERE pm.employee_id = $1 AND pm.project_id = $2`;
    const result = await client.query(query, [employee_id, project_id]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Project or Employee not found." });
    }

    const {
      nation,
      cost: currentCost,
      pay_rate_sg,
      pay_rate_vn,
    } = result.rows[0];
    const payRate = nation === "Singapore" ? pay_rate_sg : pay_rate_vn;
    const newCost = parseFloat(currentCost) - parseFloat(payRate);

    await client.query(
      `UPDATE public."project" SET cost = $1 WHERE project_id = $2`,
      [newCost, project_id]
    );

    const deleteEmployee = `DELETE FROM public."project_employee" WHERE employee_id = $1 AND project_id = $2`;
    const value = [employee_id, project_id];
    await client.query(deleteEmployee, value);

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Delete successfully",
      updated_cost: newCost,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Error deleting employee: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});
export default router;

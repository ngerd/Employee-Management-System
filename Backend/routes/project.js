import express from "express";
import pool from "../DB.js";
const router = express.Router();

router.post("/create_project", async (req, res) => {
  const {
    project_id,
    project_name,
    project_description,
    start_date,
    end_date,
  } = req.body;
  // Validate input
  if (!project_name && !project_id) {
    return res
      .status(400)
      .json({ error: "Missing required field: projectName" });
  }

  try {
    // Insert the new project into the Project table
    const result = await pool.query(
      `INSERT INTO public."Projects" ("project_id", "project_name", "project_description", "start_date", "end_date","created_at") 
      VALUES ($1, $2, $3, $4, $5, TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI')) RETURNING *`,
      [project_id, project_name, project_description, start_date, end_date]
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
      'SELECT * FROM public."Employee_projects" WHERE employee_id = $1',
      [employee_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
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
      FROM public."project_member" ep
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
  const { project_id, project_name, project_description, end_date } = req.body;

  if (!project_id) {
    return res.status(400).json({ error: "Project ID must be provided" });
  }

  if (
    project_name === undefined &&
    project_description === undefined &&
    end_date === undefined
  ) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided to be update" });
  }

  try {
    const updateQuery = `UPDATE public."Projects" 
                           SET  project_name = COALESCE($1, project_name),
                                project_description = COALESCE($2, project_description),
                                end_date = COALESCE($3, end_date)
                            WHERE project_id = $4
                            RETURNING *`;

    const value = [project_name, project_description, end_date, project_id];
    const result = await pool.query(updateQuery, value);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }
    return res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Add employee to project
router.post("/add-employee", async (req, res) => {
  const { employee_id, project_id, role_id } = req.body;

  if (!employee_id || !project_id || !role_id) {
    return res.status(400).json({ error: "Missing reqiured field" });
  }

  try {
    const addEmployeeQuery = `INSERT INTO public."Employee_projects" (employee_id, project_id, role_id, assigned_at)
                              VALUES ($1, $2, $3, TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI')) RETURNING *`;
    const value = [employee_id, project_id, role_id];
    const result = await pool.query(addEmployeeQuery, value);
    return res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    // Handle duplicate key error (assignment already exists)
    if (error.code === "23505") {
      return res.status(400).json({
        error: `Employee ${employee_id}  already exists.`,
      });
    }
    // Check if error is a foreign key violation (error code 23503)
    if (error.code === "23503") {
      if (error.detail && error.detail.includes('table public."Projects"')) {
        return res
          .status(400)
          .json({ error: `Project with ID ${project_id} does not exist.` });
      } else if (
        error.detail &&
        error.detail.includes('table public."Employees"')
      ) {
        return res
          .status(400)
          .json({ error: `Employee with ID ${employee_id} does not exist.` });
      } else if (
        error.detail &&
        error.detail.includes('table Public."Roles"')
      ) {
        return res
          .status(400)
          .json({ error: `Role with ID ${role_id} does not exist.` });
      }
      return res
        .status(400)
        .json({ error: "Foreign key constraint violation." });
    }
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete employee from project
router.post("/delete-employee", async (req, res) => {
  const { employee_id } = req.body;
  if (!employee_id) {
    return res.status(404).json({ error: "employee ID is required" });
  }

  try {
    const deleteQuery = `DELETE FROM public."Employee_projects" WHERE employee_id = $1 RETURNING *`;
    const result = await pool.query(deleteQuery, [employee_id]);

    // If no rows are returned, the task wasn't found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found." });
    }

    res.json({ message: "Employee delete successfully" });
  } catch (error) {
    console.error("Error deleting employee: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;

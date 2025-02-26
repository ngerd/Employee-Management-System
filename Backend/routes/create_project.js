import express from "express";
import pool from "../DB.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { project_id, project_name, project_description, start_date, end_date, created_at } = req.body;

  // Validate input
  if (!project_name) {
    return res.status(400).json({ error: "Missing required field: projectName" });
  }

  try {
    // Insert the new project into the Project table
    const result = await pool.query(
      'INSERT INTO public."Project" ("project_id", "project_name", "project_description", "start_date", "end_date","created_at") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [project_id, project_name, project_description, start_date, end_date,created_at]
    );
    return res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/info', async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required as a query parameter.' });
  }

  try {
    // Query to get project details
    const projectQuery = 'SELECT * FROM projects WHERE project_id = $1';
    const projectResult = await pool.query(projectQuery, [projectId]);

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const project = projectResult.rows[0];

    // Query to get employees assigned to this project along with their roles
    const employeesQuery = `
      SELECT e.employee_id, e.first_name, e.last_name, e.email, r.role_name
      FROM employee_projects ep
      JOIN employees e ON ep.employee_id = e.employee_id
      JOIN roles r ON ep.role_id = r.role_id
      WHERE ep.project_id = $1
    `;
    const employeesResult = await pool.query(employeesQuery, [projectId]);

    res.json({
      project: {
        project_id: project.project_id,
        project_name: project.project_name,
        project_description: project.project_description,
        start_date: project.start_date,
        end_date: project.end_date,
        created_at: project.created_at
      },
      employees: employeesResult.rows
    });
  } catch (error) {
    console.error('Error fetching project info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

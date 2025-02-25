import express from "express";
import pool from "../DB.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { project_id, projectName, projectDescription } = req.body;

  // Validate input
  if (!projectName) {
    return res.status(400).json({ error: "Missing required field: projectName" });
  }

  try {
    // Insert the new project into the Project table
    const result = await pool.query(
      'INSERT INTO public."Project" ("project_id", "projectname", "projectdescription") VALUES ($1, $2, $3) RETURNING *',
      [project_id, projectName, projectDescription]
    );
    return res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

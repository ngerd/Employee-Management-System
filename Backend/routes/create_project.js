const path = require('path');
const express = require('express');
const router = express.Router();
const pool = require("../DB");

router.post("/", async (req, res) => {
    const {project_id, projectName, projectDescription } = req.body;
  
    // Validate input: Ensure required fields are provided
    if (!projectName) {
      return res
        .status(400)
        .json({ error: "Missing required field: projectName" });
    }
  
    try {
      // Insert the new project into the Project table
      const result = await pool.query(
        'INSERT INTO public."Project" ("project_id", "projectname", "projectdescription") VALUES ($1, $2, $3) RETURNING *',
        [project_id, projectName, projectDescription]
      );
  
      // Return the created project record with status 201 (Created)
      return res.status(201).json({ project: result.rows[0] });
    } catch (err) {
      // Handle any errors that occur during the query
      return res.status(500).json({ error: err.message });
    }
  });

  module.exports =  router;
const express = require("express");
const { Pool } = require("pg");
const taskRoutes = require("./routes/task");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Configure your PostgreSQL connection details
const pool = new Pool({
  user: "postgres",
  host: "172.30.3.66",
  database: "postgres",
  password: "cuoi08",
  port: 5432,
});
pool.connect();
// // API endpoint to create timesheet entries for multiple employees
// app.post("/create_timesheet", async (req, res) => {
//   const { empIds, taskId, projectId, duration } = req.body;

//   // Validate input
//   if (!empIds || !taskId || !projectId || !duration) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const results = [];

//   for (const empId of empIds) {
//     try {
//       // Check if the employee is a member of the project
//       const membership = await pool.query(
//         'SELECT * FROM "Member of" WHERE empID = $1 AND projectID = $2',
//         [empId, projectId]
//       );

//       if (membership.rowCount === 0) {
//         results.push({ empId, error: "Employee not assigned to project" });
//         continue;
//       }

//       // Insert timesheet entry
//       await pool.query(
//         "INSERT INTO timesheet (empID, taskID, projectID, duration) VALUES ($1, $2, $3, $4)",
//         [empId, taskId, projectId, duration]
//       );
//       results.push({ empId, status: "Created" });
//     } catch (err) {
//       results.push({ empId, error: err.message });
//     }
//   }

//   return res.status(200).json({ results });
// });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/create_project", async (req, res) => {
  const { projectName, projectDescription } = req.body;

  // Validate input: Ensure required fields are provided
  if (!projectName) {
    return res
      .status(400)
      .json({ error: "Missing required field: projectName" });
  }

  try {
    // Insert the new project into the Project table
    const result = await pool.query(
      'INSERT INTO public."Project" ("projectname", "projectdescription") VALUES ($1, $2) RETURNING *',
      [projectName, projectDescription]
    );

    // Return the created project record with status 201 (Created)
    return res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    // Handle any errors that occur during the query
    return res.status(500).json({ error: err.message });
  }
});

app.use("/task", taskRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const express = require("express");
const taskRoutes = require("./routes/task");
const createProject = require("./routes/create_project");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());


// API endpoint to create timesheet entries for multiple employees
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


app.use("/create_project", createProject);
app.use("/task", taskRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

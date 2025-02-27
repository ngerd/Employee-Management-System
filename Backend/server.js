import express from "express";
import taskRoutes from "./routes/task.js";
import createProject from "./routes/project.js";
import authRoutes from "./routes/auth.js";
import infoRoutes from "./routes/information.js";
import timesheetRoutes from "./routes/timesheet.js";


const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount routes
app.use("/projects", createProject);
app.use("/task", taskRoutes);
app.use("/", authRoutes);
app.use("/", infoRoutes);
app.use("/", timesheetRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

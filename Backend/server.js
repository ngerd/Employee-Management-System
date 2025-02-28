import express from "express";
import taskRoutes from "./routes/task.js";
import projectRoutes from "./routes/project.js";
import authRoutes from "./routes/auth.js";
import infoRoutes from "./routes/information.js";
import timesheetRoutes from "./routes/timesheet.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount routes
app.use("/projects", projectRoutes);
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

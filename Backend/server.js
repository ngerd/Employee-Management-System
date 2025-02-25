import express from "express";
import taskRoutes from "./routes/task.js";
import createProject from "./routes/create_project.js";
import authRoutes from "./routes/auth.js";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount routes
app.use("/create_project", createProject);
app.use("/task", taskRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

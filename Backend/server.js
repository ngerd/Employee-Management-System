import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import taskRoutes from "./routes/task.js";
import projectRoutes from "./routes/project.js";
import authRoutes from "./routes/auth.js";
import infoRoutes from "./routes/information.js";
import timesheetRoutes from "./routes/timesheet.js";
import customerRoutes from "./routes/customer.js";

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for both development and production origins
app.use(
  cors({
    origin: ["http://localhost:5173", "https://employee-management-system1-ddqn.onrender.com"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount API routes
app.use("/customer", customerRoutes);
app.use("/projects", projectRoutes);
app.use("/task", taskRoutes);
app.use("/", authRoutes);
app.use("/", infoRoutes);
app.use("/", timesheetRoutes);

// Serve the static files from the built frontend
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// For any routes that are not API calls, serve the frontend's index.html (for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Initialize socket.io with updated CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://employee-management-system1-ddqn.onrender.com"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  // Add your socket event handlers here if needed
});

// Use Render's provided port (or default to 3000) and bind to 0.0.0.0
const PORT = process.env.PORT || 3000;
console.log("Binding to port:", PORT);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running on port ${PORT}`);
});
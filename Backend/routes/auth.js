import express from "express";
import pool from "../DB.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const router = express.Router();
const saltRounds = 10;

// Login endpoint using email and password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }
  
  try {
    // Query the employee table using the provided email
    const result = await pool.query(
      'SELECT * FROM employee WHERE email = $1',
      [email]
    );
    
    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const employee = result.rows[0];
    
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Generate a JWT token and set it in a cookie using the helper function
    generateTokenAndSetCookie(employee.employee_id, res);
    const token = jwt.sign(
      { empId: employee.employee_id },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );
    
    return res.json({ access_token: token, employee_id: employee.employee_id });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create Account endpoint
router.post("/createAccount", async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword, isAdmin, role_id } = req.body;
  
  // Validate input
  if (!firstname || !lastname || !email || !password || !confirmPassword || isAdmin === undefined || !role_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  
  // Validate email format using a simple regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  try {
    // Check if the email already exists in the database
    const emailCheck = await pool.query(
      'SELECT * FROM employee WHERE email = $1',
      [email]
    );
    if (emailCheck.rowCount > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }
    
    // Check if the role_id exists in the role table
    const roleCheck = await pool.query(
      'SELECT * FROM role WHERE role_id = $1',
      [role_id]
    );
    if (roleCheck.rowCount === 0) {
      return res.status(400).json({ error: "Invalid role_id" });
    }
    
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert the new account into the employee table.
    const result = await pool.query(
      'INSERT INTO employee (firstname, lastname, email, password, isAdmin, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING employee_id, firstname, lastname, email, isAdmin, role_id',
      [firstname, lastname, email, hashedPassword, isAdmin, role_id]
    );
    
    return res.status(201).json({
      status: "successful",
      employee: result.rows[0]
    });
  } catch (err) {
    console.error("Create account error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint: clears the JWT cookie
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  return res.json({ message: "Logged out successfully" });
});

// Update Employee endpoint: updates firstname, lastname, email, password, and role_id
router.post("/updateEmployee", async (req, res) => {
  const { employee_id, firstname, lastname, email, password, confirmPassword, role_id } = req.body;
  
  // Validate input
  if (!employee_id || !firstname || !lastname || !email || !password || !confirmPassword || !role_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      `UPDATE employee 
       SET firstname = $1, lastname = $2, email = $3, password = $4, role_id = $5
       WHERE employee_id = $6 
       RETURNING employee_id, firstname, lastname, email, role_id, isadmin`,
      [firstname, lastname, email, hashedPassword, role_id, employee_id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    return res.json({
      status: "update successfully",
      employee: result.rows[0]
    });
  } catch (err) {
    console.error("Update employee error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Employee endpoint: deletes an employee from the database
router.post("/deleteEmployee", async (req, res) => {
  const { employee_id } = req.body;
  
  if (!employee_id) {
    return res.status(400).json({ error: "Missing employee_id" });
  }
  
  try {
    const result = await pool.query(
      'DELETE FROM employee WHERE employee_id = $1 RETURNING employee_id',
      [employee_id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    return res.json({
      status: "delete successfully",
      employee_id: result.rows[0].employee_id
    });
  } catch (err) {
    console.error("Delete employee error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

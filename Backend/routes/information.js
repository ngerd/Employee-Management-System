import express from "express";
import pool from "../DB.js";
const router = express.Router();

router.post("/viewinfo", async (req, res) => {
  const { employee_id } = req.body;

  // Validate input
  if (!employee_id) {
    return res.status(400).json({ error: "Missing employee_id" });
  }

  try {
    // Use a join between employee and role tables.
    // Concatenate firstname and lastname to get fullname.
    const result = await pool.query(
      `SELECT 
         e.employee_id, 
         (e.firstname || ' ' || e.lastname) AS fullname, 
         e.email, 
         e.isadmin,
         r.role_name AS role
       FROM employee e
       JOIN role r ON e.role_id = r.role_id
       WHERE e.employee_id = $1`,
      [employee_id]
    );

    // If no matching employee is found, return an error message
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Employee not exist" });
    }

    // Return the employee's information
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving employee info:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-role", async (req, res) => {
  try {
    const result = await pool.query(`SELECT role_id, role_name FROM role`);
    return res.json({ Role: result.rows });
  } catch (error) {
    console.error("Error retrieving roles: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-employees", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.employee_id, e.firstname, e.lastname, r.role_name 
       FROM employee e 
       JOIN role r ON e.role_id = r.role_id`
    );
    return res.json({ employees: result.rows });
  } catch (error) {
    console.error("Error retrieving employee roles: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

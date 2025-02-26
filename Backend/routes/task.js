import express from "express";
import pool from "../DB.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Task hello");
});

router.post('/get', async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required in the request body.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE project_id = $1',
      [projectId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/info', async (req, res) => {
  const { taskId } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: 'Task ID is required as a query parameter.' });
  }

  try {
    // Query to get task details
    const taskQuery = 'SELECT * FROM tasks WHERE task_id = $1';
    const taskResult = await pool.query(taskQuery, [taskId]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const task = taskResult.rows[0];

    // Query to get employees assigned to this task
    const employeesQuery = `
      SELECT e.employee_id, e.first_name, e.last_name, e.email
      FROM employee_tasks et
      JOIN employees e ON et.employee_id = e.employee_id
      WHERE et.task_id = $1
    `;
    const employeesResult = await pool.query(employeesQuery, [taskId]);

    res.json({
      task,
      employees: employeesResult.rows,
    });
  } catch (error) {
    console.error('Error fetching task info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/add', async (req, res) => {
  const { projectId, taskName, taskDescription, startDate, dueDate } = req.body;

  // Validate required fields
  if (!projectId || !taskName) {
    return res.status(400).json({
      error: 'Project ID and task name are required in the request body.',
    });
  }

  try {
    const insertQuery = `
      INSERT INTO tasks (project_id, task_name, task_description, start_date, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING task_id
    `;
    const values = [projectId, taskName, taskDescription, startDate || null, dueDate || null];
    const result = await pool.query(insertQuery, values);

    res.status(201).json({ taskId: result.rows[0].task_id });
  } catch (error) {
    // Check for foreign key violation (e.g., if projectId does not exist)
    if (error.code === '23503') {
      if (error.detail && error.detail.includes('table "projects"')) {
        return res.status(400).json({ error: `Project with ID ${projectId} does not exist.` });
      }
      return res.status(400).json({ error: 'Foreign key constraint violation.' });
    }
    console.error('Error adding new task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/assign', async (req, res) => {
  const { employeeId, taskId } = req.body;

  if (!employeeId || !taskId) {
    return res.status(400).json({ error: 'Both employeeId and taskId are required.' });
  }

  try {
    const query = `
      INSERT INTO employee_tasks (employee_id, task_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [employeeId, taskId]);
    res.status(201).json({
      message: 'Task assigned successfully',
      assignment: result.rows[0]
    });
  } catch (error) {
    // Handle duplicate key error (assignment already exists)
    if (error.code === '23505') {
      return res.status(400).json({ error: `Assignment for employee ${employeeId} and task ${taskId} already exists.` });
    }
    // Check if error is a foreign key violation (error code 23503)
    if (error.code === '23503') {
      if (error.detail && error.detail.includes('table "tasks"')) {
        return res.status(400).json({ error: `Task with ID ${taskId} does not exist.` });
      } else if (error.detail && error.detail.includes('table "employees"')) {
        return res.status(400).json({ error: `Employee with ID ${employeeId} does not exist.` });
      }
      return res.status(400).json({ error: 'Foreign key constraint violation.' });
    }
    console.error('Error assigning task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/update', async (req, res) => {
  const { taskId, projectId, taskName, taskDescription, startDate, dueDate } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required in the request body." });
  }

  // Check if at least one field to update is provided
  if (
    projectId === undefined &&
    taskName === undefined &&
    taskDescription === undefined &&
    startDate === undefined &&
    dueDate === undefined
  ) {
    return res.status(400).json({ error: "At least one field must be provided to update." });
  }

  try {
    const updateQuery = `
      UPDATE tasks 
      SET project_id = COALESCE($1, project_id),
          task_name = COALESCE($2, task_name),
          task_description = COALESCE($3, task_description),
          start_date = COALESCE($4, start_date),
          due_date = COALESCE($5, due_date)
      WHERE task_id = $6
      RETURNING *
    `;
    const values = [projectId, taskName, taskDescription, startDate, dueDate, taskId];
    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    // Handle foreign key violation errors (e.g., invalid projectId)
    if (error.code === '23503') {
      if (error.detail && error.detail.includes('table "projects"')) {
        return res.status(400).json({ error: `Project with ID ${projectId} does not exist.` });
      }
      return res.status(400).json({ error: 'Foreign key constraint violation.' });
    }
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete', async (req, res) => {
  const { taskId } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: 'Task ID is required in the request body.' });
  }

  try {
    const deleteQuery = 'DELETE FROM tasks WHERE task_id = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [taskId]);

    // If no rows are returned, the task wasn't found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/unassign', async (req, res) => {
  const { employeeId, taskId } = req.body;

  if (!employeeId || !taskId) {
    return res.status(400).json({ error: 'Both employeeId and taskId are required in the request body.' });
  }

  try {
    const deleteQuery = `
      DELETE FROM employee_tasks 
      WHERE employee_id = $1 AND task_id = $2
      RETURNING *
    `;
    const result = await pool.query(deleteQuery, [employeeId, taskId]);

    // If no rows are returned, then the assignment wasn't found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found.' });
    }

    res.json({ message: 'Task unassigned successfully.' });
  } catch (error) {
    console.error('Error unassigning task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

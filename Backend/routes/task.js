import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Task hello");
});

router.post('/tasks', async (req, res) => {
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




export default router;

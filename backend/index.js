const express = require("express");
const cors = require("cors");
const pool = require("./db"); // MySQL pool connection
const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

/**
 * ✅ Health Check
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

/**
 * ✅ Get all users
 */
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email FROM users ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Database error while fetching users" });
  }
});

/**
 * ✅ Get all tasks (joined with users)
 */
app.get("/api/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, u.name AS assignee_name
      FROM tasks t
      LEFT JOIN users u ON u.id = t.assignee_id
      ORDER BY FIELD(status, 'todo', 'inprogress', 'done'), 
               due_date IS NULL, due_date ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ error: "Database error while fetching tasks" });
  }
});

/**
 * ✅ Create new task
 */
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, status, due_date, assignee_id, progress } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Task title is required" });
    }

    const [result] = await pool.query(
      `INSERT INTO tasks 
      (title, description, status, due_date, assignee_id, progress, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, description || null, status || "todo", due_date || null, assignee_id || null, progress || 0]
    );

    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ error: "Database error while creating task" });
  }
});

/**
 * ✅ Update task
 */
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];

    // Allow only valid fields
    const allowedFields = ["title", "description", "status", "due_date", "assignee_id", "progress"];
    for (let key of allowedFields) {
      if (key in req.body) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No valid fields provided" });
    }

    values.push(id);

    await pool.query(
      `UPDATE tasks SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
      values
    );

    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ error: "Database error while updating task" });
  }
});

/**
 * ✅ Delete task
 */
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ deleted: true });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ error: "Database error while deleting task" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

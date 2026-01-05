const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/tasks", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tasks");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/tasks", async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO tasks (title, completed) VALUES (?, ?)",
            [title, false]
        );

        const [rows] = await pool.query(
            "SELECT * FROM tasks WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.put("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { completed } = req.body;

    try {
        const [result] = await pool.query(
            "UPDATE tasks SET completed = ? WHERE id = ?",
            [completed, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        const [rows] = await pool.query(
            "SELECT * FROM tasks WHERE id = ?",
            [id]
        );

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const [result] = await pool.query(
            "DELETE FROM tasks WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
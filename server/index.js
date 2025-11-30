const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

//initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Test endpoint
app.get('/api/test', (req, res) => {
  res.send('You look good today!');
});

// GET all todos
app.get('/api/todos', (req, res) => {
    const todos = db.prepare('SELECT * FROM todos').all();
    res.json(todos);
});

// POST a new todo
app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    const result = db.prepare('INSERT INTO todos (title) VALUES (?)').run(title);
    res.json({ id: result.lastInsertRowid, title, completed: 0})
});

// PATCH update a todo (mark as complete/incomplete)
app.patch('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(completed, id);
    res.json({ success: true});
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    res.json({ success: true});
});

// Serve React static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
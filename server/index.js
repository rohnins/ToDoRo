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

// ---------- Category Endpoints ----------

// GET all categories
app.get('/api/categories', (req, res) => {
    try {
        const categories = db.prepare('SELECT * FROM categories').all();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// POST a new category
app.post('/api/categories', (req, res) => {
    try {
        const { name, color } = req.body;
        if (!name || !color) {
            return res.status(400).json({ error: 'Name and color are required' });
        }
        const result = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)').run(name, color);
        res.json({ id: result.lastInsertRowid, name, color });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// PATCH update a category
app.patch('/api/categories/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;
        if (name) {
            db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name, id);
        }
        if (color) {
            db.prepare('UPDATE categories SET color = ? WHERE id = ?').run(color, id);
        }
        const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
        if (!updated) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(updated);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// ---------- ToDo Endpoints ----------

// GET all todos (optionally grouped by category)
app.get('/api/todos', (req, res) => {
    try {
        const { groupBy } = req.query;
        let todos;
        
        if (groupBy === 'category') {
            // Order by category, then position
            todos = db.prepare('SELECT * FROM todos ORDER BY categories_id, position').all();
        } else {
            // Default: order by position, then id
            todos = db.prepare('SELECT * FROM todos ORDER BY position, id').all();
        }
        
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// POST a new todo
app.post('/api/todos', (req, res) => {
    try {
        const { title, categories_id, status, due_date, position } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const result = db.prepare(
            'INSERT INTO todos (title, categories_id, status, due_date, position) VALUES (?, ?, ?, ?, ?)'
        ).run(
            title,
            categories_id || null,
            status || 'todo',
            due_date || null,
            position || 0
        );
        const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
        res.json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// PATCH update a todo (mark as complete/incomplete, update status, position, due_date, category)
app.patch('/api/todos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { completed, status, position, due_date, categories_id } = req.body;
        
        // Build dynamic update query
        const updates = [];
        const values = [];
        
        if (completed !== undefined) {
            updates.push('completed = ?');
            values.push(completed);
        }
        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
        }
        if (position !== undefined) {
            updates.push('position = ?');
            values.push(position);
        }
        if (due_date !== undefined) {
            updates.push('due_date = ?');
            values.push(due_date);
        }
        if (categories_id !== undefined) {
            updates.push('categories_id = ?');
            values.push(categories_id);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        values.push(id);
        const query = `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`;
        const result = db.prepare(query).run(...values);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
        res.json(updated);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

// Serve React static files
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const Database = require('better-sqlite3');
const path = require('path');

// Create or open the database
const db = new Database(path.join(__dirname, 'data', 'todo.db'));

// Initialize tables
function initializeDatabase() {
    // Create users todo table
    db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            categories_id INTEGER,
            status TEXT DEFAULT 'todo',
            due_date DATETIME,
            position INTEGER DEFAULT 0,
            FOREIGN KEY (categories_id) REFERENCES categories(id)
        )
    `);

    // Add new columns if they don't exist (migration)
    try {
        db.exec(`ALTER TABLE todos ADD COLUMN status TEXT DEFAULT 'todo'`);
    } catch (e) {
        // Column already exists, ignore
    }
    try {
        db.exec(`ALTER TABLE todos ADD COLUMN due_date DATETIME`);
    } catch (e) {
        // Column already exists, ignore
    }
    try {
        db.exec(`ALTER TABLE todos ADD COLUMN position INTEGER DEFAULT 0`);
    } catch (e) {
        // Column already exists, ignore
    }

    //Cerate pomodoro_sessions table
    db.exec(`
        CREATE TABLE IF NOT EXISTS pomodoro_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            duration INTEGER NOT NULL,
            start_time DATETIME NOT NULL,
            end_time DATETIME,
            todo_id INTEGER,
            FOREIGN KEY (todo_id) REFERENCES todos(id)
        )
    `);

    //Cerate pomodoro_sessions table
    db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database initialized');

}

// Export the database and initialization function
module.exports = {
    db,
    initializeDatabase
};
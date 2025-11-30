const Database = require('better-sqlite3');
const path = require('path');

// Create or open the database
const db = new Database(path.join(__dirname, 'data', 'todo.db'));

// Initialize tables
function initializeDatabase() {
    // Create users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0
        )
    `);

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

    console.log('Database initialized');

}

// Export the database and initialization function
module.exports = {
    db,
    initializeDatabase
};
import React, { useState, useEffect } from 'react';
import './App.css';
import PomodoroTimer from './PomodoroTimer';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  //Fetch todos from load
  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error('Error fetching todos:', err));
  }, []);

  // Add new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
    });
    const todo = await response.json();
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  // Toggle complete
  const handleToggle = async (id, completed) => {
    fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: completed ? 0 : 1 })
    });
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: completed ? 0 : 1 } : todo
    ));
  };

  // Delete todo
  const handleDelete = async (id) => {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

return (
    <div className="App">
      <h1>Todo & Pomodoro</h1>
      <PomodoroTimer />
      <div>
        <input 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New todo..."
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.completed === 1}
              onChange={() => handleToggle(todo.id, todo.completed)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App;

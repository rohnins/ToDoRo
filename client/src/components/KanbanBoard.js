import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import KanbanColumn from './KanbanColumn';
import AddCategoryButton from './AddCategoryButton';
import './KanbanBoard.css';

function KanbanBoard({ onEditTodo, onDeleteTodo }) {
  const [categories, setCategories] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, todosRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/todos?groupBy=category'),
      ]);

      if (!categoriesRes.ok || !todosRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const categoriesData = await categoriesRes.json();
      const todosData = await todosRes.json();

      setCategories(categoriesData);
      setTodos(todosData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching kanban data:', error);
      setLoading(false);
    }
  };

  const handleMoveTodo = async (todoId, newCategoryId, newStatus) => {
    // Optimistically update UI
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId
        ? { ...todo, categories_id: newCategoryId, status: newStatus }
        : todo
    );
    setTodos(updatedTodos);

    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories_id: newCategoryId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setTodos(todos);
        throw new Error('Failed to move todo');
      }

      const updated = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === todoId ? updated : todo))
      );
    } catch (error) {
      console.error('Error moving todo:', error);
      setTodos(todos); // Revert on error
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!onDeleteTodo) return;

    const originalTodos = todos;
    setTodos(todos.filter((todo) => todo.id !== todoId));

    try {
      await onDeleteTodo(todoId);
      await fetchData(); // Refresh data
    } catch (error) {
      setTodos(originalTodos);
    }
  };

  if (loading) {
    return <div className="kanban-loading">Loading...</div>;
  }

  // Group todos by category
  const todosByCategory = categories.map((category) => ({
    ...category,
    todos: todos.filter((todo) => todo.categories_id === category.id),
  }));

  // Also show todos without category
  const uncategorizedTodos = todos.filter((todo) => !todo.categories_id);
  if (uncategorizedTodos.length > 0) {
    todosByCategory.push({
      id: null,
      name: 'Uncategorized',
      color: '#999',
      todos: uncategorizedTodos,
    });
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-board">
        <div className="kanban-board-header">
          <h2>Kanban Board</h2>
          <AddCategoryButton onCategoryAdded={(newCategory) => setCategories([...categories, newCategory])} />
        </div>
        <div className="kanban-board-content">
          {todosByCategory.length === 0 ? (
            <div className="kanban-empty">
              <p>No categories found. Create a category to get started!</p>
            </div>
          ) : (
            todosByCategory.map((category) => (
              <KanbanColumn
                key={category.id || 'uncategorized'}
                category={category}
                todos={category.todos}
                onMoveTodo={handleMoveTodo}
                onEditTodo={onEditTodo}
                onDeleteTodo={handleDeleteTodo}
                onTaskAdded={(newTodo) => setTodos([...todos, newTodo])}
              />
            ))
          )}
        </div>
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;

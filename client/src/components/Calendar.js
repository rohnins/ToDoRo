import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [todosForDate, setTodosForDate] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [todosRes, categoriesRes] = await Promise.all([
        fetch('/api/todos'),
        fetch('/api/categories'),
      ]);

      if (!todosRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const todosData = await todosRes.json();
      const categoriesData = await categoriesRes.json();

      setTodos(todosData);
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setLoading(false);
    }
  };

  const updateTodosForDate = useCallback(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const filtered = todos.filter((todo) => {
      if (!todo.due_date) return false;
      const todoDate = new Date(todo.due_date).toISOString().split('T')[0];
      return todoDate === dateStr;
    });
    setTodosForDate(filtered);
  }, [selectedDate, todos]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateTodosForDate();
  }, [updateTodosForDate]);

  const getTodosForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return todos.filter((todo) => {
      if (!todo.due_date) return false;
      const todoDate = new Date(todo.due_date).toISOString().split('T')[0];
      return todoDate === dateStr;
    });
  };

  const getCategoryColor = (categoryId) => {
    if (!categoryId) return '#999';
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.color : '#999';
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const todosForDay = getTodosForDate(date);
      if (todosForDay.length > 0) {
        return (
          <div className="calendar-day-indicator">
            {todosForDay.map((todo, index) => (
              <div
                key={todo.id}
                className="calendar-todo-dot"
                style={{ backgroundColor: getCategoryColor(todo.categories_id) }}
                title={todo.title}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="calendar-loading">Loading calendar...</div>;
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>Calendar</h2>
      </div>
      <div className="calendar-content">
        <div className="calendar-wrapper">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="custom-calendar"
          />
        </div>
        <div className="calendar-todos-panel">
          <h3>Todos for {formatDate(selectedDate)}</h3>
          {todosForDate.length === 0 ? (
            <div className="calendar-no-todos">
              <p>No todos scheduled for this date.</p>
            </div>
          ) : (
            <ul className="calendar-todos-list">
              {todosForDate.map((todo) => {
                const category = categories.find((cat) => cat.id === todo.categories_id);
                return (
                  <li key={todo.id} className="calendar-todo-item">
                    <div
                      className="calendar-todo-color"
                      style={{
                        backgroundColor: category ? category.color : '#999',
                      }}
                    ></div>
                    <div className="calendar-todo-content">
                      <div className="calendar-todo-title">{todo.title}</div>
                      {category && (
                        <div className="calendar-todo-category">{category.name}</div>
                      )}
                      {todo.status && (
                        <div className="calendar-todo-status">Status: {todo.status}</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;

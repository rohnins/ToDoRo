import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import { useTimer } from './contexts/TimerContext';
import PomodoroTimer from './components/PomodoroTimer';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/Calendar';
import './timer-templates.css';
import './responsive.css';

function App() {
  const { isActive, template } = useTimer();

  // Delete todo handler for Kanban
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      return true;
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw err;
    }
  };

  const appClass = `App timer-template-${template} ${isActive ? 'app-timer-active' : ''}`;

  return (
    <Router>
      <div className={appClass}>
        <header className="app-header">
          <h1>Todo & Pomodoro</h1>
          <nav className="app-navigation">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end
            >
              Planner
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Calendar
            </NavLink>
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <div className="combined-dashboard">
                <section className="dashboard-timer">
                  <PomodoroTimer />
                </section>
                <section className="dashboard-kanban">
                  <KanbanBoard onDeleteTodo={handleDeleteTodo} />
                </section>
              </div>
            } />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;

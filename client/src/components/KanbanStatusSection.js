import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import KanbanCard from './KanbanCard';
import QuickAddTask from './QuickAddTask';
import './KanbanStatusSection.css';

function KanbanStatusSection({ status, todos, categoryId, onMoveTodo, onEditTodo, onDeleteTodo, onTaskAdded }) {
  const [isAdding, setIsAdding] = useState(false);
  const [{ isOver }, drop] = useDrop({
    accept: 'todo',
    drop: (item) => {
      if (item.categories_id !== categoryId || item.status !== status.id) {
        onMoveTodo(item.id, categoryId, status.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleTaskAdded = (newTodo) => {
    // Parent should refresh data, but we might want to close the form
    // Actually, parent refresh happens via callback.
    // If we want to keep adding, we can keep it open. Let's keep it open or toggle? 
    // Usually quick add implies adding one then done, or keeping open.
    // Let's close it for now as per "Submit creates todo" usually implies done.
    // But QuickAddTask clears input. Let's keep it open? No, let's close it.
    if (onTaskAdded) onTaskAdded(newTodo);
    setIsAdding(false);
  };

  return (
    <div className="kanban-status-section" ref={drop}>
      <div className="kanban-status-header">
        <span>{status.label}</span>
        <button
          className="btn-add-task-icon"
          onClick={() => setIsAdding(true)}
          title="Add Task"
        >
          +
        </button>
      </div>
      <div className={`kanban-status-cards ${isOver ? 'drag-over' : ''}`}>
        {isAdding && (
          <QuickAddTask
            categoryId={categoryId}
            status={status.id}
            onTaskAdded={handleTaskAdded}
            onCancel={() => setIsAdding(false)}
          />
        )}
        {todos.map((todo) => (
          <KanbanCard
            key={todo.id}
            todo={todo}
            onEdit={onEditTodo}
            onDelete={onDeleteTodo}
          />
        ))}
        {!isAdding && todos.length === 0 && (
          <div className="kanban-empty-section">No items</div>
        )}
      </div>
    </div>
  );
}

export default KanbanStatusSection;

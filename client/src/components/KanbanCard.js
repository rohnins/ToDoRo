import React from 'react';
import { useDrag } from 'react-dnd';
import './KanbanCard.css';

function KanbanCard({ todo, onEdit, onDelete }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'todo',
    item: { id: todo.id, status: todo.status, categories_id: todo.categories_id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      ref={drag}
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="kanban-card-header">
        <h4>{todo.title}</h4>
        <div className="kanban-card-actions">
          {onEdit && (
            <button className="kanban-card-edit" onClick={() => onEdit(todo)}>
              ✏️
            </button>
          )}
          {onDelete && (
            <button className="kanban-card-delete" onClick={() => onDelete(todo.id)}>
              🗑️
            </button>
          )}
        </div>
      </div>
      {todo.due_date && (
        <div className="kanban-card-due-date">
          📅 {formatDate(todo.due_date)}
        </div>
      )}
      {todo.completed === 1 && (
        <div className="kanban-card-completed">✓ Completed</div>
      )}
    </div>
  );
}

export default KanbanCard;

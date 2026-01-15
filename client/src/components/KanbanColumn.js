import React from 'react';
import KanbanStatusSection from './KanbanStatusSection';
import './KanbanColumn.css';

const STATUSES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

function KanbanColumn({ category, todos, onMoveTodo, onEditTodo, onDeleteTodo, onTaskAdded }) {
  const todosByStatus = STATUSES.map((status) => ({
    ...status,
    todos: todos.filter((todo) => todo.status === status.id),
  }));

  return (
    <div className="kanban-column">
      <div className="kanban-column-header" style={{ borderTopColor: category.color || '#ccc' }}>
        <span className="kanban-column-color" style={{ backgroundColor: category.color || '#ccc' }}></span>
        <h3>{category.name}</h3>
      </div>
      <div className="kanban-column-content">
        {todosByStatus.map((statusGroup) => (
          <KanbanStatusSection
            key={statusGroup.id}
            status={statusGroup}
            todos={statusGroup.todos}
            categoryId={category.id}
            onMoveTodo={onMoveTodo}
            onEditTodo={onEditTodo}
            onDeleteTodo={onDeleteTodo}
            onTaskAdded={onTaskAdded}
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanColumn;

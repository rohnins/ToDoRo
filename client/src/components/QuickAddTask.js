import React, { useState } from 'react';
import './QuickAddTask.css';

function QuickAddTask({ categoryId, status, onTaskAdded, onCancel }) {
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    categories_id: categoryId,
                    status,
                    position: 0 // Add to top usually, backend might need to handle this or we just push it
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const newTodo = await response.json();
            onTaskAdded(newTodo);
            setTitle(''); // Reset if we want to add another, but usually we close or reset
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="quick-add-task">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task..."
                    autoFocus
                    onKeyDown={handleKeyDown}
                    className="quick-add-input"
                />
                <div className="quick-add-actions">
                    <button type="submit" disabled={!title.trim() || isSubmitting} className="btn-add">
                        Add
                    </button>
                    <button type="button" onClick={onCancel} className="btn-close">
                        ×
                    </button>
                </div>
            </form>
        </div>
    );
}

export default QuickAddTask;

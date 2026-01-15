import React, { useState } from 'react';
import './AddCategoryButton.css';

function AddCategoryButton({ onCategoryAdded }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#007bff'); // Default blue
    const [isSubmitting, setIsSubmitting] = useState(false);

    const colors = [
        '#007bff', // Blue
        '#28a745', // Green
        '#dc3545', // Red
        '#ffc107', // Yellow
        '#17a2b8', // Teal
        '#6610f2', // Purple
        '#e83e8c', // Pink
        '#fd7e14', // Orange
        '#6c757d', // Gray
        '#343a40', // Dark
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, color }),
            });

            if (!response.ok) {
                throw new Error('Failed to create category');
            }

            const newCategory = await response.json();
            onCategoryAdded(newCategory);
            setIsOpen(false);
            setName('');
            setColor('#007bff');
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <button className="add-category-btn" onClick={() => setIsOpen(true)}>
                + Add Category
            </button>
        );
    }

    return (
        <div className="add-category-modal-overlay">
            <div className="add-category-modal">
                <h3>New Category</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="categoryName">Name</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Work, Personal"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Color</label>
                        <div className="color-picker-grid">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`color-swatch ${color === c ? 'selected' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                    aria-label={`Select color ${c}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting || !name.trim()}
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCategoryButton;

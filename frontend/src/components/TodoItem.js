import React, { useState } from 'react';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    await onUpdate(todo.id, { completed: !todo.completed });
    setIsUpdating(false);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      return;
    }

    setIsUpdating(true);
    await onUpdate(todo.id, { title: editTitle.trim() });
    setIsEditing(false);
    setIsUpdating(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await onDelete(todo.id);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`} data-testid="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={isUpdating}
          data-testid="todo-checkbox"
        />

        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveEdit();
              } else if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            disabled={isUpdating}
            data-testid="edit-todo-input"
            autoFocus
          />
        ) : (
          <span 
            className="todo-title"
            data-testid="todo-title"
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              disabled={isUpdating}
              data-testid="save-edit-button"
              className="save-btn"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isUpdating}
              data-testid="cancel-edit-button"
              className="cancel-btn"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              disabled={isUpdating}
              data-testid="edit-button"
              className="edit-btn"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isUpdating}
              data-testid="delete-button"
              className="delete-btn"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem; 
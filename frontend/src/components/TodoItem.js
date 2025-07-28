import React, { useState } from 'react';

function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    await onUpdate(todo.id, { completed: !todo.completed });
    setIsUpdating(false);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      return;
    }

    setIsUpdating(true);
    await onUpdate(todo.id, { text: editText.trim() });
    setIsEditing(false);
    setIsUpdating(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await onDelete(todo.id);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={isUpdating}
        />

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveEdit();
              } else if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            disabled={isUpdating}
            className="edit-input"
            autoFocus
          />
        ) : (
          <span className="todo-text">
            {todo.text}
          </span>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              disabled={isUpdating}
              className="save-btn"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isUpdating}
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
              className="edit-btn"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isUpdating}
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';

function TodoList({ token, apiBaseUrl }) {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBaseUrl}/items`, axiosConfig);
      setTodos(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    
    if (!newTodoText.trim()) {
      setError('Todo text is required');
      return;
    }

    setIsAdding(true);
    setError('');

    try {
      const response = await axios.post(
        `${apiBaseUrl}/items`,
        { text: newTodoText.trim() },
        axiosConfig
      );
      
      setTodos([...todos, response.data]);
      setNewTodoText('');
    } catch (error) {
      setError('Failed to add todo');
      console.error('Error adding todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const response = await axios.put(
        `${apiBaseUrl}/items/${id}`,
        updates,
        axiosConfig
      );
      
      setTodos(todos.map(todo => 
        todo.id === id ? response.data : todo
      ));
      setError('');
    } catch (error) {
      setError('Failed to update todo');
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/items/${id}`, axiosConfig);
      setTodos(todos.filter(todo => todo.id !== id));
      setError('');
    } catch (error) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="todo-list">
      <h2>My Todos</h2>

      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <div className="add-todo-group">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Enter new todo..."
            disabled={isAdding}
            className="todo-input"
          />
          <button 
            type="submit" 
            disabled={isAdding}
            className="add-todo-btn"
          >
            {isAdding ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
      </form>

      <div className="todos-container">
        {todos.length === 0 ? (
          <p className="no-todos">No todos yet. Add one above!</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>

      <div className="todos-summary">
        <p>
          Total: {todos.length} | 
          Completed: {todos.filter(t => t.completed).length} | 
          Pending: {todos.filter(t => !t.completed).length}
        </p>
      </div>
    </div>
  );
}

export default TodoList; 
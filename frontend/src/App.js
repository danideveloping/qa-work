import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import TodoList from './components/TodoList';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (token) {
      // Verify token by making a request to get todos
      axios.get(`${API_BASE_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        // Token is valid, get user info from token
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ id: payload.id, username: payload.username });
        } catch (error) {
          // Invalid token format
          handleLogout();
        }
      })
      .catch(() => {
        // Token is invalid
        handleLogout();
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button 
              onClick={handleLogout}
              className="logout-btn"
              data-testid="logout-button"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <TodoList token={token} apiBaseUrl={API_BASE_URL} />
        )}
      </main>
    </div>
  );
}

export default App; 
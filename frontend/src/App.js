import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TodoList from './components/TodoList';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const response = fetch(`${API_BASE_URL}/items`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      .then(response => {
        if (response.ok) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            setUser(payload);
            setToken(storedToken);
            setIsAuthenticated(true);
          } catch (error) {
            localStorage.removeItem('token');
          }
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(error => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const handleLogin = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App</h1>
        {isAuthenticated && user && (
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </header>
      <main>
        {isAuthenticated ? (
          <TodoList token={token} apiBaseUrl={API_BASE_URL} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App; 
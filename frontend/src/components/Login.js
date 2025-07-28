import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username: username.trim(),
        password
      });

      onLogin(response.data.user, response.data.token);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" data-testid="login-form">
        <h2>Login</h2>
        
        {error && (
          <div className="error-message" data-testid="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            data-testid="username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            data-testid="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="Enter password"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="login-btn"
          data-testid="login-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: admin, Password: password</p>
          <p>Username: user, Password: password</p>
        </div>
      </form>
    </div>
  );
}

export default Login; 
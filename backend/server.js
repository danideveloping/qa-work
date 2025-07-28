const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for demo purposes)
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
  },
  {
    id: 2,
    username: 'user',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
  }
];

let todos = [
  { id: 1, title: 'Learn React', completed: false, userId: 1 },
  { id: 2, title: 'Write tests', completed: false, userId: 1 },
  { id: 3, title: 'Deploy app', completed: true, userId: 2 }
];

let nextTodoId = 4;

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Todo CRUD operations
app.get('/items', authenticateToken, (req, res) => {
  const userTodos = todos.filter(todo => todo.userId === req.user.id);
  res.json(userTodos);
});

app.post('/items', authenticateToken, (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo = {
      id: nextTodoId++,
      title: title.trim(),
      completed: false,
      userId: req.user.id
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/items/:id', authenticateToken, (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const { title, completed } = req.body;

    const todoIndex = todos.findIndex(todo => 
      todo.id === todoId && todo.userId === req.user.id
    );

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      todos[todoIndex].title = title.trim();
    }

    if (completed !== undefined) {
      todos[todoIndex].completed = Boolean(completed);
    }

    res.json(todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/items/:id', authenticateToken, (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => 
      todo.id === todoId && todo.userId === req.user.id
    );

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server }; 
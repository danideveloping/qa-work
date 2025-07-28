const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  },
  {
    id: 2,
    username: 'user',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  }
];

let todos = [
  { id: 1, text: 'Sample Todo 1', completed: false, userId: 1 },
  { id: 2, text: 'Sample Todo 2', completed: true, userId: 1 },
  { id: 3, text: 'User Todo 1', completed: false, userId: 2 },
  { id: 4, text: 'User Todo 2', completed: false, userId: 2 }
];

let nextTodoId = 5;

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
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/items', authenticateToken, (req, res) => {
  try {
    const userTodos = todos.filter(todo => todo.userId === req.user.id);
    res.json(userTodos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/items', authenticateToken, (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    if (text.length > 200) {
      return res.status(400).json({ error: 'Todo text too long (max 200 characters)' });
    }

    const newTodo = {
      id: nextTodoId++,
      text: text.trim(),
      completed: false,
      userId: req.user.id
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/items/:id', authenticateToken, (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const { text, completed } = req.body;

    const todoIndex = todos.findIndex(todo => 
      todo.id === todoId && todo.userId === req.user.id
    );

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (text !== undefined) {
      if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Todo text is required' });
      }
      if (text.length > 200) {
        return res.status(400).json({ error: 'Todo text too long (max 200 characters)' });
      }
      todos[todoIndex].text = text.trim();
    }

    if (completed !== undefined) {
      todos[todoIndex].completed = Boolean(completed);
    }

    res.json(todos[todoIndex]);
  } catch (error) {
    console.error('Update todo error:', error);
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
    res.json({ success: true, todo: deletedTodo });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server }; 
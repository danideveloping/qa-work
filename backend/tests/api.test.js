const request = require('supertest');
const { app } = require('../server');

describe('Todo API Tests', () => {
  let authToken;
  let todoId;

  // Test user credentials
  const validUser = {
    username: 'admin',
    password: 'password'
  };

  const invalidUser = {
    username: 'wronguser',
    password: 'wrongpassword'
  };

  describe('Health Check', () => {
    test('GET /health should return OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Authentication Tests', () => {
    describe('POST /login - Positive Tests', () => {
      test('should login with valid credentials', async () => {
        const response = await request(app)
          .post('/login')
          .send(validUser)
          .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('username', validUser.username);

        // Store token for subsequent tests
        authToken = response.body.token;
      });
    });

    describe('POST /login - Negative Tests', () => {
      test('should reject invalid credentials', async () => {
        const response = await request(app)
          .post('/login')
          .send(invalidUser)
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Invalid credentials');
        expect(response.body).not.toHaveProperty('token');
      });

      test('should reject missing username', async () => {
        const response = await request(app)
          .post('/login')
          .send({ password: 'password' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Username and password required');
      });

      test('should reject missing password', async () => {
        const response = await request(app)
          .post('/login')
          .send({ username: 'admin' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Username and password required');
      });

      test('should reject empty request body', async () => {
        const response = await request(app)
          .post('/login')
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Username and password required');
      });
    });
  });

  describe('Todo CRUD Operations', () => {
    beforeAll(async () => {
      // Ensure we have a valid token
      if (!authToken) {
        const loginResponse = await request(app)
          .post('/login')
          .send(validUser);
        authToken = loginResponse.body.token;
      }
    });

    describe('GET /items - Positive Tests', () => {
      test('should get todos for authenticated user', async () => {
        const response = await request(app)
          .get('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        // Admin user should have pre-existing todos
        expect(response.body.length).toBeGreaterThan(0);
        
        // Verify todos belong to the user
        response.body.forEach(todo => {
          expect(todo).toHaveProperty('id');
          expect(todo).toHaveProperty('title');
          expect(todo).toHaveProperty('completed');
          expect(todo).toHaveProperty('userId');
        });
      });
    });

    describe('GET /items - Negative Tests', () => {
      test('should reject request without token', async () => {
        const response = await request(app)
          .get('/items')
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Access token required');
      });

      test('should reject request with invalid token', async () => {
        const response = await request(app)
          .get('/items')
          .set('Authorization', 'Bearer invalid-token')
          .expect(403);

        expect(response.body).toHaveProperty('error', 'Invalid token');
      });
    });

    describe('POST /items - Positive Tests', () => {
      test('should create a new todo', async () => {
        const newTodo = {
          title: 'Test Todo Item'
        };

        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newTodo)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title', newTodo.title);
        expect(response.body).toHaveProperty('completed', false);
        expect(response.body).toHaveProperty('userId');

        // Store todo ID for subsequent tests
        todoId = response.body.id;
      });

      test('should trim whitespace from title', async () => {
        const newTodo = {
          title: '  Whitespace Todo  '
        };

        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newTodo)
          .expect(201);

        expect(response.body.title).toBe('Whitespace Todo');
      });
    });

    describe('POST /items - Negative Tests', () => {
      test('should reject todo without title', async () => {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Title is required');
      });

      test('should reject todo with empty title', async () => {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ title: '' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Title is required');
      });

      test('should reject todo with whitespace-only title', async () => {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ title: '   ' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Title is required');
      });

      test('should reject request without token', async () => {
        const response = await request(app)
          .post('/items')
          .send({ title: 'Test Todo' })
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Access token required');
      });
    });

    describe('PUT /items/:id - Positive Tests', () => {
      test('should update todo title', async () => {
        const updatedTitle = 'Updated Test Todo';

        const response = await request(app)
          .put(`/items/${todoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ title: updatedTitle })
          .expect(200);

        expect(response.body).toHaveProperty('id', todoId);
        expect(response.body).toHaveProperty('title', updatedTitle);
      });

      test('should update todo completion status', async () => {
        const response = await request(app)
          .put(`/items/${todoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ completed: true })
          .expect(200);

        expect(response.body).toHaveProperty('id', todoId);
        expect(response.body).toHaveProperty('completed', true);
      });

      test('should update both title and completion status', async () => {
        const updates = {
          title: 'Fully Updated Todo',
          completed: false
        };

        const response = await request(app)
          .put(`/items/${todoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updates)
          .expect(200);

        expect(response.body).toHaveProperty('id', todoId);
        expect(response.body).toHaveProperty('title', updates.title);
        expect(response.body).toHaveProperty('completed', updates.completed);
      });
    });

    describe('PUT /items/:id - Negative Tests', () => {
      test('should reject update to non-existent todo', async () => {
        const response = await request(app)
          .put('/items/99999')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ title: 'Updated Title' })
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Todo not found');
      });

      test('should reject empty title update', async () => {
        const response = await request(app)
          .put(`/items/${todoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ title: '' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Title cannot be empty');
      });

      test('should reject request without token', async () => {
        const response = await request(app)
          .put(`/items/${todoId}`)
          .send({ title: 'Updated Title' })
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Access token required');
      });
    });

    describe('DELETE /items/:id - Positive Tests', () => {
      test('should delete todo', async () => {
        const response = await request(app)
          .delete(`/items/${todoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', todoId);

        // Verify todo is deleted
        const getResponse = await request(app)
          .get('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const deletedTodo = getResponse.body.find(todo => todo.id === todoId);
        expect(deletedTodo).toBeUndefined();
      });
    });

    describe('DELETE /items/:id - Negative Tests', () => {
      test('should reject deletion of non-existent todo', async () => {
        const response = await request(app)
          .delete('/items/99999')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Todo not found');
      });

      test('should reject request without token', async () => {
        const response = await request(app)
          .delete('/items/1')
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Access token required');
      });
    });
  });

  describe('Route Not Found', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
}); 
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { app, server } = require('../server');

describe('Todo API Tests', () => {
  afterAll((done) => {
    server.close(done);
  });

  const validUser = {
    username: 'admin',
    password: 'password'
  };

  const invalidUser = {
    username: 'wronguser',
    password: 'wrongpass'
  };

  let authToken = null;
  let testTodoId = null;

  describe('Authentication Tests', () => {
    describe('POST /login', () => {
      test('should login with valid credentials', async () => {
        const response = await request(app)
          .post('/login')
          .send(validUser)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        expect(response.body.user).toMatchObject({
          id: expect.any(Number),
          username: validUser.username
        });

        authToken = response.body.token;
      });

      test('should reject invalid username', async () => {
        const response = await request(app)
          .post('/login')
          .send({ username: 'nonexistent', password: 'password' })
          .expect(401);

        expect(response.body.error).toBe('Invalid credentials');
        expect(response.body.token).toBeUndefined();
      });

      test('should reject invalid password', async () => {
        const response = await request(app)
          .post('/login')
          .send({ username: 'admin', password: 'wrongpassword' })
          .expect(401);

        expect(response.body.error).toBe('Invalid credentials');
        expect(response.body.token).toBeUndefined();
      });

      test('should reject missing username', async () => {
        const response = await request(app)
          .post('/login')
          .send({ password: 'password' })
          .expect(400);

        expect(response.body.error).toBe('Username and password required');
      });

      test('should reject missing password', async () => {
        const response = await request(app)
          .post('/login')
          .send({ username: 'admin' })
          .expect(400);

        expect(response.body.error).toBe('Username and password required');
      });

      test('should reject empty credentials', async () => {
        const response = await request(app)
          .post('/login')
          .send({})
          .expect(400);

        expect(response.body.error).toBe('Username and password required');
      });

      test('should reject empty username', async () => {
        const response = await request(app)
          .post('/login')
          .send({ username: '', password: 'password' })
          .expect(400);

        expect(response.body.error).toBe('Username and password required');
      });

      test('should reject empty password', async () => {
        const response = await request(app)
          .post('/login')
          .send({ username: 'admin', password: '' })
          .expect(400);

        expect(response.body.error).toBe('Username and password required');
      });
    });
  });

  describe('Todo CRUD Operations', () => {
    beforeEach(() => {
      expect(authToken).toBeDefined();
    });

    describe('GET /items', () => {
      test('should get todos for authenticated user', async () => {
        const response = await request(app)
          .get('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(0);

        if (response.body.length > 0) {
          response.body.forEach(todo => {
            expect(todo).toMatchObject({
              id: expect.any(Number),
              text: expect.any(String),
              completed: expect.any(Boolean),
              userId: expect.any(Number)
            });
          });
        }
      });

      test('should reject request without token', async () => {
        const response = await request(app)
          .get('/items')
          .expect(401);

        expect(response.body.error).toBe('Access token required');
      });

      test('should reject request with invalid token', async () => {
        const response = await request(app)
          .get('/items')
          .set('Authorization', 'Bearer invalid-token')
          .expect(403);

        expect(response.body.error).toBe('Invalid token');
      });

      test('should reject request with malformed authorization header', async () => {
        const response = await request(app)
          .get('/items')
          .set('Authorization', 'invalid-format')
          .expect(401);

        expect(response.body.error).toBe('Access token required');
      });
    });

    describe('POST /items', () => {
      test('should create new todo', async () => {
        const newTodo = {
          text: 'Test Todo from API Test'
        };

        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newTodo)
          .expect(201);

        expect(response.body).toMatchObject({
          id: expect.any(Number),
          text: newTodo.text,
          completed: false,
          userId: expect.any(Number)
        });

        testTodoId = response.body.id;
      });

      test('should reject todo with empty text', async () => {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ text: '' })
          .expect(400);

        expect(response.body.error).toBe('Todo text is required');
      });

      test('should reject todo with only whitespace', async () => {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ text: '   ' })
          .expect(400);

        expect(response.body.error).toBe('Todo text is required');
      });

      test('should reject todo without text field', async () => {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send({})
          .expect(400);

        expect(response.body.error).toBe('Todo text is required');
      });

      test('should reject todo with text too long', async () => {
        const longText = 'a'.repeat(201);
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ text: longText })
          .expect(400);

        expect(response.body.error).toBe('Todo text too long (max 200 characters)');
      });

      test('should trim whitespace from todo text', async () => {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ text: '  Test Todo with Spaces  ' })
          .expect(201);

        expect(response.body.text).toBe('Test Todo with Spaces');
      });

      test('should reject request without token', async () => {
        const response = await request(app)
          .post('/items')
          .send({ text: 'Test Todo' })
          .expect(401);

        expect(response.body.error).toBe('Access token required');
      });
    });

    describe('PUT /items/:id', () => {
      test('should update todo text', async () => {
        expect(testTodoId).toBeDefined();

        const updateData = {
          text: 'Updated Test Todo'
        };

        const response = await request(app)
          .put(`/items/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toMatchObject({
          id: testTodoId,
          text: updateData.text,
          userId: expect.any(Number)
        });
      });

      test('should update todo completion status', async () => {
        expect(testTodoId).toBeDefined();

        const response = await request(app)
          .put(`/items/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ completed: true })
          .expect(200);

        expect(response.body.completed).toBe(true);
      });

      test('should update both text and completion status', async () => {
        expect(testTodoId).toBeDefined();

        const updateData = {
          text: 'Final Updated Todo',
          completed: false
        };

        const response = await request(app)
          .put(`/items/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toMatchObject({
          id: testTodoId,
          text: updateData.text,
          completed: updateData.completed
        });
      });

      test('should return 404 for non-existent todo', async () => {
        const response = await request(app)
          .put('/items/99999')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ text: 'Updated Todo' })
          .expect(404);

        expect(response.body.error).toBe('Todo not found');
      });

      test('should reject empty text update', async () => {
        expect(testTodoId).toBeDefined();

        const response = await request(app)
          .put(`/items/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ text: '' })
          .expect(400);

        expect(response.body.error).toBe('Todo text is required');
      });

      test('should reject text update with only whitespace', async () => {
        expect(testTodoId).toBeDefined();

        const response = await request(app)
          .put(`/items/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ text: '   ' })
          .expect(400);

        expect(response.body.error).toBe('Todo text is required');
      });

      test('should reject text that is too long', async () => {
        expect(testTodoId).toBeDefined();

        const longText = 'a'.repeat(201);
        const response = await request(app)
          .put(`/items/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ text: longText })
          .expect(400);

        expect(response.body.error).toBe('Todo text too long (max 200 characters)');
      });

      test('should reject request without token', async () => {
        const response = await request(app)
          .put('/items/1')
          .send({ text: 'Updated Todo' })
          .expect(401);

        expect(response.body.error).toBe('Access token required');
      });
    });

    describe('DELETE /items/:id', () => {
      test('should delete todo', async () => {
        expect(testTodoId).toBeDefined();

        const response = await request(app)
          .delete(`/items/${testTodoId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.todo.id).toBe(testTodoId);

        const getResponse = await request(app)
          .get('/items')
          .set('Authorization', `Bearer ${authToken}`);

        const deletedTodo = getResponse.body.find(todo => todo.id === testTodoId);
        expect(deletedTodo).toBeUndefined();
      });

      test('should return 404 for non-existent todo', async () => {
        const response = await request(app)
          .delete('/items/99999')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        expect(response.body.error).toBe('Todo not found');
      });

      test('should reject request without token', async () => {
        const response = await request(app)
          .delete('/items/1')
          .expect(401);

        expect(response.body.error).toBe('Access token required');
      });
    });
  });
}); 
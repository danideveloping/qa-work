import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('login page visual test', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await expect(page.getByTestId('login-form')).toBeVisible();
    
    // Take screenshot
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('login page with error visual test', async ({ page }) => {
    await page.goto('/');
    
    // Trigger error state
    await page.getByTestId('username-input').fill('invalid');
    await page.getByTestId('password-input').fill('invalid');
    await page.getByTestId('login-button').click();
    
    // Wait for error to appear
    await expect(page.getByTestId('error-message')).toBeVisible();
    
    // Take screenshot
    await expect(page).toHaveScreenshot('login-page-with-error.png');
  });

  test('todo list page visual test', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    // Wait for todos to load
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
    await expect(page.getByTestId('todos-container')).toBeVisible();
    
    // Take screenshot
    await expect(page).toHaveScreenshot('todo-list-page.png');
  });

  test('todo list with new item visual test', async ({ page }) => {
    // Login and add a new todo
    await page.goto('/');
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
    
    // Add new todo
    await page.getByTestId('new-todo-input').fill('Visual Test Todo');
    await page.getByTestId('add-todo-button').click();
    
    // Wait for new todo to appear
    await expect(page.getByText('Visual Test Todo')).toBeVisible();
    
    // Take screenshot
    await expect(page).toHaveScreenshot('todo-list-with-new-item.png');
  });

  test('todo item in edit mode visual test', async ({ page }) => {
    // Login and start editing a todo
    await page.goto('/');
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
    
    // Start editing first todo
    const firstTodo = page.getByTestId('todo-item').first();
    await firstTodo.getByTestId('edit-button').click();
    
    // Wait for edit mode
    await expect(firstTodo.getByTestId('edit-todo-input')).toBeVisible();
    
    // Take screenshot
    await expect(page).toHaveScreenshot('todo-item-edit-mode.png');
  });

  test('completed todo visual test', async ({ page }) => {
    // Login and toggle a todo
    await page.goto('/');
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
    
    // Find an uncompleted todo and complete it
    const uncompletedTodo = page.getByTestId('todo-item').filter({ hasNotClass: 'completed' }).first();
    await uncompletedTodo.getByTestId('todo-checkbox').click();
    
    // Wait for completion state
    await expect(uncompletedTodo).toHaveClass(/completed/);
    
    // Take screenshot
    await expect(page).toHaveScreenshot('todo-list-with-completed-item.png');
  });

  test('mobile layout visual test', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test login page on mobile
    await page.goto('/');
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page).toHaveScreenshot('mobile-login-page.png');
    
    // Login and test todo page on mobile
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
    await expect(page).toHaveScreenshot('mobile-todo-list-page.png');
  });

  test('empty todo list visual test', async ({ page }) => {
    // Login with user that has no todos
    await page.goto('/');
    await page.getByTestId('username-input').fill('user');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
    
    // Should show empty state or just the user's todos
    await expect(page.getByTestId('todos-container')).toBeVisible();
    
    // Take screenshot
    await expect(page).toHaveScreenshot('todo-list-different-user.png');
  });

  test('error state visual test', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
    
    // Trigger an error by trying to add empty todo
    await page.getByTestId('add-todo-button').click();
    
    // Wait for error
    await expect(page.getByTestId('error-message')).toBeVisible();
    
    // Take screenshot
    await expect(page).toHaveScreenshot('todo-list-with-error.png');
  });

  test('dark mode support visual test', async ({ page }) => {
    // Set dark color scheme preference
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Test login page
    await page.goto('/');
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page).toHaveScreenshot('dark-mode-login-page.png');
    
    // Login and test todo page
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
    await expect(page).toHaveScreenshot('dark-mode-todo-list-page.png');
  });
}); 
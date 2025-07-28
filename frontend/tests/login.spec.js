import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form by default', async ({ page }) => {
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('should show demo credentials', async ({ page }) => {
    await expect(page.getByText('Demo Credentials:')).toBeVisible();
    await expect(page.getByText('Username: admin, Password: password')).toBeVisible();
    await expect(page.getByText('Username: user, Password: password')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Fill in valid credentials
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    
    // Click login
    await page.getByTestId('login-button').click();
    
    // Should redirect to todo list
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
    await expect(page.getByText('Welcome, admin!')).toBeVisible();
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
  });

  test('should reject invalid username', async ({ page }) => {
    await page.getByTestId('username-input').fill('invaliduser');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Invalid credentials');
    
    // Should remain on login page
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('should reject invalid password', async ({ page }) => {
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Invalid credentials');
  });

  test('should require both username and password', async ({ page }) => {
    // Try to login without username
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Username and password are required');
    
    // Clear and try without password
    await page.getByTestId('password-input').clear();
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Username and password are required');
  });

  test('should handle empty form submission', async ({ page }) => {
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Username and password are required');
  });

  test('should show loading state during login', async ({ page }) => {
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    
    // Intercept the login request to make it slower
    await page.route('**/login', async route => {
      await page.waitForTimeout(1000); // Delay for 1 second
      route.continue();
    });
    
    const loginButton = page.getByTestId('login-button');
    await loginButton.click();
    
    // Check loading state
    await expect(loginButton).toContainText('Logging in...');
    await expect(loginButton).toBeDisabled();
    
    // Wait for login to complete
    await expect(page.getByText('Welcome, admin!')).toBeVisible();
  });

  test('should persist login state on page refresh', async ({ page }) => {
    // Login first
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByText('Welcome, admin!')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Should still be logged in
    await expect(page.getByText('Welcome, admin!')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByText('Welcome, admin!')).toBeVisible();
    
    // Logout
    await page.getByTestId('logout-button').click();
    
    // Should return to login page
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should clear error message on successful retry', async ({ page }) => {
    // First, trigger an error
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('error-message')).toBeVisible();
    
    // Now login with correct credentials
    await page.getByTestId('password-input').clear();
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    // Error should be gone and login should succeed
    await expect(page.getByTestId('error-message')).not.toBeVisible();
    await expect(page.getByText('Welcome, admin!')).toBeVisible();
  });
}); 
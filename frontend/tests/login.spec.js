const { test, expect } = require('@playwright/test');

test('should login with valid credentials', async ({ page }) => {
  await page.goto('/');
  
  await page.fill('[data-testid="username-input"]', 'admin');
  await page.fill('[data-testid="password-input"]', 'password');
  
  await page.click('[data-testid="login-button"]');
  
  await expect(page).toHaveURL(/.*\/$/);
  await expect(page.locator('text=Welcome, admin!')).toBeVisible();
});

test('should reject invalid credentials', async ({ page }) => {
  await page.goto('/');
  
  await page.fill('[data-testid="username-input"]', 'wronguser');
  await page.fill('[data-testid="password-input"]', 'wrongpass');
  await page.click('[data-testid="login-button"]');
  
  await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  
  await expect(page).toHaveURL(/.*\/$/);
});

test('should logout successfully', async ({ page }) => {
  await page.goto('/');
  
  await page.fill('[data-testid="username-input"]', 'admin');
  await page.fill('[data-testid="password-input"]', 'password');
  await page.click('[data-testid="login-button"]');
  
  await expect(page.locator('text=Welcome, admin!')).toBeVisible();
  
  await page.click('.logout-btn');
  
  await expect(page.locator('h2:has-text("Login")')).toBeVisible();
}); 
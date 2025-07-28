const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="username-input"]', 'admin');
  await page.fill('[data-testid="password-input"]', 'password');
  await page.click('[data-testid="login-button"]');
  
  await page.waitForSelector('.todo-list', { timeout: 10000 });
});

test('should display todos after login', async ({ page }) => {
  const todoItems = page.locator('.todo-item');
  await expect(todoItems.first()).toBeVisible();
  
  const firstTodo = todoItems.first();
  await expect(firstTodo.locator('.todo-text')).toBeVisible();
  await expect(firstTodo.locator('input[type="checkbox"]')).toBeVisible();
});

test('should create new todo', async ({ page }) => {
  const uniqueTitle = `Test Todo from Playwright ${Date.now()}`;
  
  await page.fill('.todo-input', uniqueTitle);
  await page.click('.add-todo-btn');
  
  const newTodo = page.locator('.todo-item', { hasText: uniqueTitle });
  await expect(newTodo).toBeVisible({ timeout: 10000 });
  
  await expect(newTodo.locator('.todo-text')).toContainText(uniqueTitle);
  await expect(newTodo.locator('input[type="checkbox"]')).not.toBeChecked();
  
  await expect(page.locator('.todo-input')).toHaveValue('');
});

test('should toggle todo completion status', async ({ page }) => {
  const uniqueTitle = `Test Toggle Todo ${Date.now()}`;
  
  await page.fill('.todo-input', uniqueTitle);
  await page.click('.add-todo-btn');
  
  const newTodo = page.locator('.todo-item').filter({ hasText: uniqueTitle });
  await expect(newTodo).toBeVisible({ timeout: 10000 });
  
  const checkbox = newTodo.locator('input[type="checkbox"]');
  await expect(checkbox).not.toBeChecked();
  
  await checkbox.click();
  await expect(checkbox).toBeChecked();
  await expect(newTodo).toHaveClass(/completed/);
  
  await checkbox.click();
  await expect(checkbox).not.toBeChecked();
  await expect(newTodo).not.toHaveClass(/completed/);
});

test('should show edit button on existing todo', async ({ page }) => {
  const todoItems = page.locator('.todo-item');
  const firstTodo = todoItems.first();
  
  await expect(firstTodo).toBeVisible();
  await expect(firstTodo.locator('.edit-btn')).toBeVisible();
  
  await firstTodo.locator('.edit-btn').click();
  
  await page.waitForTimeout(1000);
  
  await expect(firstTodo.locator('.edit-input')).toBeVisible({ timeout: 10000 });
  await expect(firstTodo.locator('.save-btn')).toBeVisible();
  await expect(firstTodo.locator('.cancel-btn')).toBeVisible();
});

test('should delete todo', async ({ page }) => {
  const uniqueTitle = `Todo to Delete ${Date.now()}`;
  
  await page.fill('.todo-input', uniqueTitle);
  await page.click('.add-todo-btn');
  
  const todoItem = page.locator('.todo-item').filter({ hasText: uniqueTitle });
  await expect(todoItem).toBeVisible({ timeout: 10000 });
  
  page.on('dialog', dialog => dialog.accept());
  
  await todoItem.locator('.delete-btn').click();
  await expect(todoItem).not.toBeVisible();
}); 
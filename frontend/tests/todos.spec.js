import { test, expect } from '@playwright/test';

test.describe('Todo Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.getByTestId('username-input').fill('admin');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();
    
    // Wait for todos to load
    await expect(page.getByRole('heading', { name: 'My Todos' })).toBeVisible();
  });

  test('should display existing todos', async ({ page }) => {
    await expect(page.getByTestId('todos-container')).toBeVisible();
    
    // Should have pre-existing todos
    const todoItems = page.getByTestId('todo-item');
    await expect(todoItems).toHaveCountGreaterThan(0);
    
    // Check todo structure
    const firstTodo = todoItems.first();
    await expect(firstTodo.getByTestId('todo-checkbox')).toBeVisible();
    await expect(firstTodo.getByTestId('todo-title')).toBeVisible();
    await expect(firstTodo.getByTestId('edit-button')).toBeVisible();
    await expect(firstTodo.getByTestId('delete-button')).toBeVisible();
  });

  test('should display todos summary', async ({ page }) => {
    const summary = page.locator('.todos-summary');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText('Total:');
    await expect(summary).toContainText('Completed:');
    await expect(summary).toContainText('Pending:');
  });

  test('should create a new todo', async ({ page }) => {
    const newTodoTitle = 'Test Todo from Playwright';
    
    // Add new todo
    await page.getByTestId('new-todo-input').fill(newTodoTitle);
    await page.getByTestId('add-todo-button').click();
    
    // Should appear in the list
    await expect(page.getByText(newTodoTitle)).toBeVisible();
    
    // Check the new todo structure
    const newTodo = page.getByTestId('todo-item').filter({ hasText: newTodoTitle });
    await expect(newTodo.getByTestId('todo-checkbox')).not.toBeChecked();
    await expect(newTodo.getByTestId('todo-title')).toContainText(newTodoTitle);
    
    // Input should be cleared
    await expect(page.getByTestId('new-todo-input')).toHaveValue('');
  });

  test('should not create todo with empty title', async ({ page }) => {
    const initialTodoCount = await page.getByTestId('todo-item').count();
    
    // Try to add empty todo
    await page.getByTestId('add-todo-button').click();
    
    // Should show error
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Todo title is required');
    
    // Todo count should remain the same
    await expect(page.getByTestId('todo-item')).toHaveCount(initialTodoCount);
  });

  test('should toggle todo completion status', async ({ page }) => {
    // Find an uncompleted todo
    const uncompletedTodo = page.getByTestId('todo-item').filter({ hasNotClass: 'completed' }).first();
    const checkbox = uncompletedTodo.getByTestId('todo-checkbox');
    
    // Should not be checked initially
    await expect(checkbox).not.toBeChecked();
    
    // Click to complete
    await checkbox.click();
    
    // Should be checked and have completed class
    await expect(checkbox).toBeChecked();
    await expect(uncompletedTodo).toHaveClass(/completed/);
    
    // Click again to uncomplete
    await checkbox.click();
    
    // Should be unchecked and not have completed class
    await expect(checkbox).not.toBeChecked();
    await expect(uncompletedTodo).not.toHaveClass(/completed/);
  });

  test('should edit todo title', async ({ page }) => {
    const editedTitle = 'Edited Todo Title';
    const todoItem = page.getByTestId('todo-item').first();
    
    // Click edit button
    await todoItem.getByTestId('edit-button').click();
    
    // Should show edit input
    const editInput = todoItem.getByTestId('edit-todo-input');
    await expect(editInput).toBeVisible();
    await expect(editInput).toBeFocused();
    
    // Should show save/cancel buttons
    await expect(todoItem.getByTestId('save-edit-button')).toBeVisible();
    await expect(todoItem.getByTestId('cancel-edit-button')).toBeVisible();
    
    // Edit and save
    await editInput.clear();
    await editInput.fill(editedTitle);
    await todoItem.getByTestId('save-edit-button').click();
    
    // Should show updated title
    await expect(todoItem.getByTestId('todo-title')).toContainText(editedTitle);
    
    // Edit mode should be hidden
    await expect(editInput).not.toBeVisible();
    await expect(todoItem.getByTestId('edit-button')).toBeVisible();
  });

  test('should cancel todo edit', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').first();
    const originalTitle = await todoItem.getByTestId('todo-title').textContent();
    
    // Start editing
    await todoItem.getByTestId('edit-button').click();
    
    // Change text but cancel
    const editInput = todoItem.getByTestId('edit-todo-input');
    await editInput.clear();
    await editInput.fill('This should be cancelled');
    await todoItem.getByTestId('cancel-edit-button').click();
    
    // Should revert to original title
    await expect(todoItem.getByTestId('todo-title')).toContainText(originalTitle);
    
    // Edit mode should be hidden
    await expect(editInput).not.toBeVisible();
    await expect(todoItem.getByTestId('edit-button')).toBeVisible();
  });

  test('should save edit with Enter key', async ({ page }) => {
    const editedTitle = 'Edited with Enter Key';
    const todoItem = page.getByTestId('todo-item').first();
    
    // Start editing
    await todoItem.getByTestId('edit-button').click();
    
    // Edit and press Enter
    const editInput = todoItem.getByTestId('edit-todo-input');
    await editInput.clear();
    await editInput.fill(editedTitle);
    await editInput.press('Enter');
    
    // Should save the changes
    await expect(todoItem.getByTestId('todo-title')).toContainText(editedTitle);
    await expect(editInput).not.toBeVisible();
  });

  test('should cancel edit with Escape key', async ({ page }) => {
    const todoItem = page.getByTestId('todo-item').first();
    const originalTitle = await todoItem.getByTestId('todo-title').textContent();
    
    // Start editing
    await todoItem.getByTestId('edit-button').click();
    
    // Change text and press Escape
    const editInput = todoItem.getByTestId('edit-todo-input');
    await editInput.clear();
    await editInput.fill('This should be cancelled');
    await editInput.press('Escape');
    
    // Should revert to original title
    await expect(todoItem.getByTestId('todo-title')).toContainText(originalTitle);
    await expect(editInput).not.toBeVisible();
  });

  test('should delete todo with confirmation', async ({ page }) => {
    // Create a new todo to delete
    const todoToDelete = 'Todo to Delete';
    await page.getByTestId('new-todo-input').fill(todoToDelete);
    await page.getByTestId('add-todo-button').click();
    
    // Find the new todo
    const todoItem = page.getByTestId('todo-item').filter({ hasText: todoToDelete });
    await expect(todoItem).toBeVisible();
    
    // Setup dialog handler
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('Are you sure you want to delete this todo?');
      await dialog.accept();
    });
    
    // Delete the todo
    await todoItem.getByTestId('delete-button').click();
    
    // Should be removed from list
    await expect(todoItem).not.toBeVisible();
    await expect(page.getByText(todoToDelete)).not.toBeVisible();
  });

  test('should not delete todo when cancelling confirmation', async ({ page }) => {
    // Create a new todo
    const todoToKeep = 'Todo to Keep';
    await page.getByTestId('new-todo-input').fill(todoToKeep);
    await page.getByTestId('add-todo-button').click();
    
    const todoItem = page.getByTestId('todo-item').filter({ hasText: todoToKeep });
    await expect(todoItem).toBeVisible();
    
    // Setup dialog handler to cancel
    page.on('dialog', async dialog => {
      await dialog.dismiss();
    });
    
    // Try to delete
    await todoItem.getByTestId('delete-button').click();
    
    // Should still be visible
    await expect(todoItem).toBeVisible();
    await expect(page.getByText(todoToKeep)).toBeVisible();
  });

  test('should show loading states during operations', async ({ page }) => {
    const newTodoTitle = 'Loading Test Todo';
    
    // Test add loading state
    await page.getByTestId('new-todo-input').fill(newTodoTitle);
    
    // Intercept request to slow it down
    await page.route('**/items', async route => {
      if (route.request().method() === 'POST') {
        await page.waitForTimeout(500);
      }
      route.continue();
    });
    
    const addButton = page.getByTestId('add-todo-button');
    await addButton.click();
    
    // Should show loading state
    await expect(addButton).toContainText('Adding...');
    await expect(addButton).toBeDisabled();
    
    // Wait for completion
    await expect(page.getByText(newTodoTitle)).toBeVisible();
    await expect(addButton).toContainText('Add Todo');
    await expect(addButton).not.toBeDisabled();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept requests to simulate network error
    await page.route('**/items', route => {
      if (route.request().method() === 'POST') {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
    
    // Try to add a todo
    await page.getByTestId('new-todo-input').fill('Network Error Test');
    await page.getByTestId('add-todo-button').click();
    
    // Should show error message
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Failed to add todo');
  });

  test('should filter todos by completion status visually', async ({ page }) => {
    // Get all todos
    const allTodos = page.getByTestId('todo-item');
    const todoCount = await allTodos.count();
    
    if (todoCount > 0) {
      // Find completed and pending todos
      const completedTodos = page.getByTestId('todo-item').filter({ hasClass: 'completed' });
      const pendingTodos = page.getByTestId('todo-item').filter({ hasNotClass: 'completed' });
      
      const completedCount = await completedTodos.count();
      const pendingCount = await pendingTodos.count();
      
      // Verify summary matches actual counts
      const summary = page.locator('.todos-summary');
      await expect(summary).toContainText(`Total: ${todoCount}`);
      await expect(summary).toContainText(`Completed: ${completedCount}`);
      await expect(summary).toContainText(`Pending: ${pendingCount}`);
      
      // Verify visual styling
      if (completedCount > 0) {
        const firstCompleted = completedTodos.first();
        await expect(firstCompleted).toHaveClass(/completed/);
        await expect(firstCompleted.getByTestId('todo-checkbox')).toBeChecked();
      }
      
      if (pendingCount > 0) {
        const firstPending = pendingTodos.first();
        await expect(firstPending).not.toHaveClass(/completed/);
        await expect(firstPending.getByTestId('todo-checkbox')).not.toBeChecked();
      }
    }
  });
}); 
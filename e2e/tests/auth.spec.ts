import { test, expect } from '@playwright/test';
import { createTestUserAndLogin } from '../helpers/auth';

test.describe('Authentication Flow', () => {
  test('User can sign up and login successfully', async ({ page }) => {
    // Attempting sign up and login
    await createTestUserAndLogin(page);
    
    // Verify dashboard is loaded and visible
    await expect(page).toHaveURL('/dashboard');
    // Ensure dashboard header or user-specific greeting is there
    await expect(page.getByText('Dashboard', { exact: false })).toBeVisible();
  });

  test('User can logout successfully', async ({ page }) => {
    await createTestUserAndLogin(page);
    
    // Perform logout
    // Using a robust selector for logout.
    const logoutButton = page.locator('button').filter({ hasText: 'Log out' }).or(page.locator('button').filter({ hasText: 'Logout' })).or(page.getByRole('menuitem', { name: 'Log out' }));
    
    // If it's inside a user menu, we might need to click the user menu first
    const userMenuButton = page.getByRole('button', { name: 'Open user menu' }).or(page.locator('button.user-menu-btn'));
    if (await userMenuButton.isVisible()) {
      await userMenuButton.click();
    }
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    } else {
      // Fallback if we can't find a logout button
      // Let's just navigate to login? No, the test should fail if there's no logout button.
      await page.click('text=Logout'); // Force it to try text
    }

    // Should redirect to signin
    await expect(page).toHaveURL('/signin');
    
    // Attempt to navigate to protected route
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/signin');
  });

  test('Unauthenticated user is redirected to signin', async ({ page }) => {
    // Go directly to a protected route
    await page.goto('/dashboard');
    
    // Should be redirected to signin
    await expect(page).toHaveURL('/signin');
  });

  test('Invalid credentials show error', async ({ page }) => {
    await page.goto('/signin');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'Invalid123!');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.getByText(/invalid/i).or(page.getByText(/incorrect/i))).toBeVisible();
    // URL should remain signin
    await expect(page).toHaveURL('/signin');
  });
});

import { test, expect } from '@playwright/test';
import { createTestUserAndLogin } from '../helpers/auth';

test.describe('Dashboard Flow', () => {
  test('Dashboard loads meaningful data for authenticated user', async ({ page }) => {
    await createTestUserAndLogin(page);
    
    // We should be on the dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify dashboard renders the returned data (e.g. credits, saved ideas, history)
    // There should be a welcome message
    await expect(page.getByText(/dashboard/i).first()).toBeVisible();

    // Verify Average Score is displayed instead of credits
    await expect(page.getByText(/average score/i).first()).toBeVisible();

    // Verify sections or links to other tools
    await expect(page.getByText(/pitch deck/i).first()).toBeVisible();
    await expect(page.getByText(/canvas/i).first()).toBeVisible();
  });
});

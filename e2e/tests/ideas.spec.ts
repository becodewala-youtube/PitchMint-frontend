import { test, expect } from '@playwright/test';
import { createTestUserAndLogin } from '../helpers/auth';

test.describe('Idea Workflow', () => {
  test('User can submit an idea and view validation results', async ({ page }) => {
    // 1. Authenticate
    await createTestUserAndLogin(page);

    // 2. Navigate to Submit Idea
    // It might be a button on the dashboard or accessible via URL
    await page.goto('/submit-idea');
    await expect(page).toHaveURL('/submit-idea');

    // 3. Enter a startup idea
    // Fill the primary textarea or textbox
    const ideaInput = page.getByRole('textbox').first();
    await ideaInput.waitFor({ state: 'visible' });
    await ideaInput.fill('A platform for automated end-to-end testing of web applications using AI.');

    // 4. Submit
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Validate")').first();
    await submitButton.click();

    // 5. Wait for loading state and then result
    // The loading state should end and we should see results
    // We expect to be redirected to /idea/:id or see a results view
    await page.waitForURL(/\/idea\/[a-zA-Z0-9_-]+/);

    // 6. Verify Results
    // There should be some analysis result visible on the screen
    await expect(page.getByText(/score/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('Insufficient credits handling', async ({ page }) => {
    // 1. Authenticate with a new test user
    // A fresh test user should have some credits according to the system, 
    // but if we need a user with NO credits, we would ideally mock the API or deduct them.
    // For this test, we can intercept the API response to simulate 0 credits.
    
    await createTestUserAndLogin(page);
    
    // Intercept the backend route that handles credit checking or idea submission
    await page.route('**/api/ideas/validate', async route => {
      // Simulate 402 Payment Required for insufficient credits
      await route.fulfill({
        status: 402,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Insufficient credits',
        })
      });
    });

    await page.goto('/submit-idea');
    
    const ideaInput = page.getByRole('textbox').first();
    await ideaInput.waitFor({ state: 'visible' });
    await ideaInput.fill('An idea that will fail due to no credits.');

    const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Validate")').first();
    await submitButton.click();

    // 4. User sees the intended insufficient-credit UX
    // Could be a toast, a modal, or an inline error message
    await expect(page.getByText(/insufficient credits/i).first()).toBeVisible({ timeout: 5000 });
    
    // Ensure no false success state
    expect(page.url()).not.toMatch(/\/idea\/[a-zA-Z0-9_-]+/);
  });
});

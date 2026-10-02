import { Page } from '@playwright/test';

export async function createTestUserAndLogin(page: Page) {
  // Use a unique email for each test run to avoid conflicts
  const timestamp = Date.now();
  const testUser = {
    name: `E2E User ${timestamp}`,
    email: `e2e_${timestamp}@example.com`,
    password: 'Password123!',
  };

  // Navigate to signup
  await page.goto('/signup');
  
  // Fill in the form
  await page.fill('input[type="text"]', testUser.name);
  await page.fill('input[type="email"]', testUser.email);
  await page.fill('input[type="password"]', testUser.password);
  
  // Submit the form
  await page.click('button[type="submit"]');

  // We should be redirected to the login page (or dashboard depending on flow)
  // According to PitchMint flow, it redirects to login after signup, or shows a success message.
  // Wait for the signin page URL
  await page.waitForURL('/signin');
  
  // Login with the new user
  await page.fill('input[type="email"]', testUser.email);
  await page.fill('input[type="password"]', testUser.password);
  await page.click('button[type="submit"]');

  // Verify successful login by checking for the dashboard URL
  await page.waitForURL('/dashboard');

  return testUser;
}

export async function login(page: Page, email: string, password: string = 'Password123!') {
  await page.goto('/signin');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

export async function logout(page: Page) {
  // Look for the logout button and click it
  // Using role or text depending on the UI
  await page.click('button:has-text("Logout"), button[aria-label="Logout"], a:has-text("Log out")');
  await page.waitForURL('/signin');
}

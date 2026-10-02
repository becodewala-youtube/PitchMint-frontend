import { Page } from '@playwright/test';

export async function createTestUserAndLogin(page: Page) {
  // Use a unique email for each test run to avoid conflicts
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7);
  const testUser = {
    name: `E2E User ${timestamp}`,
    email: `e2e_${timestamp}_${random}@example.com`,
    password: 'Password123!',
  };

  // Navigate to signup
  await page.goto('/signup');
  
  await page.getByPlaceholder('John Doe', { exact: false }).fill(testUser.name).catch(() => page.fill('input[type="text"]', testUser.name));
  await page.getByPlaceholder('you@example.com', { exact: false }).fill(testUser.email).catch(() => page.fill('input[type="email"]', testUser.email));
  
  const passwordInputs = page.locator('input[type="password"]');
  const count = await passwordInputs.count();
  for (let i = 0; i < count; i++) {
    await passwordInputs.nth(i).fill(testUser.password);
  }
  
  // Submit the form
  await page.click('button[type="submit"]');

  // We should be redirected to the verify-email page
  await page.waitForURL(/\/verify-email/);
  
  // Since we bypassed email verification in the backend for E2E, we can directly go to signin
  await page.goto('/signin');
  
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

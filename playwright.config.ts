import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        VITE_API_URL: 'http://localhost:5000/api',
      }
    },
    {
      command: process.env.CI 
        ? 'cd ../backend && npm run start' // In CI, we expect the backend to be built and run
        : 'cd ../PitchMint-Backend && npm run dev', // Locally, we can use the dev server
      url: 'http://localhost:5000/api/health', // Need to make sure there's a health endpoint or we can wait for another
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
      env: {
        PORT: '5000',
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/pitchmint-e2e-local',
        JWT_SECRET: 'test-e2e-jwt-secret-key',
        NODE_ENV: 'test',
        // Mock values for required external APIs if they are validated at startup
        GEMINI_API_KEY: 'mock_gemini_key',
        RAZORPAY_KEY_ID: 'mock_rzp_key',
        RAZORPAY_KEY_SECRET: 'mock_rzp_secret',
        RAZORPAY_WEBHOOK_SECRET: 'mock_rzp_webhook',
      }
    }
  ],
});

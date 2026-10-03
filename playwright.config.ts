import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend .env to get the real MongoDB connection string
dotenv.config({ path: path.resolve(__dirname, '../PitchMint-Backend/.env') });

let e2eMongoUri = 'mongodb://127.0.0.1:27017/pitchmint-e2e-local';
if (process.env.MONGODB_URI) {
  e2eMongoUri = process.env.MONGODB_URI;
  if (e2eMongoUri.includes('IDEA')) {
    e2eMongoUri = e2eMongoUri.replace('IDEA', 'IDEA_E2E');
  } else if (!e2eMongoUri.includes('_E2E')) {
    e2eMongoUri += '_E2E';
  }
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e/tests',
  timeout: 60 * 1000, // Increased from 30s: free-tier MongoDB Atlas throttles concurrent writes/reads during parallel execution
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
    baseURL: 'http://127.0.0.1:5174',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
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
      command: 'npm run build && npm run preview -- --port 5174 --host 127.0.0.1',
      url: 'http://127.0.0.1:5174',
      reuseExistingServer: false,
      timeout: 120 * 1000,
      env: {
        VITE_API_URL: 'http://127.0.0.1:5001',
      }
    },
    {
      command: process.env.CI 
        ? 'cd ../PitchMint-Backend && npm run start' // In CI, we expect the backend to be built and run
        : 'cd ../PitchMint-Backend && npm run dev', // Locally, we can use the dev server
      url: 'http://127.0.0.1:5001/', // Root is always mounted and returns 200
      reuseExistingServer: false,
      timeout: 120 * 1000,
      env: {
        PORT: '5001',
        MONGODB_URI: e2eMongoUri,
        JWT_SECRET: 'test-e2e-jwt-secret-key',
        NODE_ENV: 'test',
        // Mock values for required external APIs if they are validated at startup
        GEMINI_API_KEY: 'mock_gemini_key',
        RAZORPAY_KEY_ID: 'mock_rzp_key',
        RAZORPAY_KEY_SECRET: 'mock_rzp_secret',
        RAZORPAY_WEBHOOK_SECRET: 'mock_rzp_webhook',
        E2E_TEST: 'true',
      }
    }
  ],
});

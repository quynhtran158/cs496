import { defineConfig } from '@playwright/test';

/**
 * Playwright config for GatheringGlobe
 *
 * - Reuses the already-running `npm run dev:backend` + `npm run dev:frontend`
 *   servers; starts them only if not already up.
 * - Tests run serially (single worker) because many tests share state in
 *   MongoDB (signup/login, event creation, join-as-attendee, etc.).
 * - Screenshots land in the `screenshots/` folder at the repo root.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  webServer: [
    {
      command: 'npm run dev:backend',
      url: 'http://localhost:5001/',
      reuseExistingServer: true,
      timeout: 90_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'npm run dev:frontend',
      url: 'http://localhost:5173/',
      reuseExistingServer: true,
      timeout: 90_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});

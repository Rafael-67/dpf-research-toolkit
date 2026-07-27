import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  timeout: 60_000,
  retries: 0,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4173/Delivered-Protection-Framework/",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "vite --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173/Delivered-Protection-Framework/",
    reuseExistingServer: true,
  },
});

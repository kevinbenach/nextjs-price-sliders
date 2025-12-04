import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.mts'],
    globals: true,
    // Exclude E2E tests (run separately with Playwright)
    exclude: ['**/node_modules/**', '**/e2e/**', '**/.{idea,git,cache,output,temp}/**'],
    // Conservative timeouts for CI reliability
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    // Using threads is faster than forks
    pool: 'threads',
    // Conservative concurrency for CI (prevents resource exhaustion)
    maxConcurrency: 3,
    // Enable file parallelism for better performance
    fileParallelism: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
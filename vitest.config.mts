import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.mts'],
    globals: true,
    // Reduced timeouts now that cleanup is fixed
    testTimeout: 5000,
    hookTimeout: 5000,
    // Using threads is faster than forks and should work now
    pool: 'threads',
    // Allow more concurrency for faster test runs
    maxConcurrency: 5,
    // Enable file parallelism for better performance
    fileParallelism: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
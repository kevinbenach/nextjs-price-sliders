import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.mts'],
    globals: true,
    exclude: ['**/node_modules/**', '**/e2e/**', '**/.{idea,git,cache,output,temp}/**'],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    pool: 'threads',
    maxConcurrency: 3,
    fileParallelism: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
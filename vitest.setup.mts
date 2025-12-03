import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

// Clean up after each test
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

// Mock CSS modules
// Vitest doesn't understand CSS imports, so we mock them
// This is fine because we're testing behavior, not styles

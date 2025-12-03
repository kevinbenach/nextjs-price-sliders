import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Clean up after each test
// Order matters: cleanup components first, then timers
afterEach(() => {
  cleanup();           // Unmount React components and run useEffect cleanup
  vi.clearAllTimers(); // Clear any pending fake timers
  vi.useRealTimers();  // Restore real timers for next test
});

// Mock CSS modules
// Vitest doesn't understand CSS imports, so we mock them
// This is fine because we're testing behavior, not styles

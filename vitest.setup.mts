import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Clean up after each test
// Only cleanup React components - let tests manage their own fake timers
afterEach(() => {
  cleanup(); // Unmount React components and run useEffect cleanup
});

// Mock CSS modules
// Vitest doesn't understand CSS imports, so we mock them
// This is fine because we're testing behavior, not styles

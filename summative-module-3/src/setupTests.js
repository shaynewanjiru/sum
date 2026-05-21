import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Adds 'toBeInTheDocument', 'toHaveTextContent', etc.
expect.extend(matchers);

// Cleans up the DOM after every single test so they don't stack up
afterEach(() => {
  cleanup();
});
// Set test environment FIRST before any imports
process.env['NODE_ENV'] = 'test';

// Global test setup
import { config } from 'dotenv';

// Load test environment variables - override any existing .env
config({ path: '.env.test', override: true });

// Global test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests (optional)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

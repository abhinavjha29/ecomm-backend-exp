# Testing Guide

This project uses Jest for both unit and end-to-end (E2E) testing.

## Table of Contents

- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)

## Setup

### Prerequisites

1. Make sure you have a test database set up
2. Copy `.env.example` to `.env.test` and configure test database credentials
3. Install dependencies: `npm install`

### Test Database

The tests use a separate test database to avoid affecting your development data.

```bash
# Create test database
createdb ecommerce_test

# Run migrations
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_test?schema=public" npx prisma migrate deploy
```

## Running Tests

### All Tests

```bash
npm test
```

### Unit Tests Only

```bash
npm run test:unit
```

### E2E Tests Only

```bash
npm run test:e2e
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### CI Mode

```bash
npm run test:ci
```

### With Coverage

```bash
npm test -- --coverage
```

## Test Structure

```
tests/
├── setup.ts                    # Global test setup
├── helpers/
│   ├── test-database.ts       # Database utilities for tests
│   └── test-factory.ts        # Factory functions for test data
├── unit/                      # Unit tests
│   ├── services/
│   │   └── auth.service.test.ts
│   └── utils/
│       ├── password.utils.test.ts
│       ├── jwt.utils.test.ts
│       └── api-response.test.ts
└── e2e/                       # End-to-end tests
    ├── auth/
    │   └── auth.e2e.test.ts
    └── middleware/
        └── jwt.middleware.e2e.test.ts
```

## Writing Tests

### Unit Tests

Unit tests focus on testing individual functions or classes in isolation.

```typescript
import { PasswordUtils } from '../../../src/modules/auth/utils/password.utils';

describe('PasswordUtils', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'Test@1234';
      const hashedPassword = await PasswordUtils.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });
  });
});
```

### E2E Tests

E2E tests test the entire application flow, including HTTP requests.

```typescript
import request from 'supertest';
import app from '../../../src/app';
import { TestDatabase } from '../../helpers/test-database';

describe('Auth E2E Tests', () => {
  beforeAll(async () => {
    await TestDatabase.initialize();
  });

  beforeEach(async () => {
    await TestDatabase.cleanup();
  });

  afterAll(async () => {
    await TestDatabase.disconnect();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test@1234'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
```

### Using Test Helpers

#### Test Database

```typescript
import { TestDatabase } from '../../helpers/test-database';

// Initialize database connection
await TestDatabase.initialize();

// Clean all test data
await TestDatabase.cleanup();

// Get Prisma client
const prisma = TestDatabase.getInstance();

// Disconnect
await TestDatabase.disconnect();
```

#### Test Factory

```typescript
import { TestFactory } from '../../helpers/test-factory';

// Create a test user
const user = await TestFactory.createUser({
  email: 'test@example.com',
  password: 'Test@1234'
});

// Create multiple users
const users = await TestFactory.createUsers(5);

// Generate signup data (without creating in DB)
const signupData = TestFactory.generateSignupData({
  name: 'John Doe'
});
```

## Best Practices

### 1. Clean Database Between Tests

Always clean the database between tests to ensure test isolation:

```typescript
beforeEach(async () => {
  await TestDatabase.cleanup();
});
```

### 2. Use Descriptive Test Names

```typescript
// Good
it('should return 400 for invalid email format', async () => {});

// Bad
it('should fail', async () => {});
```

### 3. Test One Thing at a Time

Each test should verify one specific behavior.

### 4. Use Arrange-Act-Assert Pattern

```typescript
it('should create a user', async () => {
  // Arrange
  const userData = { name: 'Test', email: 'test@example.com' };

  // Act
  const user = await userService.createUser(userData);

  // Assert
  expect(user.email).toBe(userData.email);
});
```

### 5. Mock External Dependencies

For unit tests, mock external dependencies:

```typescript
jest.mock('../../../src/config/database');
```

### 6. Don't Test Implementation Details

Focus on testing behavior, not implementation.

### 7. Keep Tests Independent

Tests should not depend on the order of execution or state from other tests.

## Coverage Goals

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

Run `npm test -- --coverage` to see current coverage.

## Continuous Integration

The test suite runs automatically on:

- Pull requests
- Pushes to main branch

CI configuration can be found in `.github/workflows/` (if configured).

## Troubleshooting

### Tests Timing Out

Increase timeout in `jest.config.ts`:

```typescript
testTimeout: 30000;
```

### Database Connection Issues

1. Ensure test database exists
2. Check `.env.test` configuration
3. Verify database is running

### Port Already in Use

Make sure no other instance of the app is running on the test port.

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

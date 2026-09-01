# Backend Testing Guide

## Overview

This directory contains all backend tests for the DevConnect application. Tests are organized into unit tests and integration tests.

## Test Structure

```
tests/
├── unit/              # Unit tests for individual functions
│   ├── validation.test.js
│   └── auth.test.js
├── integration/       # Integration tests for API endpoints
├── helpers/           # Test utilities
│   └── testDb.js     # In-memory database helper
├── setup.js          # Global test setup
└── README.md         # This file
```

## Running Tests

### Install Dependencies

First, install the test dependencies:

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run Integration Tests Only

```bash
npm run test:integration
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm test
```

Coverage reports will be generated in the `coverage/` directory.

## Test Coverage

Current test coverage:

- **Validation Utils**: 100%
  - Password validation (strong password requirements)
  - Email validation
  - Name validation
  - Profile edit validation

- **Authentication**: 100%
  - Password hashing with bcrypt
  - JWT token generation
  - Token validation
  - User model methods

## Writing New Tests

### Unit Test Example

```javascript
const { myFunction } = require('../../src/utils/myUtil');

describe('My Function', () => {
  test('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Integration Test Example

```javascript
const request = require('supertest');
const app = require('../../src/app');
const { connect, closeDatabase, clearDatabase } = require('../helpers/testDb');

describe('API Endpoint', () => {
  beforeAll(async () => await connect());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  test('should return 200', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
  });
});
```

## Test Database

Integration tests use MongoDB Memory Server, which creates an in-memory database for testing. This ensures:

- Tests don't affect production data
- Fast test execution
- Automatic cleanup after tests
- No external database required

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up test data after each test
3. **Mocking**: Mock external services and APIs
4. **Descriptive Names**: Use clear, descriptive test names
5. **Arrange-Act-Assert**: Follow the AAA pattern
6. **Coverage**: Aim for 70%+ code coverage

## Troubleshooting

### Tests Failing

1. Ensure all dependencies are installed: `npm install`
2. Check that MongoDB Memory Server is working
3. Verify environment variables are set correctly
4. Check test logs for specific errors

### Slow Tests

- Integration tests may take longer due to database operations
- Use `npm run test:unit` for faster feedback during development

### Coverage Issues

- Run `npm test` to see coverage report
- Check `coverage/lcov-report/index.html` for detailed coverage

## CI/CD Integration

Tests run automatically on:
- Every push to GitHub
- Every pull request
- Before deployment

Tests must pass before code can be merged.

# Testing Guide

Complete testing setup for AMARBN Associação Next.js application.

## Setup

### Dependencies

Testing uses Jest with TypeScript support:

```bash
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Configuration

- `jest.config.js` — Jest configuration for Next.js
- `jest.setup.js` — Test environment setup with mocked env variables

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Files

### lib/__tests__/auth.test.ts
6 tests covering authentication:
- Password hashing (unique hashes, verify correct/incorrect)
- Session token creation and verification
- Token validation (invalid/expired/tampered)
- Session cookie attributes

### lib/__tests__/utils.test.ts
10 tests for validation:
- CPF formatting and validation (valid/invalid checksums)
- Login schema validation (email, password)
- Registration schema validation
- Error formatting (Zod errors in Portuguese)

### lib/__tests__/crypto.test.ts
9 tests for encryption/decryption:
- Encryption/decryption of sensitive data
- SHA256 hashing for data lookups
- Hash verification
- Empty strings and special characters

## Coverage

Target: >95% for core modules

```bash
npm run test:coverage

# View report
open coverage/lcov-report/index.html
```

## Mocked Environment

Tests run with these mocked env variables:

```typescript
APP_SESSION_SECRET = 'test-secret-key-minimum-32-characters-long'
JWT_SECRET = 'test-jwt-secret-key-minimum-32-characters'
ENCRYPTION_SECRET = 'test-encryption-secret-key-minimum-32'
NODE_ENV = 'test'
```

No real database or API calls during testing.

## CI/CD Integration

GitHub Actions runs tests on every push/PR to main/develop:

1. Install dependencies
2. Run tests with coverage
3. Upload to Codecov
4. Fail if coverage drops

See `.github/workflows/ci.yml` for details.

## Debugging

### Run single test file
```bash
npm test lib/__tests__/auth.test.ts
```

### Run single test
```bash
npm test -- -t "should hash a password"
```

### Watch mode
```bash
npm run test:watch
```

### Verbose output
```bash
npm test -- --verbose
```

## Best Practices

1. Tests are in `lib/__tests__/` next to source files
2. Use `.test.ts` or `.spec.ts` naming
3. Mock external dependencies
4. Test happy paths and error cases
5. Keep tests focused and isolated
6. Use descriptive test names

## Future Improvements

- [ ] E2E tests with Playwright
- [ ] Integration tests for API routes
- [ ] Performance benchmarks
- [ ] Visual regression testing

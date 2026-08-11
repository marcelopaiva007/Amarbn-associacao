import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.APP_SESSION_SECRET = 'test-secret-key-minimum-32-characters-long'
process.env.JWT_SECRET = 'test-jwt-secret-key-minimum-32-characters'
process.env.ENCRYPTION_SECRET = 'test-encryption-secret-key-minimum-32'
process.env.NODE_ENV = 'test'

import {
  formatCPF,
  isValidCPF,
  LoginSchema,
  RegisterSchema,
  formatZodErrors,
} from '../utils';

describe('CPF Validation', () => {
  it('should format CPF removing non-digits', () => {
    const cpf = '123.456.789-09';
    const formatted = formatCPF(cpf);

    expect(formatted).toBe('12345678909');
  });

  it('should accept valid CPF', () => {
    // Valid CPF (checksum verified)
    const validCPF = '11144477735'; // Example of valid CPF
    const isValid = isValidCPF(validCPF);

    expect(isValid).toBe(true);
  });

  it('should reject CPF with wrong length', () => {
    const cpf = '123456789';
    const isValid = isValidCPF(cpf);

    expect(isValid).toBe(false);
  });

  it('should reject CPF with all same digits', () => {
    const cpf = '11111111111';
    const isValid = isValidCPF(cpf);

    expect(isValid).toBe(false);
  });

  it('should reject CPF with invalid checksum', () => {
    const cpf = '12345678901';
    const isValid = isValidCPF(cpf);

    expect(isValid).toBe(false);
  });
});

describe('Login Validation', () => {
  it('should accept valid login credentials', () => {
    const validLogin = {
      email: 'user@example.com',
      password: 'password123456',
    };

    const result = LoginSchema.safeParse(validLogin);

    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidLogin = {
      email: 'not-an-email',
      password: 'password123456',
    };

    const result = LoginSchema.safeParse(invalidLogin);

    expect(result.success).toBe(false);
  });

  it('should reject password shorter than 6 characters', () => {
    const invalidLogin = {
      email: 'user@example.com',
      password: 'short',
    };

    const result = LoginSchema.safeParse(invalidLogin);

    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const invalidLogin = {
      password: 'password123456',
    };

    const result = LoginSchema.safeParse(invalidLogin);

    expect(result.success).toBe(false);
  });
});

describe('Register Validation', () => {
  it('should accept valid registration data', () => {
    const validRegister = {
      email: 'user@example.com',
      password: 'password123456',
      name: 'John Doe',
      registration: 'REG-001',
      cpf: '11144477735', // Valid CPF
      fullName: 'John Doe Silva',
    };

    const result = RegisterSchema.safeParse(validRegister);

    expect(result.success).toBe(true);
  });

  it('should reject invalid CPF in registration', () => {
    const invalidRegister = {
      email: 'user@example.com',
      password: 'password123456',
      name: 'John Doe',
      registration: 'REG-001',
      cpf: '00000000000', // Invalid CPF
      fullName: 'John Doe Silva',
    };

    const result = RegisterSchema.safeParse(invalidRegister);

    expect(result.success).toBe(false);
  });

  it('should reject short password in registration', () => {
    const invalidRegister = {
      email: 'user@example.com',
      password: 'short', // Less than 8 chars
      name: 'John Doe',
      registration: 'REG-001',
      cpf: '11144477735',
      fullName: 'John Doe Silva',
    };

    const result = RegisterSchema.safeParse(invalidRegister);

    expect(result.success).toBe(false);
  });
});

describe('Error Formatting', () => {
  it('should format Zod errors in Portuguese', () => {
    const invalidLogin = {
      email: 'not-an-email',
      password: 'short',
    };

    const result = LoginSchema.safeParse(invalidLogin);

    if (!result.success) {
      const formatted = formatZodErrors(result.error);

      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('object');
      expect(Object.keys(formatted).length).toBeGreaterThan(0);
    }
  });
});

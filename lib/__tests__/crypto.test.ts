import {
  encryptData,
  decryptData,
  hashSensitiveData,
  verifySensitiveDataHash,
} from '../crypto';

describe('Data Encryption', () => {
  it('should encrypt data', () => {
    const plaintext = '123.456.789-09';
    const encrypted = encryptData(plaintext);

    expect(encrypted).toBeDefined();
    expect(encrypted).not.toBe(plaintext);
    expect(encrypted.length).toBeGreaterThan(0);
  });

  it('should decrypt encrypted data', () => {
    const plaintext = '123.456.789-09';
    const encrypted = encryptData(plaintext);
    const decrypted = decryptData(encrypted);

    expect(decrypted).toBe(plaintext);
  });

  it('should encrypt different data with different results', () => {
    const plaintext1 = '123.456.789-09';
    const plaintext2 = '987.654.321-00';

    const encrypted1 = encryptData(plaintext1);
    const encrypted2 = encryptData(plaintext2);

    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should handle empty string', () => {
    const encrypted = encryptData('');
    const decrypted = decryptData(encrypted);

    expect(decrypted).toBe('');
  });

  it('should handle special characters', () => {
    const plaintext = 'test@email.com#$%&*';
    const encrypted = encryptData(plaintext);
    const decrypted = decryptData(encrypted);

    expect(decrypted).toBe(plaintext);
  });
});

describe('Sensitive Data Hashing', () => {
  it('should hash sensitive data', () => {
    const value = '123.456.789-09';
    const hash = hashSensitiveData(value);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(value);
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should generate same hash for same input', () => {
    const value = '123.456.789-09';
    const hash1 = hashSensitiveData(value);
    const hash2 = hashSensitiveData(value);

    expect(hash1).toBe(hash2);
  });

  it('should generate different hash for different input', () => {
    const value1 = '123.456.789-09';
    const value2 = '987.654.321-00';

    const hash1 = hashSensitiveData(value1);
    const hash2 = hashSensitiveData(value2);

    expect(hash1).not.toBe(hash2);
  });

  it('should verify correct hash', () => {
    const value = '123.456.789-09';
    const hash = hashSensitiveData(value);
    const isValid = verifySensitiveDataHash(value, hash);

    expect(isValid).toBe(true);
  });

  it('should reject incorrect hash', () => {
    const value = '123.456.789-09';
    const hash = hashSensitiveData(value);
    const isValid = verifySensitiveDataHash('different-value', hash);

    expect(isValid).toBe(false);
  });
});

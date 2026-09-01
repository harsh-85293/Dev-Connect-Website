const { validatesignupdata, validateEditProfile } = require('../../src/utils/validation');

describe('Validation Utils', () => {
  describe('validatesignupdata', () => {
    test('should pass with valid signup data', () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          emailId: 'john.doe@example.com',
          password: 'Password123!'
        }
      };

      expect(() => validatesignupdata(req)).not.toThrow();
    });

    test('should throw error when firstName is missing', () => {
      const req = {
        body: {
          lastName: 'Doe',
          emailId: 'john.doe@example.com',
          password: 'Password123!'
        }
      };

      expect(() => validatesignupdata(req)).toThrow('NAME IS NOT VALID');
    });

    test('should throw error when lastName is missing', () => {
      const req = {
        body: {
          firstName: 'John',
          emailId: 'john.doe@example.com',
          password: 'Password123!'
        }
      };

      expect(() => validatesignupdata(req)).toThrow('NAME IS NOT VALID');
    });

    test('should throw error with invalid email', () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          emailId: 'invalid-email',
          password: 'Password123!'
        }
      };

      expect(() => validatesignupdata(req)).toThrow('Email is not a valid email');
    });

    test('should throw error with weak password (no uppercase)', () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          emailId: 'john.doe@example.com',
          password: 'password123!'
        }
      };

      expect(() => validatesignupdata(req)).toThrow('Password must be at least 8 characters and include: uppercase letter, lowercase letter, number, and symbol');
    });

    test('should throw error with weak password (no number)', () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          emailId: 'john.doe@example.com',
          password: 'Password!'
        }
      };

      expect(() => validatesignupdata(req)).toThrow('Password must be at least 8 characters and include: uppercase letter, lowercase letter, number, and symbol');
    });

    test('should throw error with weak password (no symbol)', () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          emailId: 'john.doe@example.com',
          password: 'Password123'
        }
      };

      expect(() => validatesignupdata(req)).toThrow('Password must be at least 8 characters and include: uppercase letter, lowercase letter, number, and symbol');
    });

    test('should throw error with short password', () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          emailId: 'john.doe@example.com',
          password: 'Pass1!'
        }
      };

      expect(() => validatesignupdata(req)).toThrow('Password must be at least 8 characters and include: uppercase letter, lowercase letter, number, and symbol');
    });
  });

  describe('validateEditProfile', () => {
    test('should return true for valid edit fields', () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          about: 'Software Developer'
        }
      };

      const result = validateEditProfile(req);
      expect(result).toBe(true);
    });

    test('should return true for all allowed fields', () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          emailId: 'john@example.com',
          photoUrl: 'https://example.com/photo.jpg',
          gender: 'male',
          age: 25,
          about: 'Developer',
          skills: ['JavaScript', 'React']
        }
      };

      const result = validateEditProfile(req);
      expect(result).toBe(true);
    });

    test('should return false for invalid fields', () => {
      const req = {
        body: {
          firstName: 'John',
          password: 'newpassword', // Not allowed
        }
      };

      const result = validateEditProfile(req);
      expect(result).toBe(false);
    });

    test('should return false when trying to edit _id', () => {
      const req = {
        body: {
          _id: '123456',
          firstName: 'John'
        }
      };

      const result = validateEditProfile(req);
      expect(result).toBe(false);
    });
  });
});

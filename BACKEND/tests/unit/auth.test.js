const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const { connect, closeDatabase, clearDatabase } = require('../helpers/testDb');

describe('Authentication Tests', () => {
  // Connect to test database before all tests
  beforeAll(async () => {
    await connect();
  });

  // Clear database after each test
  afterEach(async () => {
    await clearDatabase();
  });

  // Close database connection after all tests
  afterAll(async () => {
    await closeDatabase();
  });

  describe('Password Hashing', () => {
    test('should hash password with bcrypt', async () => {
      const password = 'Password123!';
      const hashedPassword = await bcrypt.hash(password, 10);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(password.length);
    });

    test('should verify correct password', async () => {
      const password = 'Password123!';
      const hashedPassword = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const password = 'Password123!';
      const wrongPassword = 'WrongPassword123!';
      const hashedPassword = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    test('should generate valid JWT token', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john.doe@example.com',
        password: await bcrypt.hash('Password123!', 10),
      });

      await user.save();

      const token = user.getJWT();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should include user ID in JWT payload', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john.doe@example.com',
        password: await bcrypt.hash('Password123!', 10),
      });

      await user.save();

      const token = user.getJWT();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded._id).toBe(user._id.toString());
    });

    test('should set token expiration', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john.doe@example.com',
        password: await bcrypt.hash('Password123!', 10),
      });

      await user.save();

      const token = user.getJWT();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe('User Model validatePassword Method', () => {
    test('should validate correct password', async () => {
      const password = 'Password123!';
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john.doe@example.com',
        password: await bcrypt.hash(password, 10),
      });

      await user.save();

      const isValid = await user.validatePassword(password);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const password = 'Password123!';
      const wrongPassword = 'WrongPassword123!';
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john.doe@example.com',
        password: await bcrypt.hash(password, 10),
      });

      await user.save();

      const isValid = await user.validatePassword(wrongPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('User Creation', () => {
    test('should create user with hashed password', async () => {
      const password = 'Password123!';
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john.doe@example.com',
        password: await bcrypt.hash(password, 10),
      });

      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.password).not.toBe(password);
      expect(savedUser.emailId).toBe('john.doe@example.com');
    });

    test('should not allow duplicate email', async () => {
      const user1 = new User({
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john.doe@example.com',
        password: await bcrypt.hash('Password123!', 10),
      });

      await user1.save();

      const user2 = new User({
        firstName: 'Jane',
        lastName: 'Doe',
        emailId: 'john.doe@example.com', // Same email
        password: await bcrypt.hash('Password456!', 10),
      });

      await expect(user2.save()).rejects.toThrow();
    });
  });
});

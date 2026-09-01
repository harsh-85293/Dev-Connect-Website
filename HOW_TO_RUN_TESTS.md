# How to Run Tests - DevConnect

## 🚀 Quick Start

### Step 1: Navigate to Backend Directory
```bash
cd BACKEND
```

### Step 2: Install Dependencies (First Time Only)
```bash
npm install
```

### Step 3: Run Tests
```bash
npm test
```

---

## 📋 Available Test Commands

### 1. Run All Tests with Coverage
```bash
npm test
```
**What it does:**
- Runs all unit and integration tests
- Generates code coverage report
- Shows detailed results
- Creates coverage folder with HTML report

### 2. Run Unit Tests Only
```bash
npm run test:unit
```
**What it does:**
- Runs only tests in `tests/unit/` folder
- Faster execution
- Good for quick validation during development

### 3. Run Integration Tests Only
```bash
npm run test:integration
```
**What it does:**
- Runs only tests in `tests/integration/` folder
- Tests API endpoints
- Uses test database

### 4. Run Tests in Watch Mode
```bash
npm run test:watch
```
**What it does:**
- Watches for file changes
- Automatically re-runs tests when code changes
- Great for development
- Press `q` to quit

### 5. Run Tests with Verbose Output
```bash
npm test -- --verbose
```
**What it does:**
- Shows detailed test execution
- Displays each test name and result
- Useful for debugging

---

## 🎯 Step-by-Step Guide

### For Windows (PowerShell/CMD):

```powershell
# 1. Open terminal in project root
cd D:\THE FULL STACK DEVELOPER\NODE JS\VERCEL DEPLOYMENT FILE\devconnect

# 2. Navigate to backend
cd BACKEND

# 3. Install dependencies (if not already installed)
npm install

# 4. Run tests
npm test
```

### For Mac/Linux:

```bash
# 1. Navigate to backend directory
cd BACKEND

# 2. Install dependencies
npm install

# 3. Run tests
npm test
```

---

## 📊 Understanding Test Output

### Successful Test Run:
```
PASS  tests/unit/validation.test.js
  Validation Utils
    validatesignupdata
      ✓ should pass with valid signup data (26 ms)
      ✓ should throw error when firstName is missing (40 ms)
      ...

Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Time:        7.88 s
```

### What the Output Means:
- **PASS** = Test suite passed
- **✓** = Individual test passed
- **(26 ms)** = Time taken for that test
- **22 passed** = Total number of passing tests
- **Coverage** = Percentage of code tested

---

## 📁 Viewing Coverage Report

### After running `npm test`, view detailed coverage:

#### Option 1: Terminal Output
Coverage summary is shown directly in terminal after tests complete.

#### Option 2: HTML Report
```bash
# Open the HTML coverage report
# Windows:
start coverage/lcov-report/index.html

# Mac:
open coverage/lcov-report/index.html

# Linux:
xdg-open coverage/lcov-report/index.html
```

---

## 🔧 Troubleshooting

### Issue 1: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue 2: "Cannot find module 'jest'"
**Solution:** 
```bash
cd BACKEND
npm install
```

### Issue 3: Tests are slow
**Solution:** 
- First run is always slower (downloads MongoDB Memory Server)
- Subsequent runs are faster
- Use `npm run test:unit` for faster feedback

### Issue 4: "MongoDB Memory Server download failed"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue 5: Port already in use
**Solution:**
- Tests use in-memory database, no port conflicts
- If issue persists, restart terminal

---

## 🎓 Test Development Workflow

### During Development:

1. **Start watch mode:**
   ```bash
   npm run test:watch
   ```

2. **Make code changes**

3. **Tests automatically re-run**

4. **Fix any failures**

5. **Press `q` to quit watch mode**

### Before Committing Code:

1. **Run all tests:**
   ```bash
   npm test
   ```

2. **Ensure all tests pass**

3. **Check coverage meets requirements**

4. **Commit your changes**

---

## 📝 Writing New Tests

### Create a new test file:

```bash
# In BACKEND directory
# Create file: tests/unit/myFeature.test.js
```

### Basic test template:

```javascript
describe('My Feature', () => {
  test('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Run your new tests:

```bash
npm test
```

---

## 🚦 CI/CD Integration

### Tests run automatically on:
- Every push to GitHub
- Every pull request
- Before deployment

### Manual trigger:
```bash
npm test
```

---

## 📊 Current Test Statistics

| Metric | Value |
|--------|-------|
| **Total Tests** | 22 |
| **Pass Rate** | 100% |
| **Test Suites** | 2 |
| **Execution Time** | ~8 seconds |
| **Coverage (Tested Files)** | 75% validation, 42% auth |

---

## 🎯 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests with coverage |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:watch` | Watch mode for development |
| `npm test -- --verbose` | Detailed output |

---

## ✅ Checklist Before Running Tests

- [ ] Node.js installed (v14 or higher)
- [ ] In BACKEND directory
- [ ] Dependencies installed (`npm install`)
- [ ] No other tests running
- [ ] Terminal has proper permissions

---

## 💡 Pro Tips

1. **Use watch mode during development** for instant feedback
2. **Run unit tests first** - they're faster
3. **Check coverage report** to find untested code
4. **Write tests before fixing bugs** (TDD approach)
5. **Keep tests isolated** - each test should be independent

---

## 🆘 Need Help?

### Common Questions:

**Q: How long should tests take?**
A: First run: 15-20 seconds. Subsequent runs: 5-10 seconds.

**Q: Do I need a database running?**
A: No! Tests use MongoDB Memory Server (in-memory database).

**Q: Can I run tests while the app is running?**
A: Yes! Tests use a separate test database.

**Q: What if a test fails?**
A: Read the error message, fix the code, and run tests again.

---

## 🎉 Success!

If you see:
```
Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
```

**Congratulations!** All tests are passing! ✅

Your code is tested and ready for deployment! 🚀

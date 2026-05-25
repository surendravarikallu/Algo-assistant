# Testing Documentation — Algo Assistant

This document outlines the testing architecture, configurations, and test runners for the Algo Assistant blockchain AI toolkit.

---

## 1. Testing Setup & Architecture

Algo Assistant uses **Jest** alongside **ts-jest** for high-performance TypeScript unit and integration testing.

- **Test Runner**: Jest
- **TypeScript Compiler Support**: `ts-jest` preprocessor
- **Main Test Suite Location**: Colocated with source code using `.test.ts` extensions.
- **Coverage Tool**: Jest Built-in Istanbul coverage tool.

---

## 2. Running Tests

To run the testing suite, make sure you have installed all development dependencies.

### Installation
```bash
npm install
```

### Run All Tests
```bash
npm run test
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```
This command generates a detailed line-by-line HTML coverage analysis in the `coverage/` directory.

---

## 3. Configuration Details

### Jest Config (`jest.config.cjs`)
The configuration handles ESM modules and maps custom paths:
- Uses `ts-jest` for compiling TypeScript.
- Configured to support ES modules through `useESM: true` and `extensionsToTreatAsEsm`.
- Enables path mapping matching the TypeScript configuration.

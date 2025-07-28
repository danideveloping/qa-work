# Test Plan & Strategy - Todo Application QA Automation

## Overview

This document outlines the testing strategy for a Todo Management Application with React frontend and Node.js backend API, designed to demonstrate comprehensive QA automation skills.

## Application Under Test

**Application**: Todo Management System with Authentication  
**Tech Stack**: React.js + Node.js/Express + JWT Authentication  
**Key Features**: User login/logout, Todo CRUD operations, Completion status toggle

## Test Coverage Areas

### 1. API Test Automation (Node.js Backend) REQUIRED

**Framework**: Jest + Supertest  
**Location**: `backend/tests/api.test.js`  
**Coverage**: 25 comprehensive tests

#### Endpoints Tested:
- `POST /login` - Authentication (valid/invalid credentials)
- `GET /items` - Retrieve todos (authorized/unauthorized access)
- `POST /items` - Create todos (valid/invalid data)
- `PUT /items/:id` - Update todos (existing/non-existent items)
- `DELETE /items/:id` - Delete todos (valid/invalid operations)

#### Test Types:
- **Positive Cases**: Valid operations with proper authentication
- **Negative Cases**: Invalid credentials, missing tokens, malformed data
- **Security**: Authorization checks, user data isolation
- **Validation**: Input sanitization, error responses

### 2. UI Test Automation (React App) REQUIRED

**Framework**: Playwright  
**Location**: `frontend/tests/`  
**Coverage**: 16 focused tests (2 browsers: Chrome + Safari)

#### Scenarios Automated:
- **Login**: Valid/invalid credentials with proper assertions
- **Create**: New todo creation with verification
- **Edit**: Todo title modification with save confirmation
- **Delete**: Todo removal with confirmation dialog
- **Toggle**: Completion status changes with visual feedback

#### Assertions Include:
- Element visibility and state changes
- Data persistence after operations
- Error message display for invalid actions
- Navigation flow validation

### 3. Test Documentation REQUIRED

**This Document**: Test strategy and coverage explanation  
**README.md**: Quick setup instructions (< 2 minutes)  
**Code Comments**: Clear test descriptions and assertions

## Tools & Frameworks

### Backend API Testing
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP request testing
- **Coverage**: Built-in Jest coverage reporting

### Frontend UI Testing  
- **Playwright**: Modern browser automation
- **Cross-browser**: Chrome and WebKit (Safari)
- **Reliable**: Network idle waits and stable selectors

### Why These Tools?
- **Jest + Supertest**: Industry standard for Node.js API testing
- **Playwright**: More reliable than Selenium, better debugging
- **Minimal Dependencies**: Fast setup and execution

## How to Run Tests

### Quick Start (< 2 minutes)
```bash
# 1. Install dependencies and setup
npm run setup

# 2. Run all tests
npm run test:all
```

### Individual Test Types
```bash
# API tests only
npm run test:api

# UI tests only  
npm run test:ui

# With coverage
npm run test:api:coverage
```

## Test Results

**Expected Output:**
- API Tests: 25 passed (>90% code coverage)
- UI Tests: 16 passed (essential user workflows)
- **Total**: 41 tests covering all critical functionality

## Assumptions & Limitations

### Assumptions:
- Node.js 16+ and npm 8+ available
- Chrome browser installed for UI testing
- Network connectivity for server communication

### Limitations:
- In-memory database (data resets on restart)
- Demo users only (admin/user with password)
- Visual regression tests removed for stability

## Bonus Features Implemented OPTIONAL

### Code Coverage
- Jest generates detailed coverage reports
- Backend coverage >90% line coverage
- HTML reports with uncovered line highlighting

### CI Integration Ready
- GitHub Actions workflow configured
- Automated testing on push/PR
- Test result artifacts and reports

### Project Structure
```
qa-work/
├── backend/           # API tests & server
├── frontend/          # UI tests & React app  
├── package.json       # Root test scripts
└── README.md          # Setup instructions
```

## Summary

This project demonstrates comprehensive QA automation skills with:
- Complete API test coverage (CRUD + Auth)
- Essential UI automation workflows  
- Clear documentation and setup
- Professional tooling and structure
- Bonus features (coverage, CI-ready)

**Time Investment**: ~4 hours focused on core functionality over comprehensive edge case coverage. 
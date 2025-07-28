# Todo App - QA Automation Demo 🧪

A full-stack Todo application with comprehensive automated testing, built to demonstrate modern QA practices including API testing, UI automation, and visual regression testing.

> **Project Structure**: All code is now organized within this `qa-work` directory as the project root.

## 🏗️ Architecture

```
📦 qa-work/ (Project Root)
├── 🔧 backend/          # Node.js/Express API
│   ├── server.js        # Main server file
│   ├── tests/           # API tests (Jest + Supertest)
│   └── package.json     # Backend dependencies
├── 🎨 frontend/         # React.js application
│   ├── src/             # React components and logic
│   ├── tests/           # UI tests (Playwright)
│   └── package.json     # Frontend dependencies
├── 🚀 .github/workflows/ # CI/CD pipeline
├── 📋 TEST_DOCUMENTATION.md # Test strategy & plan
├── 📄 package.json      # Root project scripts
└── 📄 README.md         # This file
```

## ✨ Features

### Application Features
- 🔐 **User Authentication** - JWT-based login/logout
- ✅ **Todo Management** - Create, edit, delete, and toggle todos
- 👤 **User Isolation** - Each user sees only their todos
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Clean, intuitive interface

### Testing Features
- 🔄 **API Testing** - Complete backend endpoint coverage
- 🖱️ **UI Automation** - End-to-end user workflow testing
- 📸 **Visual Testing** - Screenshot comparison across browsers
- 🌐 **Cross-Browser** - Chrome, Firefox, Safari, Mobile
- 📊 **Code Coverage** - Comprehensive test coverage reporting
- 🚀 **CI/CD Ready** - Automated testing pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Git

### Setup (< 2 minutes)
```bash
# 1. Clone the repository
git clone <repository-url>
cd todo-app-qa-automation

# 2. Install all dependencies and setup Playwright
npm run setup

# 3. Start both backend and frontend servers
npm run start:all
```

**That's it!** 🎉

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Demo Credentials
```
Username: admin | Password: password
Username: user  | Password: password
```

## 🧪 Running Tests

### API Tests (Backend)
```bash
# Run all API tests
npm run test:api

# Run with coverage report
npm run test:api:coverage

# Run in watch mode
npm run test:api:watch
```

### UI Tests (Frontend)
```bash
# Run all UI tests (headless)
npm run test:ui

# Run with browser windows visible
npm run test:ui:headed

# Run with interactive UI
npm run test:ui:ui

# Run only visual regression tests
npm run test:visual
```

### All Tests
```bash
# Run complete test suite
npm run test:all
```

## 📋 Test Coverage

### 🔗 API Testing
**Framework**: Jest + Supertest  
**Coverage**: All REST endpoints

| Endpoint | Method | Status | Coverage |
|----------|--------|--------|----------|
| `/health` | GET | ✅ | Health check |
| `/login` | POST | ✅ | Authentication |
| `/items` | GET | ✅ | Get todos |
| `/items` | POST | ✅ | Create todo |
| `/items/:id` | PUT | ✅ | Update todo |
| `/items/:id` | DELETE | ✅ | Delete todo |

**Test Types**:
- ✅ Positive scenarios (valid inputs)
- ❌ Negative scenarios (invalid inputs, auth failures)
- 🔄 Edge cases (empty data, malformed requests)

### 🖱️ UI Testing
**Framework**: Playwright  
**Browsers**: Chrome, Firefox, Safari, Mobile Chrome

**Test Scenarios**:
- 🔐 Authentication flow (login/logout)
- ✅ Todo CRUD operations
- 🎨 Visual regression testing
- 📱 Mobile responsiveness
- ⚡ Loading states and error handling

### 📊 Coverage Reports
- **API**: Jest coverage reports with HTML output
- **UI**: Playwright test reports with screenshots/videos
- **Visual**: Screenshot comparisons and diff reports

## 🔧 Project Structure

### Backend (`/backend`)
```
backend/
├── server.js           # Express server with JWT auth
├── tests/
│   └── api.test.js     # Comprehensive API tests
└── package.json        # Dependencies & scripts
```

**Tech Stack**: Node.js, Express, JWT, bcryptjs

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── App.js          # Main React component
│   ├── components/     # Login, TodoList, TodoItem
│   └── App.css         # Modern styling
├── tests/
│   ├── login.spec.js   # Authentication tests
│   ├── todos.spec.js   # Todo management tests
│   └── visual.spec.js  # Visual regression tests
├── playwright.config.js # Playwright configuration
└── package.json        # Dependencies & scripts
```

**Tech Stack**: React, Axios, Modern CSS

## 🚀 CI/CD Pipeline

**GitHub Actions** workflow includes:

1. **🔧 API Tests** - Jest with coverage reporting
2. **🖱️ UI Tests** - Playwright across multiple browsers
3. **📸 Visual Tests** - Screenshot regression testing
4. **📊 Reports** - Automated test result artifacts
5. **🔔 Notifications** - PR comments and failure alerts

**Triggers**: Push to main/develop, Pull Requests

## 📈 Test Results & Reports

### Local Development
```bash
# View API coverage report
open backend/coverage/index.html

# View Playwright report
cd frontend && npx playwright show-report
```

### CI/CD Artifacts
- API test coverage reports
- Playwright HTML reports with videos
- Visual regression screenshots
- Failure logs and debugging info

## 🛠️ Development Commands

### Backend Development
```bash
cd backend

# Start in development mode (auto-reload)
npm run dev

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### Frontend Development
```bash
cd frontend

# Start development server
npm start

# Run Playwright tests
npx playwright test

# Debug tests interactively
npx playwright test --ui
```

## 🔍 Test Strategy Highlights

### API Testing Approach
- **Authentication**: Valid/invalid credentials, token handling
- **CRUD Operations**: Create, read, update, delete todos
- **Validation**: Input sanitization, error responses
- **Security**: Unauthorized access, token verification

### UI Testing Approach
- **User Workflows**: Login → Manage Todos → Logout
- **Interactions**: Click, type, form submission
- **State Management**: Loading states, error handling
- **Responsive Design**: Desktop and mobile layouts

### Visual Testing Approach
- **Page States**: Login, todo list, error states
- **Cross-Browser**: Consistent appearance
- **Responsive**: Mobile vs desktop layouts
- **Theme Support**: Light/dark mode compatibility

## 🎯 Quality Metrics

- **API Test Coverage**: >90% line coverage
- **UI Test Coverage**: All critical user paths
- **Cross-Browser**: 4 browser engines tested
- **Performance**: Fast test execution (<5 minutes)
- **Reliability**: Stable, non-flaky tests

## 🐛 Troubleshooting

### Common Issues

**Port conflicts**:
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000 5000
```

**Playwright browser issues**:
```bash
cd frontend
npx playwright install --with-deps
```

**Test failures**:
1. Check if both servers are running
2. Verify demo credentials are correct
3. Check network connectivity
4. Review test logs for specific errors

## 📚 Additional Resources

- **[Test Documentation](TEST_DOCUMENTATION.md)** - Detailed test strategy
- **[Playwright Docs](https://playwright.dev/)** - UI testing framework
- **[Jest Docs](https://jestjs.io/)** - API testing framework
- **[Supertest Docs](https://github.com/visionmedia/supertest)** - HTTP assertions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

---

**Built with ❤️ for QA automation demonstration**

*This project showcases modern testing practices including API testing, UI automation, visual regression testing, and CI/CD integration.* 
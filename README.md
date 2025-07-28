# Todo App - QA Automation Demo

**A comprehensive QA automation demonstration project built for technical assessment.**

This project showcases complete test automation skills with a React + Node.js Todo application, featuring API testing, UI automation, and professional documentation.

## **Requirements Coverage**

**UI Automation**: Login, Create, Edit, Delete todos with assertions (Playwright)  
**API Automation**: Full CRUD + Auth endpoints with positive/negative tests (Jest + Supertest)  
**Test Documentation**: Complete strategy and setup guide (1-2 pages)  
**Code Structure**: Professional, readable, well-organized  
**Bonus**: Code coverage reporting + CI-ready configuration  

## **Quick Setup (< 2 Minutes)**

### Prerequisites
- Node.js 16+ and npm 8+
- Chrome browser

### Installation & Run
```bash
# 1. Navigate to project
cd qa-work

# 2. Install everything and setup Playwright
npm run setup

# 3. Run all tests
npm run test:all
```

**That's it!** The setup command installs all dependencies and configures Playwright browsers automatically.

## **Application Features**

- **Frontend**: React.js Todo app with authentication
- **Backend**: Node.js/Express API with JWT auth
- **Demo Users**: `admin/password` and `user/password`

**Live URLs** (when running):
- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000

## **Test Coverage**

### **API Tests (25 tests)**
```bash
npm run test:api
```
- **Framework**: Jest + Supertest
- **Coverage**: All CRUD endpoints + authentication
- **Types**: Positive, negative, and security tests
- **Report**: >90% code coverage with HTML reports

### **UI Tests (16 tests)**  
```bash
npm run test:ui
```
- **Framework**: Playwright (Chrome + Safari)
- **Coverage**: Login, Create, Edit, Delete, Toggle todos
- **Assertions**: Element visibility, data persistence, error handling
- **Screenshots**: Captured on failures with videos

### **All Tests**
```bash
npm run test:all
```
**Expected Result**: 41 tests passed covering all critical functionality

## **Project Structure**

```
qa-work/
├── backend/              # Node.js API + tests
│   ├── server.js            # Express server with JWT auth
│   ├── tests/api.test.js    # 25 comprehensive API tests
│   └── package.json         # Backend dependencies
├── frontend/             # React app + tests  
│   ├── src/                 # React components
│   ├── tests/               # Playwright UI tests
│   │   ├── login.spec.js    # Auth flow tests
│   │   └── todos.spec.js    # Todo CRUD tests
│   └── package.json         # Frontend dependencies
├── TEST_DOCUMENTATION.md # Complete test strategy (2 pages)
├── package.json          # Root test commands
└── README.md             # This setup guide
```

## **Development Commands**

```bash
# Start servers for development
npm run start:all            # Both frontend + backend

# Individual test types  
npm run test:api             # Backend API tests only
npm run test:ui              # Frontend UI tests only
npm run test:api:coverage    # API tests with coverage report

# Debug tests
npm run test:ui:headed       # UI tests with visible browser
npm run test:ui:ui           # Interactive test debugging
```

## **Test Results & Reports**

### **API Coverage Report**
```bash
npm run test:api:coverage
open backend/coverage/index.html
```

### **UI Test Report**  
```bash
cd frontend && npx playwright show-report
```

## **Bonus Features**

### **Code Coverage**: Jest generates detailed HTML reports
### **CI Ready**: GitHub Actions workflow configured  
### **Professional Structure**: Scalable, maintainable test organization
### **Modern Tools**: Latest versions of Playwright, Jest, React

## **Assessment Criteria Met**

| Area | Requirement | Status |
|------|-------------|--------|
| **UI Automation** | Login, CRUD operations with assertions | Complete |
| **API Automation** | CRUD + Auth endpoints, positive/negative | Complete |  
| **Documentation** | Test plan/strategy (1-2 pages) + setup | Complete |
| **Code Quality** | Clear structure, readable, proper naming | Complete |
| **Bonus** | Coverage reports, CI integration | Complete |

## **Time Investment**

**~4 hours** focused on core functionality and professional implementation over extensive edge case coverage.

## **Support**

**Quick Issues:**
- Port conflicts: `npx kill-port 3000 5000`
- Browser setup: `cd frontend && npx playwright install`
- Dependencies: `npm run setup` (re-run installation)

**Demo Credentials:**
- Username: `admin` | Password: `password`  
- Username: `user` | Password: `password`

---


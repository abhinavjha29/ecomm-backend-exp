# E-Commerce Backend - Express TypeScript

A robust and scalable e-commerce backend API built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Naming Conventions](#naming-conventions)
- [Code Quality](#code-quality)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

- 🔐 JWT-based Authentication (Access & Refresh Tokens)
- 👤 User Management with Role-based Access Control
- 🛡️ Password Hashing with bcrypt
- ✅ Request Validation using Joi
- 📝 Automatic API Documentation with Swagger
- 🎨 Consistent Response Formatting
- 🔍 Type-safe Database Operations with Prisma
- 🚀 TypeScript for Type Safety
- 🎯 ESLint & Prettier for Code Quality
- 🪝 Pre-commit Hooks with Husky
- 🔄 Auto-reload in Development with Nodemon

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Documentation**: Swagger UI
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky, lint-staged

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - _Not required if using Docker_
- **npm** or **yarn** - _Not required if using Docker_
- **PostgreSQL** (v12 or higher) - _Not required if using Docker_
- **Git**
- **Docker & Docker Compose** (optional, for containerized setup)

## 🐳 Docker Setup

**Recommended for quick setup and consistent environments!**

### Quick Start with Docker

```bash
# 1. Clone the repository
git clone <repository-url>
cd back-express

# 2. Set up environment
cp .env.docker .env
# Edit .env with your configuration

# 3. Start everything (database + application)
docker-compose up -d

# 4. Check logs
docker-compose logs -f

# 5. Access the application
# http://localhost:5080
# http://localhost:5080/api-docs
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Access database
docker-compose exec postgres psql -U postgres -d ecommerce
```

**📖 For detailed Docker documentation, see [DOCKER.md](DOCKER.md)**

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd back-express
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Git hooks

```bash
npm run prepare
```

This will initialize Husky for pre-commit hooks.

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

# JWT Configuration
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-refresh-secret-key-here"
JWT_REFRESH_EXPIRES_IN="30d"

# Password Hashing
SALT_ROUNDS="10"

# Server Configuration
PORT=5080
```

### Environment Variables Explained:

| Variable                 | Description                             | Default |
| ------------------------ | --------------------------------------- | ------- |
| `DATABASE_URL`           | PostgreSQL connection string            | -       |
| `JWT_SECRET`             | Secret key for access tokens            | -       |
| `JWT_EXPIRES_IN`         | Access token expiration time            | 7d      |
| `JWT_REFRESH_SECRET`     | Secret key for refresh tokens           | -       |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time           | 30d     |
| `SALT_ROUNDS`            | bcrypt salt rounds for password hashing | 10      |
| `PORT`                   | Server port                             | 5080    |

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ecommerce;

# Exit psql
\q
```

### 2. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 3. View Database with Prisma Studio (Optional)

```bash
npx prisma studio
```

This will open a browser-based database GUI at `http://localhost:5555`

## 🏃‍♂️ Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start on `http://localhost:5080` (or your configured PORT)

### Production Mode

```bash
# Build TypeScript to JavaScript
npm run build

# Start the production server
npm start
```

## 📜 Available Scripts

| Script               | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start development server with nodemon   |
| `npm start`          | Start production server                 |
| `npm run build`      | Compile TypeScript to JavaScript        |
| `npm run lint`       | Run ESLint and auto-fix issues          |
| `npm run lint:check` | Check for linting errors without fixing |
| `npm run format`     | Format code with Prettier               |
| `npm run prepare`    | Set up Husky git hooks                  |

## 📁 Project Structure

```
back-express/
├── .husky/                 # Git hooks configuration
├── .vscode/                # VSCode settings
├── node_modules/           # Dependencies
├── prisma/                 # Prisma schema and migrations
│   ├── generated/          # Generated Prisma Client
│   ├── migrations/         # Database migrations
│   └── schema.prisma       # Database schema
├── src/
│   ├── config/             # Configuration files
│   │   ├── database.ts     # Database connection
│   │   └── swagger.auto.ts # Swagger configuration
│   ├── middleware/         # Express middlewares
│   │   ├── api-response.middleware.ts
│   │   ├── jwt.middleware.ts
│   │   └── validation.middleware.ts
│   ├── modules/            # Feature modules
│   │   └── auth/           # Authentication module
│   │       ├── utils/      # Module-specific utilities
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       └── auth-route.ts
│   ├── utils/              # Shared utilities
│   │   ├── api-response.ts
│   │   ├── common.type.ts
│   │   ├── constants.ts
│   │   └── validator.utils.ts
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Server entry point
├── .env                    # Environment variables
├── .eslintignore           # ESLint ignore patterns
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Git ignore patterns
├── .lintstagedrc.json      # Lint-staged configuration
├── .prettierrc             # Prettier configuration
├── nodemon.json            # Nodemon configuration
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🎨 Naming Conventions

Our project follows strict naming conventions enforced by ESLint:

### Code Naming Conventions

| Element          | Convention       | Example                         | ESLint Format |
| ---------------- | ---------------- | ------------------------------- | ------------- |
| **Variables**    | camelCase        | `userName`, `isValid`           | `camelCase`   |
| **Functions**    | camelCase        | `getUserData`, `validateEmail`  | `camelCase`   |
| **Constants**    | UPPER_SNAKE_CASE | `HTTP_STATUS`, `API_BASE_URL`   | `UPPER_CASE`  |
| **Classes**      | PascalCase       | `UserService`, `AuthController` | `PascalCase`  |
| **Interfaces**   | PascalCase       | `UserProfile`, `ApiResponse`    | `PascalCase`  |
| **Types**        | PascalCase       | `TokenPayload`, `RequestBody`   | `PascalCase`  |
| **Enums**        | PascalCase       | `UserRole`, `OrderStatus`       | `PascalCase`  |
| **Enum Members** | UPPER_SNAKE_CASE | `ADMIN`, `PENDING_PAYMENT`      | `UPPER_CASE`  |

### File & Folder Naming Conventions

| Element     | Convention | Example                                   |
| ----------- | ---------- | ----------------------------------------- |
| **Files**   | kebab-case | `auth-controller.ts`, `jwt.middleware.ts` |
| **Folders** | kebab-case | `auth-service`, `user-management`         |

### Naming Convention Examples

#### ✅ Good Examples

```typescript
// Variables and Functions - camelCase
const userName = 'John Doe';
const userId = 123;
function getUserById(id: number) {}
const isValidEmail = true;

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404
};

// Classes - PascalCase
class UserService {}
class AuthController {}

// Interfaces - PascalCase
interface UserProfile {}
interface ApiResponse<T> {}

// Types - PascalCase
type TokenPayload = { userId: string };
type RequestHandler = (req: Request) => void;

// Enums - PascalCase (name) + UPPER_CASE (members)
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

#### ❌ Bad Examples

```typescript
// Wrong: Variables should be camelCase, not snake_case
const user_name = 'John Doe';
const User_Id = 123;

// Wrong: Functions should be camelCase, not PascalCase
function GetUserById(id: number) {}

// Wrong: Constants should be UPPER_CASE, not camelCase
const apiBaseUrl = 'https://api.example.com';

// Wrong: Classes should be PascalCase, not camelCase
class userService {}

// Wrong: Interfaces should be PascalCase
interface userProfile {}

// Wrong: Enum members should be UPPER_CASE
enum UserRole {
  Admin = 'admin',
  regularUser = 'user'
}
```

### File Naming Examples

#### ✅ Good File Names

```
auth-controller.ts
user-service.ts
jwt.middleware.ts
api-response.ts
validation.utils.ts
password.utils.ts
```

#### ❌ Bad File Names

```
AuthController.ts      // Should be: auth-controller.ts
userService.ts         // Should be: user-service.ts
jwt_middleware.ts      // Should be: jwt.middleware.ts
apiResponse.ts         // Should be: api-response.ts
```

## 🔍 Code Quality

### ESLint Rules

Our ESLint configuration enforces:

- ✅ Naming conventions (camelCase, PascalCase, UPPER_CASE, kebab-case)
- ✅ Semicolons required
- ✅ Strict equality (`===` instead of `==`)
- ✅ No duplicate imports
- ✅ No unused variables
- ✅ Prettier integration
- ✅ TypeScript best practices

### Pre-commit Hooks

Every commit automatically:

1. **Lints** staged TypeScript files
2. **Formats** code with Prettier
3. **Fixes** auto-fixable issues
4. **Blocks** commits with unfixable errors

### Manual Linting

```bash
# Check for linting errors
npm run lint:check

# Auto-fix linting errors
npm run lint

# Format all files
npm run format
```

### VSCode Integration

With the included VSCode settings, the editor will:

- ✅ Show linting errors in real-time
- ✅ Auto-fix on save
- ✅ Format on save with Prettier
- ✅ Highlight naming convention violations

## 📚 API Documentation

API documentation is automatically generated using Swagger UI.

### Access Documentation

Once the server is running, visit:

```
http://localhost:5080/api-docs
```

### Available Endpoints

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the naming conventions

3. **Run linting and tests**

   ```bash
   npm run lint:check
   npm run format
   ```

4. **Commit your changes** (pre-commit hooks will run automatically)

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Code Review Checklist

- [ ] Follows naming conventions
- [ ] All tests pass
- [ ] No linting errors
- [ ] Code is properly formatted
- [ ] Comments added for complex logic
- [ ] API documentation updated (if applicable)
- [ ] Environment variables documented (if added)

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 5080
lsof -ti:5080 | xargs kill -9
```

#### Prisma Client Not Generated

```bash
npx prisma generate
```

#### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Ensure database exists

#### ESLint Errors

```bash
# Auto-fix most errors
npm run lint

# Check remaining errors
npm run lint:check
```

## 📄 License

ISC

## 👤 Author

**Abhinav JHA**

---

## 🎯 Quick Start Summary

### Using Docker (Recommended)

```bash
# 1. Clone and setup
git clone <repo-url>
cd back-express
cp .env.docker .env

# 2. Start everything
docker-compose up -d

# 3. Visit
# http://localhost:5080
# http://localhost:5080/api-docs
```

### Without Docker

```bash
# 1. Clone and install
git clone <repo-url>
cd back-express
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 3. Set up database
npx prisma generate
npx prisma migrate dev

# 4. Start development server
npm run dev

# 5. Visit API docs
# http://localhost:5080/api-docs
```

## 📚 Additional Documentation

- [Docker Setup Guide](DOCKER.md) - Detailed Docker usage and troubleshooting
- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project

---

**Happy Coding! 🚀**

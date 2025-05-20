# Virgool API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 📝 Description

Virgool is a modern, scalable REST API built with NestJS framework. This project implements a robust backend system with features like authentication, file uploads, and database integration.

## 🚀 Features

- 🔐 JWT Authentication
- 📁 File Upload Support
- 📊 PostgreSQL Database Integration
- 📚 Swagger API Documentation
- 🔍 Environment Configuration
- ✅ Input Validation
- 🧪 Testing Setup
- 🔄 TypeORM Integration

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT
- **API Documentation:** Swagger
- **Testing:** Jest
- **Code Quality:** ESLint, Prettier

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone [your-repository-url]
cd virgool
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory and add the following variables:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret
```

4. **Database Setup**
```bash
# Run migrations
npm run typeorm migration:run
```

## 🏃‍♂️ Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🧪 Testing

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Test Coverage
npm run test:cov
```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## 🏗️ Project Structure

```
src/
├── config/         # Configuration files
├── modules/        # Feature modules
├── common/         # Shared resources
├── middleware/     # Custom middleware
└── main.ts         # Application entry point
```
# Yumm API Server

The backend server for the Yumm AI application, providing a RESTful API built with **Node.js**, **Express**, and **TypeScript**. It handles user authentication, recipe management, AI-powered food recommendations, real-time notifications, and admin dashboard analytics. The data is persisted using **MongoDB**.

## Features

- **User Authentication**: Secure JWT-based authentication along with Google OAuth integration.
- **Recipe Management**: Create, edit, fetch, and manage public recipes and personalized user cookbooks.
- **AI Integration**: Integrates with Google Generative AI (Gemini) for intelligent and dynamic food/recipe recommendations.
- **Media Uploads**: Handles image/file uploads and cloud storage using Cloudinary and Multer.
- **Shopping List & Pantry**: Manage ingredients required for recipes directly via the shopping list.
- **Admin Dashboard**: Comprehensive admin endpoints for user management, bug reports, and usage analytics.
- **Notifications**: System alerts and user-specific notifications integrated with webhooks.
- **Input Validation**: Strongly typed data transfer objects (DTOs) with class-validator and Zod schemas.
- **Robust Testing**: Configured with Jest and Supertest for unit testing APIs and ensuring stability.

## Tech Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), Google Auth (`google-auth-library`)
- **AI Services**: Google Generative AI (`@google/generative-ai`)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/)
- **Emails**: Nodemailer (`nodemailer`)
- **Validation**: Zod & Class Validator
- **Testing**: Jest & Supertest

## Prerequisites

Before running the server locally, ensure you have the following installed:

- Node.js (v20+ recommended)
- npm or yarn or pnpm
- MongoDB Atlas account (or a local MongoDB instance)
- Cloudinary account for media storage
- Google Cloud Console project for OAuth and Gemini API credentials

## Environment Variables

Create a local `.env` file in the root directory based on the project requirements. You will likely need the following environment variables (adjust based on the `.env.example` if applicable):

```env
PORT=
MONGODB_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GEMINI_API_KEY=
# Add SMTP configuration for emails, custom webhook secrets, etc.
```

## Getting Started

1. **Clone the repository and navigate to the `server` directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The backend will start and watch for changes using `nodemon`. The base path typically runs at `http://localhost:3000` (or the port specified in your `.env` file).

4. **Run Tests:**
   ```bash
   npm run test
   ```

## Available Scripts

- `npm run dev` - Starts the development server with hot-reloading (`nodemon`).
- `npm run start` - Runs the application via `ts-node` explicitly for production or pre-compiled environments.
- `npm run test` - Runs the Jest test suites in verbose mode and handles open handlers.

## Folder Structure

```text
server/
├── api/
│   ├── app.ts                # Express app configuration & middleware
│   ├── index.ts              # Entry point to the server
│   ├── config/               # Environment variable configs & settings
│   ├── controllers/          # API route handlers
│   ├── database/             # MongoDB connection logic (connect-db.ts)
│   ├── dtos/                 # Data Transfer Objects & validation types
│   ├── errors/               # Custom error handlers and middleware
│   ├── middlewares/          # Express middlewares (auth, upload, etc.)
│   ├── models/               # Mongoose schema definitions
│   ├── repositories/         # Database abstraction layer
│   ├── routes/               # Express routing layers
│   ├── services/             # Core business logic containing use cases
│   ├── templates/            # Email templates
│   ├── types/                # TypeScript type definitions and interfaces
│   └── utils/                # Helper functions and utilities
├── __tests__/                # Jest/Supertest integration and unit tests
├── public/                   # Static assets directory
├── jest.config.js            # Jest test framework configurations
├── nodemon.json              # Development reloading configuration
├── package.json              # Project dependencies and npm scripts
├── tsconfig.json             # TypeScript compiler configuration
└── vercel.json               # Deployment configuration for Vercel
```

## Deployment

The project includes a `vercel.json` file designed specifically for [Vercel](https://vercel.com/) deployments, allowing seamless serverless deployment of the Express app.

---

_Created by [Yumm AI Team]_

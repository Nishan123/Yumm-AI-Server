import dotenv from "dotenv";
import app from "./app";
import { connectToDb } from "./database/connect-db";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Catch unhandled errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

let isDbConnected = false;

// Middleware to ensure DB connection on every request
app.use(async (req, res, next) => {
  if (!isDbConnected) {
    try {
      await connectToDb();
      isDbConnected = true;
    } catch (error) {
      console.error("Database connection failed:", error);
      return res.status(500).json({ success: false, message: "Database connection failed" });
    }
  }
  next();
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

export default app;

import app from "./app";
import { connectToDb } from "./database/connect-db";

const PORT = process.env.PORT || 5000;

// Catch unhandled errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function startServer() {
  try {
    // Attempt to connect to DB first
    await connectToDb();
    
    // For local development
    if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
      app.listen(PORT as number, '0.0.0.0', () => {
        console.log(`Server running locally on port ${PORT} at 0.0.0.0`); // Trigger restart for new .env
      });
    }
  } catch (err) {
    console.error("Failed to start server due to database connection error:", err);
    process.exit(1);
  }
}

startServer();

export default app;

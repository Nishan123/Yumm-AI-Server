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

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start server", err);
});

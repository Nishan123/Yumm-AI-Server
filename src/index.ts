import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectToDb } from "./database/connect-db";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import recipeRoutes from "./routes/recipe.route";
import userRecipeRoutes from "./routes/user-recipe.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Catch unhandled errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(cors());
app.use(express.json());



// Serve static files from public directory
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Test route
app.get("/", (_req, res) => {
  res.send("Yumm API");
});




app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", recipeRoutes);
app.use("/api", userRecipeRoutes);

connectToDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start server", err);
});

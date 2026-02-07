import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import recipeRoutes from "./routes/recipe.route";
import userRecipeRoutes from "./routes/user-recipe.route";
import adminUserRoutes from "./routes/admin/user.route";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Test route
app.get("/", (_req, res) => {
    res.send("Yumm API");
});

// API Routes
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", recipeRoutes);
app.use("/api", userRecipeRoutes);
app.use("/api", adminUserRoutes);

export default app;

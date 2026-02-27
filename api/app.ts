import express from "express";
import cors from "cors";
import path from "path";
import { connectToDb } from "./database/connect-db";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import recipeRoutes from "./routes/recipe.route";
import userRecipeRoutes from "./routes/user-recipe.route";
import adminUserRoutes from "./routes/admin/user.route";
import adminDeletedUserRoutes from "./routes/admin/deleted-user.route";
import bugReportRoutes from "./routes/bug-report.route";
import adminBugReportRoutes from "./routes/admin/bug-report.route";
import notificationRoutes from "./routes/notification.route";
import { dashboardRoutes } from "./routes/admin/dashboard.route";
import webhookRoutes from "./routes/webhook.route";
import shoppingListRoutes from "./routes/shopping-list.route";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DB connection on every request (must be before routes)
app.use(async (req, res, next) => {
    try {
        await connectToDb();
    } catch (error) {
        console.error("Database connection failed:", error);
        return res.status(500).json({ success: false, message: "Database connection failed" });
    }
    next();
});

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
app.use("/api", adminDeletedUserRoutes);
app.use("/api", bugReportRoutes);
app.use("/api", adminBugReportRoutes);
app.use("/api", notificationRoutes);
app.use("/api", shoppingListRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/webhooks", webhookRoutes);

export default app;

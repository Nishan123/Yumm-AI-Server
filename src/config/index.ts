import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is required");
}
export const DB_URL: string = process.env.MONGO_URI;

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}
if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
}
export const JWT_SECRET: string = process.env.JWT_SECRET;

// Google OAuth Configuration
if (!process.env.CLIENT_ID) {
    throw new Error("CLIENT_ID environment variable is required");
}
export const GOOGLE_CLIENT_ID: string = process.env.CLIENT_ID;

if (!process.env.CLIENT_SECRET) {
    throw new Error("CLIENT_SECRET environment variable is required");
}
export const GOOGLE_CLIENT_SECRET: string = process.env.CLIENT_SECRET;

export const GOOGLE_CALLBACK_URL: string = process.env.CALLBACK_URL || "http://localhost:3000/auth/google/callback";
export const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";
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
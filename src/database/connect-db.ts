import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const connectToDb = async (): Promise<void> => {
    try {
        const dbUrl = process.env.MONGO_URI;
        if (!dbUrl) {
            throw new Error("No DB Url found in env");
        }
        await mongoose.connect(dbUrl);
        console.log("💽 Database connected successfully");
    } catch (err) {
        console.error("❌ Error connecting to database", err);
        throw err;
    }
};

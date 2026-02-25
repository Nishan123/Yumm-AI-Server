import mongoose, { mongo } from "mongoose";
import { DB_URL } from "../config";

export const connectToDb = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const dbUrl = DB_URL;
        await mongoose.connect(dbUrl);
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Error connecting to database", err);
        throw err;
    }
};

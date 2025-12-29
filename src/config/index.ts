import dotenv from "dotenv";
dotenv.config();

export const PORT:number = process.env.PORT? parseInt(process.env.PORT):5000;
export const DB_URL : string = process.env.MONGO_URI||"mongodb+srv://girinishan1234567890_db_user:OdQqo0sdDOxxJT4K@development.z6mqwah.mongodb.net/development";
export const JWT_SECRET: string = process.env.JWT_SECRET||"myjwtsecret";
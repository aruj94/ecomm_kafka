import dotenv from "dotenv";
dotenv.config();

export const DB_URL = process.env.DATABASE_URL as String;
export const APP_PORT = process.env.PORT;
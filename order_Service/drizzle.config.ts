import { defineConfig } from "drizzle-kit";
import { DB_URL } from "./src/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/cart.ts",
  out: "./src/db/migrations",
  dbCredentials: { 
    url: DB_URL?.toString(),
  }
});
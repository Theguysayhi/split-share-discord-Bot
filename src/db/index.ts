import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

// Create the postgres client
const client = postgres(connectionString);

// Create the drizzle db instance with the schema
export const db = drizzle(client, { schema });

export type Database = typeof db;

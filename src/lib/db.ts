import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

declare global {
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

const connectionString = process.env.DATABASE_URL!;

function createDrizzleClient() {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

export const db = globalThis.db || createDrizzleClient();

if (process.env.NODE_ENV !== "production") globalThis.db = db;

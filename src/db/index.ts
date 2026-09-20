import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "file:./data/meulink.db";
const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;

const globalForDb = globalThis as unknown as {
  __meulinkDb?: ReturnType<typeof drizzle<typeof schema>>;
};

export const db =
  globalForDb.__meulinkDb ??
  drizzle(createClient({ url, authToken }), { schema });

if (process.env.NODE_ENV !== "production") globalForDb.__meulinkDb = db;

export * from "./schema";

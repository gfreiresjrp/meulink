import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as { __meulinkDb?: Db };

/**
 * Conexão preguiçosa: só abre no primeiro acesso real, nunca durante o build.
 * Local: DATABASE_URL=file:./data/meulink.db. Produção: libsql://... (Turso) + DATABASE_AUTH_TOKEN.
 */
function connect(): Db {
  if (globalForDb.__meulinkDb) return globalForDb.__meulinkDb;

  const url = process.env.DATABASE_URL ?? "file:./data/meulink.db";
  const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;

  if (url.startsWith("file:")) {
    // Garante a pasta do SQLite local (ex.: primeiro `npm run dev` num clone novo).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("node:fs") as typeof import("node:fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("node:path") as typeof import("node:path");
    fs.mkdirSync(path.dirname(url.slice("file:".length)), { recursive: true });
  }

  const instance = drizzle(createClient({ url, authToken }), { schema });
  globalForDb.__meulinkDb = instance;
  return instance;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const real = connect();
    const value = Reflect.get(real, prop, receiver === _target ? real : receiver);
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(real) : value;
  },
});

export * from "./schema";

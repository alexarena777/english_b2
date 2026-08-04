import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export async function getDb() {
  return drizzle(await getD1(), { schema });
}

export async function getD1() {
  try {
    const cf = await import("cloudflare:workers" as string);
    const bindings = (cf.env ?? process.env) as unknown as { DB?: D1Database };
    if (bindings?.DB) {
      return bindings.DB;
    }
  } catch {
    // Non-Cloudflare environment or bindings unavailable
  }
  throw new Error("Database binding `DB` is unavailable.");
}


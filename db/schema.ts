import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Phase 1 keeps one validated progress snapshot per authenticated Sites user.
 * Exercise content remains versioned with the application; the snapshot holds
 * the user's answers and review queue so progress survives across devices.
 */
export const userProgress = sqliteTable("user_progress", {
  userId: text("user_id").primaryKey(),
  stateJson: text("state_json").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

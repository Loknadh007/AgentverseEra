import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("active"),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  agent: text("agent").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isUser: integer("is_user").notNull().default(0),
  metadata: jsonb("metadata"),
});

export const bugReports = pgTable("bug_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  severity: text("severity").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  affectedFiles: text("affected_files").array().notNull(),
  userSentiment: text("user_sentiment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hypotheses = pgTable("hypotheses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  rank: integer("rank").notNull(),
  title: text("title").notNull(),
  confidence: integer("confidence").notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityEntries = pgTable("activity_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull().references(() => conversations.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  agent: text("agent").notNull(),
  action: text("action").notNull(),
  status: text("status").notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });
export const insertBugReportSchema = createInsertSchema(bugReports).omit({ id: true, createdAt: true });
export const insertHypothesisSchema = createInsertSchema(hypotheses).omit({ id: true, createdAt: true });
export const insertActivityEntrySchema = createInsertSchema(activityEntries).omit({ id: true, timestamp: true });

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type BugReport = typeof bugReports.$inferSelect;
export type Hypothesis = typeof hypotheses.$inferSelect;
export type ActivityEntry = typeof activityEntries.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertBugReport = z.infer<typeof insertBugReportSchema>;
export type InsertHypothesis = z.infer<typeof insertHypothesisSchema>;
export type InsertActivityEntry = z.infer<typeof insertActivityEntrySchema>;

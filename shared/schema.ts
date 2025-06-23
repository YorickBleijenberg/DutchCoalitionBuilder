import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const coalitionScenarios = pgTable("coalition_scenarios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  partySeats: jsonb("party_seats").notNull().$type<Record<string, number>>(),
  selectedParties: jsonb("selected_parties").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  coalitionScenarios: many(coalitionScenarios),
}));

export const coalitionScenariosRelations = relations(coalitionScenarios, ({ one }) => ({
  user: one(users, { fields: [coalitionScenarios.userId], references: [users.id] }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCoalitionScenarioSchema = createInsertSchema(coalitionScenarios).pick({
  name: true,
  description: true,
  partySeats: true,
  selectedParties: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CoalitionScenario = typeof coalitionScenarios.$inferSelect;
export type InsertCoalitionScenario = z.infer<typeof insertCoalitionScenarioSchema>;

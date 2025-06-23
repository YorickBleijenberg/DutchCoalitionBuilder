import { users, coalitionScenarios, type User, type InsertUser, type CoalitionScenario, type InsertCoalitionScenario } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCoalitionScenarios(userId?: number): Promise<CoalitionScenario[]>;
  getCoalitionScenario(id: number): Promise<CoalitionScenario | undefined>;
  createCoalitionScenario(scenario: InsertCoalitionScenario & { userId?: number }): Promise<CoalitionScenario>;
  updateCoalitionScenario(id: number, scenario: Partial<InsertCoalitionScenario>): Promise<CoalitionScenario | undefined>;
  deleteCoalitionScenario(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCoalitionScenarios(userId?: number): Promise<CoalitionScenario[]> {
    if (userId) {
      return await db.select().from(coalitionScenarios).where(eq(coalitionScenarios.userId, userId));
    }
    return await db.select().from(coalitionScenarios);
  }

  async getCoalitionScenario(id: number): Promise<CoalitionScenario | undefined> {
    const [scenario] = await db.select().from(coalitionScenarios).where(eq(coalitionScenarios.id, id));
    return scenario || undefined;
  }

  async createCoalitionScenario(scenario: InsertCoalitionScenario & { userId?: number }): Promise<CoalitionScenario> {
    const insertData = {
      name: scenario.name,
      description: scenario.description || null,
      partySeats: scenario.partySeats,
      selectedParties: scenario.selectedParties,
      userId: scenario.userId || null,
    };
    
    const [newScenario] = await db
      .insert(coalitionScenarios)
      .values(insertData as any)
      .returning();
    return newScenario;
  }

  async updateCoalitionScenario(id: number, scenario: Partial<InsertCoalitionScenario>): Promise<CoalitionScenario | undefined> {
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (scenario.name !== undefined) updateData.name = scenario.name;
    if (scenario.description !== undefined) updateData.description = scenario.description;
    if (scenario.partySeats !== undefined) updateData.partySeats = scenario.partySeats;
    if (scenario.selectedParties !== undefined) updateData.selectedParties = scenario.selectedParties;

    const [updatedScenario] = await db
      .update(coalitionScenarios)
      .set(updateData)
      .where(eq(coalitionScenarios.id, id))
      .returning();
    return updatedScenario || undefined;
  }

  async deleteCoalitionScenario(id: number): Promise<boolean> {
    const result = await db
      .delete(coalitionScenarios)
      .where(eq(coalitionScenarios.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();

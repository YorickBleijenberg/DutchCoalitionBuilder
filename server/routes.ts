import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCoalitionScenarioSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Coalition Scenarios API Routes
  app.get("/api/scenarios", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const scenarios = await storage.getCoalitionScenarios(userId);
      res.json(scenarios);
    } catch (error) {
      console.error(`Error fetching scenarios: ${error}`);
      res.status(500).json({ error: "Failed to fetch scenarios" });
    }
  });

  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const scenario = await storage.getCoalitionScenario(id);
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error) {
      console.error(`Error fetching scenario: ${error}`);
      res.status(500).json({ error: "Failed to fetch scenario" });
    }
  });

  app.post("/api/scenarios", async (req, res) => {
    try {
      const validatedData = insertCoalitionScenarioSchema.parse(req.body);
      const scenario = await storage.createCoalitionScenario(validatedData);
      res.status(201).json(scenario);
    } catch (error) {
      console.error(`Error creating scenario: ${error}`);
      res.status(400).json({ error: "Invalid scenario data" });
    }
  });

  app.put("/api/scenarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCoalitionScenarioSchema.partial().parse(req.body);
      const scenario = await storage.updateCoalitionScenario(id, validatedData);
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error) {
      console.error(`Error updating scenario: ${error}`);
      res.status(400).json({ error: "Invalid scenario data" });
    }
  });

  app.delete("/api/scenarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCoalitionScenario(id);
      if (!success) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting scenario: ${error}`);
      res.status(500).json({ error: "Failed to delete scenario" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

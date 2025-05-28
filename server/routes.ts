import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDeviceSchema, insertComparisonSchema, insertBrandSchema } from "@shared/schema";
import { z } from "zod";

const filtersSchema = z.object({
  brand: z.string().optional(),
  priceMin: z.string().transform(val => val ? parseInt(val) : undefined).optional(),
  priceMax: z.string().transform(val => val ? parseInt(val) : undefined).optional(),
  minRam: z.string().transform(val => val ? parseInt(val) : undefined).optional(),
  fiveG: z.string().transform(val => val === 'true').optional(),
  search: z.string().optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Device routes
  app.get("/api/devices", async (req, res) => {
    try {
      const filters = filtersSchema.parse(req.query);
      const devices = await storage.getDevices(filters);
      res.json(devices);
    } catch (error) {
      res.status(400).json({ error: "Invalid filters provided" });
    }
  });

  app.get("/api/devices/featured", async (req, res) => {
    try {
      const devices = await storage.getFeaturedDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured devices" });
    }
  });

  app.get("/api/devices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid device ID" });
      }

      const device = await storage.getDevice(id);
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }

      res.json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch device" });
    }
  });

  app.post("/api/devices", async (req, res) => {
    try {
      const deviceData = insertDeviceSchema.parse(req.body);
      const device = await storage.createDevice(deviceData);
      res.status(201).json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid device data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create device" });
    }
  });

  app.put("/api/devices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid device ID" });
      }

      const updates = insertDeviceSchema.partial().parse(req.body);
      const device = await storage.updateDevice(id, updates);
      
      if (!device) {
        return res.status(404).json({ error: "Device not found" });
      }

      res.json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid device data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update device" });
    }
  });

  app.delete("/api/devices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid device ID" });
      }

      const success = await storage.deleteDevice(id);
      if (!success) {
        return res.status(404).json({ error: "Device not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete device" });
    }
  });

  app.get("/api/devices/brand/:brandName", async (req, res) => {
    try {
      const { brandName } = req.params;
      const devices = await storage.getDevicesByBrand(brandName);
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch devices by brand" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const devices = await storage.searchDevices(q);
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to search devices" });
    }
  });

  // Brand routes
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  app.get("/api/brands/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid brand ID" });
      }

      const brand = await storage.getBrand(id);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brand" });
    }
  });

  app.post("/api/brands", async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid brand data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create brand" });
    }
  });

  // Comparison routes
  app.get("/api/comparisons", async (req, res) => {
    try {
      const comparisons = await storage.getComparisons();
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comparisons" });
    }
  });

  app.get("/api/comparisons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid comparison ID" });
      }

      const comparison = await storage.getComparison(id);
      if (!comparison) {
        return res.status(404).json({ error: "Comparison not found" });
      }

      res.json(comparison);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comparison" });
    }
  });

  app.post("/api/comparisons", async (req, res) => {
    try {
      const comparisonData = insertComparisonSchema.parse(req.body);
      const comparison = await storage.createComparison(comparisonData);
      res.status(201).json(comparison);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid comparison data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create comparison" });
    }
  });

  app.delete("/api/comparisons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid comparison ID" });
      }

      const success = await storage.deleteComparison(id);
      if (!success) {
        return res.status(404).json({ error: "Comparison not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comparison" });
    }
  });

  // Compare multiple devices endpoint
  app.post("/api/compare", async (req, res) => {
    try {
      const { deviceIds } = req.body;
      if (!Array.isArray(deviceIds) || deviceIds.length < 2) {
        return res.status(400).json({ error: "At least 2 device IDs are required for comparison" });
      }

      const devices = await Promise.all(
        deviceIds.map(async (id: number) => {
          const device = await storage.getDevice(id);
          if (!device) {
            throw new Error(`Device with ID ${id} not found`);
          }
          return device;
        })
      );

      res.json(devices);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to compare devices" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

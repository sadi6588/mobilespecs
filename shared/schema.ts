import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  price: integer("price").notNull(), // in cents
  releaseDate: timestamp("release_date").notNull(),
  image: text("image").notNull(),
  
  // Display
  displaySize: real("display_size").notNull(), // in inches
  displayType: text("display_type").notNull(),
  displayResolution: text("display_resolution").notNull(),
  refreshRate: integer("refresh_rate").notNull(), // in Hz
  brightness: integer("brightness"), // in nits
  
  // Performance
  processor: text("processor").notNull(),
  processorBrand: text("processor_brand").notNull(),
  ram: integer("ram").notNull(), // in GB
  storage: integer("storage").notNull(), // in GB
  expandableStorage: boolean("expandable_storage").default(false),
  
  // Camera
  mainCamera: text("main_camera").notNull(),
  ultraWideCamera: text("ultra_wide_camera"),
  telephotoCamera: text("telephoto_camera"),
  frontCamera: text("front_camera").notNull(),
  videoRecording: text("video_recording").notNull(),
  
  // Battery
  batteryCapacity: integer("battery_capacity").notNull(), // in mAh
  chargingSpeed: integer("charging_speed"), // in watts
  wirelessCharging: boolean("wireless_charging").default(false),
  
  // Design
  dimensions: text("dimensions").notNull(), // WxHxD in mm
  weight: integer("weight").notNull(), // in grams
  buildMaterial: text("build_material").notNull(),
  waterResistance: text("water_resistance"),
  
  // Connectivity
  fiveG: boolean("five_g").default(false),
  wifi: text("wifi").notNull(),
  bluetooth: text("bluetooth").notNull(),
  nfc: boolean("nfc").default(false),
  
  // Software
  operatingSystem: text("operating_system").notNull(),
  osVersion: text("os_version").notNull(),
  
  // Performance Scores
  antutuScore: integer("antutu_score"),
  geekbenchSingle: integer("geekbench_single"),
  geekbenchMulti: integer("geekbench_multi"),
  
  // Additional
  fingerprint: boolean("fingerprint").default(false),
  faceUnlock: boolean("face_unlock").default(false),
  headphoneJack: boolean("headphone_jack").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const comparisons = pgTable("comparisons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  deviceIds: text("device_ids").notNull(), // JSON array of device IDs
  createdAt: timestamp("created_at").defaultNow()
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logo: text("logo"),
  description: text("description"),
  website: text("website"),
  deviceCount: integer("device_count").default(0)
});

export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertComparisonSchema = createInsertSchema(comparisons).omit({
  id: true,
  createdAt: true
});

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  deviceCount: true
});

export type Device = typeof devices.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Comparison = typeof comparisons.$inferSelect;
export type InsertComparison = z.infer<typeof insertComparisonSchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

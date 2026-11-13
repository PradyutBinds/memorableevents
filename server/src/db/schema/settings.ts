import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("Memorable Events"),
  tagline: text("tagline"),
  phone: text("phone").notNull().default("9816585535"),
  email: text("email").notNull().default("info@universalagencies.in"),
  address: text("address").notNull().default("Old Bus Stand Rd, Krishna Nagar, Shimla, Himachal Pradesh 171001"),
  whatsapp: text("whatsapp"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  heroHeadline: text("hero_headline"),
  heroSubheadline: text("hero_subheadline"),
  aboutText: text("about_text"),
  logoUrl: text("logo_url"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true, updatedAt: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;

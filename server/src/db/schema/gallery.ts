import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryTable = pgTable("gallery", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("general"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGallerySchema = createInsertSchema(galleryTable).omit({ id: true, createdAt: true });
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof galleryTable.$inferSelect;

import { Router } from "express";
import { db } from "../../db/index.js";
import {
  adminsTable, servicesTable, bookingsTable, messagesTable,
  galleryTable, testimonialsTable, faqsTable, settingsTable
} from "../../db/index.js";
import { eq, asc, desc, count } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "ua_salt_2024").digest("hex");
}

function requireAuth(req: any, res: any, next: any) {
  if (!(req.session as any)?.adminId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }
    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.username, username));
    if (!admin || admin.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    (req.session as any).adminId = admin.id;
    res.json({ id: admin.id, username: admin.username });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const adminId = (req.session as any).adminId;
    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, adminId));
    if (!admin) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    res.json({ id: admin.id, username: admin.username });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Stats ───────────────────────────────────────────────────────────────────

router.get("/stats", requireAuth, async (req, res) => {
  try {
    const [bookingCounts] = await db.select({ total: count() }).from(bookingsTable);
    const [pendingCounts] = await db.select({ total: count() }).from(bookingsTable).where(eq(bookingsTable.status, "pending"));
    const [confirmedCounts] = await db.select({ total: count() }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed"));
    const [messageCounts] = await db.select({ total: count() }).from(messagesTable);
    const [unreadCounts] = await db.select({ total: count() }).from(messagesTable).where(eq(messagesTable.isRead, false));
    const [serviceCounts] = await db.select({ total: count() }).from(servicesTable);
    const [galleryCounts] = await db.select({ total: count() }).from(galleryTable);
    const [testimonialCounts] = await db.select({ total: count() }).from(testimonialsTable);
    const recentBookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt)).limit(5);
    res.json({
      totalBookings: bookingCounts.total,
      pendingBookings: pendingCounts.total,
      confirmedBookings: confirmedCounts.total,
      totalMessages: messageCounts.total,
      unreadMessages: unreadCounts.total,
      totalServices: serviceCounts.total,
      totalGalleryItems: galleryCounts.total,
      totalTestimonials: testimonialCounts.total,
      recentBookings: recentBookings.map(b => ({ ...b, createdAt: b.createdAt.toISOString() })),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Services ─────────────────────────────────────────────────────────────────

router.get("/services", requireAuth, async (req, res) => {
  try {
    const items = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder), asc(servicesTable.id));
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/services", requireAuth, async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      category: z.string().min(1),
      imageUrl: z.string().optional(),
      price: z.string().optional(),
      features: z.array(z.string()).optional(),
      isActive: z.boolean().optional().default(true),
      sortOrder: z.number().int().optional().default(0),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed" });
      return;
    }
    const [item] = await db.insert(servicesTable).values(parsed.data).returning();
    res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/services/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [item] = await db.update(servicesTable).set(req.body).where(eq(servicesTable.id, id)).returning();
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/services/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Bookings ─────────────────────────────────────────────────────────────────

router.get("/bookings", requireAuth, async (req, res) => {
  try {
    const items = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/bookings/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [item] = await db.update(bookingsTable).set(req.body).where(eq(bookingsTable.id, id)).returning();
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bookings/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(bookingsTable).where(eq(bookingsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Messages ─────────────────────────────────────────────────────────────────

router.get("/messages", requireAuth, async (req, res) => {
  try {
    const items = await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/messages/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [item] = await db.update(messagesTable).set(req.body).where(eq(messagesTable.id, id)).returning();
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/messages/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(messagesTable).where(eq(messagesTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Gallery ─────────────────────────────────────────────────────────────────

router.get("/gallery", requireAuth, async (req, res) => {
  try {
    const items = await db.select().from(galleryTable).orderBy(asc(galleryTable.sortOrder), asc(galleryTable.id));
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gallery", requireAuth, async (req, res) => {
  try {
    const schema = z.object({
      imageUrl: z.string().min(1),
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.string().optional().default("general"),
      isActive: z.boolean().optional().default(true),
      sortOrder: z.number().int().optional().default(0),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed" });
      return;
    }
    const [item] = await db.insert(galleryTable).values(parsed.data).returning();
    res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/gallery/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [item] = await db.update(galleryTable).set(req.body).where(eq(galleryTable.id, id)).returning();
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/gallery/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(galleryTable).where(eq(galleryTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Testimonials ─────────────────────────────────────────────────────────────

router.get("/testimonials", requireAuth, async (req, res) => {
  try {
    const items = await db.select().from(testimonialsTable).orderBy(desc(testimonialsTable.createdAt));
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/testimonials", requireAuth, async (req, res) => {
  try {
    const schema = z.object({
      clientName: z.string().min(1),
      clientTitle: z.string().optional(),
      eventType: z.string().min(1),
      review: z.string().min(1),
      rating: z.number().int().min(1).max(5).optional().default(5),
      avatarUrl: z.string().optional(),
      isActive: z.boolean().optional().default(true),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed" });
      return;
    }
    const [item] = await db.insert(testimonialsTable).values(parsed.data).returning();
    res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/testimonials/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [item] = await db.update(testimonialsTable).set(req.body).where(eq(testimonialsTable.id, id)).returning();
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/testimonials/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── FAQs ─────────────────────────────────────────────────────────────────────

router.get("/faqs", requireAuth, async (req, res) => {
  try {
    const items = await db.select().from(faqsTable).orderBy(asc(faqsTable.sortOrder), asc(faqsTable.id));
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/faqs", requireAuth, async (req, res) => {
  try {
    const schema = z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
      isActive: z.boolean().optional().default(true),
      sortOrder: z.number().int().optional().default(0),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed" });
      return;
    }
    const [item] = await db.insert(faqsTable).values(parsed.data).returning();
    res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/faqs/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [item] = await db.update(faqsTable).set(req.body).where(eq(faqsTable.id, id)).returning();
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/faqs/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    await db.delete(faqsTable).where(eq(faqsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Settings ─────────────────────────────────────────────────────────────────

router.get("/settings", requireAuth, async (req, res) => {
  try {
    const [settings] = await db.select().from(settingsTable).limit(1);
    if (!settings) {
      res.status(404).json({ error: "Settings not found" });
      return;
    }
    const { updatedAt: _u, ...rest } = settings;
    res.json(rest);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/settings", requireAuth, async (req, res) => {
  try {
    const [existing] = await db.select().from(settingsTable).limit(1);
    let settings;
    if (existing) {
      [settings] = await db.update(settingsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(settingsTable.id, existing.id)).returning();
    } else {
      [settings] = await db.insert(settingsTable).values(req.body).returning();
    }
    const { updatedAt: _u, ...rest } = settings!;
    res.json(rest);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

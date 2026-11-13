import { Router } from "express";
import { db } from "../db/index.js";
import { bookingsTable } from "../db/index.js";
import { z } from "zod";

const router = Router();

const bookingSchema = z.object({
  clientName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  eventType: z.string().min(1),
  eventDate: z.string().min(1),
  venue: z.string().optional(),
  guestCount: z.number().int().positive().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

router.post("/", async (req, res) => {
  try {
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
      return;
    }
    const [booking] = await db.insert(bookingsTable).values(parsed.data).returning();
    res.status(201).json({ ...booking, createdAt: booking.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { Router } from "express";
import { db } from "../db/index.js";
import { messagesTable } from "../db/index.js";
import { z } from "zod";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

router.post("/", async (req, res) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
      return;
    }
    const [msg] = await db.insert(messagesTable).values(parsed.data).returning();
    res.status(201).json({ ...msg, createdAt: msg.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

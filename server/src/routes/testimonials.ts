import { Router } from "express";
import { db } from "../db/index.js";
import { testimonialsTable } from "../db/index.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.isActive, true))
      .orderBy(desc(testimonialsTable.createdAt));
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

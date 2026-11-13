import { Router } from "express";
import { db } from "../db/index.js";
import { galleryTable } from "../db/index.js";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(galleryTable)
      .where(eq(galleryTable.isActive, true))
      .orderBy(asc(galleryTable.sortOrder), asc(galleryTable.id));
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

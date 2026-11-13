import { Router } from "express";
import { db } from "../db/index.js";
import { servicesTable } from "../db/index.js";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const services = await db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.isActive, true))
      .orderBy(asc(servicesTable.sortOrder), asc(servicesTable.id));
    res.json(services.map(s => ({ ...s, createdAt: s.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, id));
    if (!service) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...service, createdAt: service.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { Router } from "express";
import { db } from "../db/index.js";
import { settingsTable } from "../db/index.js";

const router = Router();

router.get("/", async (req, res) => {
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

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import galleryRouter from "./gallery";
import testimonialsRouter from "./testimonials";
import faqsRouter from "./faqs";
import contactRouter from "./contact";
import bookingsRouter from "./bookings";
import settingsRouter from "./settings";
import adminRouter from "./admin/index";

const router: IRouter = Router();

router.use(healthRouter);

// Public routes
router.use("/services", servicesRouter);
router.use("/gallery", galleryRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/faqs", faqsRouter);
router.use("/contact", contactRouter);
router.use("/bookings", bookingsRouter);
router.use("/settings", settingsRouter);

// Admin routes
router.use("/admin", adminRouter);

export default router;

import { authMiddleware } from "@middlewares/auth.middleware"; 
import { Router } from "express";
import adminRoutes from "./admin.route";
import authRoutes from "./auth.route"; 
import bookingRoutes from "./booking.route";

const router = Router();

router.use("/auth", authRoutes); 
router.use("/admins", authMiddleware, adminRoutes);
router.use("/users", authMiddleware, adminRoutes);
router.use("/bookings", authMiddleware, bookingRoutes);
 
 

export default router;

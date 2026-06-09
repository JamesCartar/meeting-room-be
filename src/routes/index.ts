import { rateLimiter } from "@middlewares/rateLimit.middleware";
import { Router } from "express";
import v1Route from "./v1";

const router = Router();

router.use("/v1", rateLimiter, v1Route);

export default router;

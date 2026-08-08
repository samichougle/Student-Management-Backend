import express from "express";
import { getDashboardStatsController } from "../controllers/dashboard.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStatsController);

export default router;

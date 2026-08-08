import asyncHandler from "../utils/asyncHandler.js";
import { getDashboardStatsService } from "../services/dashboard.services.js";

export const getDashboardStatsController = asyncHandler(async (req, res) => {
  const stats = await getDashboardStatsService();

  return res.status(200).json({
    success: true,
    data: stats,
  });
});

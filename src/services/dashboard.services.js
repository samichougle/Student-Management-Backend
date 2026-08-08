import { getDashboardStats } from "../models/dashboard.model.js";

export async function getDashboardStatsService() {
  try {
    return await getDashboardStats();
  } catch (error) {
    throw new Error(
      "Error while fetching dashboard statistics: " + error.message,
    );
  }
}

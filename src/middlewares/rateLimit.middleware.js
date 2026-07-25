import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again after 15 minutes.",
    });
  },

  standardHeaders: "draft-8",
  legacyHeaders: false,
});

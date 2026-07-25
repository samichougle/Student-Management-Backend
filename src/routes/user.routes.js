import express from "express";
import {
  getProfileController,
  registerUserController,
  forgotPasswordController,
  refreshTokenController,
  logoutController,
  loginUserController,
  resetPasswordController,
} from "../controllers/user.controllers.js";

import {
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/user.validation.js";

import { validate } from "../middlewares/validation.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sami Chougle
 *               email:
 *                 type: string
 *                 example: sami@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post(
  "/register",
  authLimiter,
  validate(registerUserSchema),
  registerUserController,
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: sami@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  "/login",
  authLimiter,
  validate(loginUserSchema),
  loginUserController,
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 */
router.get("/profile", protect, getProfileController);

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordController,
);

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController,
);

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Generate a new access token using a refresh token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Access token generated successfully
 */
router.post("/refresh-token", refreshTokenController);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post("/logout", protect, logoutController);

export default router;

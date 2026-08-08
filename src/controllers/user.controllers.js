import asyncHandler from "../utils/asyncHandler.js";
import {
  registerUserService,
  loginUserService,
  getProfileService,
  forgotPasswordService,
  resetPasswordService,
  refreshTokenService,
  logoutService,
} from "../services/user.services.js";
import { success } from "zod";
import { userInfo } from "os";

export const registerUserController = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await registerUserService(userData);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const loginUserController = asyncHandler(async (req, res) => {
  const result = await loginUserService(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    data: {
      user: result.user,
    },
  });
});

export const getProfileController = asyncHandler(async (req, res) => {
  const user = await getProfileService(req.user.id);
  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await forgotPasswordService(email);

  return res.status(200).json({
    success: true,
    message: "Password reset token generated successfully.",
    data: result,
  });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await resetPasswordService(token, password);
  return res.status(200).json({
    success: true,
    message: "Password reset successfully.",
    data: user,
  });
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const result = await refreshTokenService(refreshToken);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Access token generated successfully.",
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const result = await logoutService(req.user.id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});

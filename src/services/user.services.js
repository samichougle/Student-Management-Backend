import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserById } from "../models/user.model.js";
import { sendEmail } from "./email.services.js";
import { getUserByResetToken, updatePassword } from "../models/user.model.js";
import {
  createUser,
  getUserByEmail,
  saveResetPasswordToken,
  saveRefreshToken,
  removeRefreshToken,
} from "../models/user.model.js";
import crypto from "crypto";
import { email } from "zod";

export async function registerUserService(userData) {
  const existingUser = await getUserByEmail(userData.email);

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await createUser({
    ...userData,
    password: hashedPassword,
    role: "user",
  });

  return user;
}

export async function loginUserService(userData) {
  const user = await getUserByEmail(userData.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  );

  await saveRefreshToken(user.id, refreshToken);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function getProfileService(userId) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User Not Found");
  }
  return user;
}

export async function forgotPasswordService(email) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

  await saveResetPasswordToken(user.id, resetToken, resetTokenExpires);

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password.</p>
    <p>Click the link below to reset it:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  await sendEmail(user.email, "Reset Your Password", html);

  return {
    message: "Password reset email sent successfully.",
  };
}

export async function resetPasswordService(token, password) {
  const user = await getUserByResetToken(token);
  if (!user) {
    throw new Error("Invalid or expired reset token");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await updatePassword(user.id, hashedPassword);

  return updatedUser;
}

export async function refreshTokenService(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await getUserById(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.refresh_token !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
  return { accessToken };
}

export async function logoutService(userId) {
  const user = await removeRefreshToken(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    message: "Logged out successfully",
  };
}

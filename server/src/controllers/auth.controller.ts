import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  refreshUserToken,
} from "../services/auth.service.js";

import { deleteUserTokens } from "../repositories/auth.repository.js";
import { logger } from "../utils/logger.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const tokens = await registerUser(email, password);

    res.json(tokens);
  } catch (err: unknown) {
    logger.error(err);
    if (
      typeof err === "object" &&
      err != null &&
      "code" in err &&
      err.code === "23505"
    ) {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({
      error:
        typeof err === "object" &&
        err != null &&
        "message" in err &&
        err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const tokens = await loginUser(email, password);

    res.json(tokens);
  } catch (error) {
    logger.error(error);

    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await refreshUserToken(refreshToken);

    res.json(tokens);
  } catch {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

export const logoutAll = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    await deleteUserTokens(req.user.id);
    res.json({ message: "Logged out everywhere" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

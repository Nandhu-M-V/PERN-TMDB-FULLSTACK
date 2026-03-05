import { verifyAccess } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ error: "Unauthorized" });

  try {
    const token = header.split(" ")[1];

    req.user = verifyAccess(token);

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

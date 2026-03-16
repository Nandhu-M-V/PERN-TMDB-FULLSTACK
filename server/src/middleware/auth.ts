import { verifyAccess } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const payload = verifyAccess(token);

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

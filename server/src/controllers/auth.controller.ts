import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt.js";
import { Request, Response } from "express";

export interface JwtUser {
  id: number;
  role: string;
}

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await pool.query(
    "INSERT INTO users(email,password) VALUES($1,$2) RETURNING id,email,role",
    [email, hash],
  );

  const access = signAccess(user.rows[0]);
  const refresh = signRefresh(user.rows[0].id);

  await pool.query(
    "INSERT INTO refresh_tokens(user_id,token,expires_at) VALUES($1,$2,NOW()+interval '7 days')",
    [user.rows[0].id, refresh],
  );

  res.json({ access, refresh });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  if (!result.rows.length)
    return res.status(401).json({ error: "Invalid credentials" });

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const access = signAccess(user);
  const refresh = signRefresh(user.id);

  await pool.query(
    "INSERT INTO refresh_tokens(user_id,token,expires_at) VALUES($1,$2,NOW()+interval '7 days')",
    [user.id, refresh],
  );

  res.json({ access, refresh });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const payload = verifyRefresh(refreshToken) as JwtUser;

  const stored = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token=$1",
    [refreshToken],
  );

  if (!stored.rows.length)
    return res.status(403).json({ error: "Invalid refresh token" });

  const user = await pool.query<{ id: number; role: string }>(
    "SELECT id,role FROM users WHERE id=$1",
    [payload.id],
  );

  if (!user.rows.length)
    return res.status(404).json({ error: "User not found" });

  const newAccess = signAccess(user.rows[0]);
  const newRefresh = signRefresh(payload.id);

  await pool.query("DELETE FROM refresh_tokens WHERE token=$1", [refreshToken]);

  await pool.query(
    "INSERT INTO refresh_tokens(user_id,token,expires_at) VALUES($1,$2,NOW()+interval '7 days')",
    [payload.id, newRefresh],
  );

  res.json({ access: newAccess, refresh: newRefresh });
};

export const logoutAll = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await pool.query("DELETE FROM refresh_tokens WHERE user_id=$1", [
    req.user.id,
  ]);

  res.json({ message: "Logged out everywhere" });
};

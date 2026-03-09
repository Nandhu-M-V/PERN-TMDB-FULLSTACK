import { pool } from "../config/db.js";

export const createUser = async (email: string, password: string) => {
  const result = await pool.query(
    "INSERT INTO users(email,password) VALUES($1,$2) RETURNING id,email,role",
    [email, password],
  );

  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  return result.rows[0];
};

export const findUserById = async (id: number) => {
  const result = await pool.query("SELECT id,role FROM users WHERE id=$1", [
    id,
  ]);

  return result.rows[0];
};

export const storeRefreshToken = async (userId: number, token: string) => {
  await pool.query(
    "INSERT INTO refresh_tokens(user_id,token,expires_at) VALUES($1,$2,NOW()+interval '7 days')",
    [userId, token],
  );
};

export const findRefreshToken = async (token: string) => {
  const result = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token=$1",
    [token],
  );

  return result.rows[0];
};

export const deleteRefreshToken = async (token: string) => {
  await pool.query("DELETE FROM refresh_tokens WHERE token=$1", [token]);
};

export const deleteUserTokens = async (userId: number) => {
  await pool.query("DELETE FROM refresh_tokens WHERE user_id=$1", [userId]);
};

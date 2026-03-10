import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserById,
  storeRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from "../repositories/auth.repository.js";

import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt.js";

export const registerUser = async (email: string, password: string) => {
  const hash = await bcrypt.hash(password, 10);

  const user = await createUser(email, hash);

  const access = signAccess(user);
  const refresh = signRefresh(user.id);

  await storeRefreshToken(user.id, refresh);

  return { access, refresh };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const access = signAccess({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refresh = signRefresh(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    access,
    refresh,
  };
};

export const refreshUserToken = async (refreshToken: string) => {
  const payload = verifyRefresh(refreshToken);

  const stored = await findRefreshToken(refreshToken);

  if (!stored) throw new Error("Invalid refresh token");

  const user = await findUserById(payload.id);

  if (!user) throw new Error("User not found");

  const newAccess = signAccess(user);
  const newRefresh = signRefresh(user.id);

  await deleteRefreshToken(refreshToken);
  await storeRefreshToken(user.id, newRefresh);

  return { access: newAccess, refresh: newRefresh };
};

import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { redis } from "../config/redis.js";

export async function registerUser(data) {
  const passwordHash = await hashPassword(data.password);
  return await User.create({ ...data, passwordHash });
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return null;

  const token = signToken({ id: user._id });

  await redis.set(`session:${user._id}`, token);

  return { user, token };
}

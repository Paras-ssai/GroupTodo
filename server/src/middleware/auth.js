import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";

export default async function auth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await redis.get(`session:${decoded.id}`);
    if (!session) return res.sendStatus(401);

    req.user = decoded;
    next();
  } catch {
    return res.sendStatus(401);
  }
}

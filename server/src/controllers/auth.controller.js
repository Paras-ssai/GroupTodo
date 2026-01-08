import { registerUser, loginUser } from "../services/auth.service.js";
import User from "../models/User.js";
import { redis } from "../config/redis.js";

export const register = async (req, res) => {
  try {
    const exists = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }]
    });

    if (exists) return res.status(400).json({ msg: "User already exists" });

    const user = await registerUser(req.body);

    res.json({ msg: "Registered", user: { id: user._id, name: user.name, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: "Error registering user" });
  }
};


export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body.email, req.body.password);

    if (!result) return res.status(400).json({ msg: "Invalid credentials" });

    const { user, token } = result;

    res.cookie("token", token, { httpOnly: true }).json({
      msg: "Logged in",
      user: { id: user._id, name: user.name, email: user.email, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};


export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
};


export const logout = async (req, res) => {
  await redis.del(`session:${req.user.id}`);
  res.clearCookie("token").json({ msg: "Logged out" });
};

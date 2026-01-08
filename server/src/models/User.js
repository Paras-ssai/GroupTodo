import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  passwordHash: String
}, { timestamps: true });

// Add text index for efficient searching
userSchema.index({ name: "text", username: "text", email: "text" });

export default mongoose.model("User", userSchema);

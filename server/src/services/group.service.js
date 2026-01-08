import Group from "../models/Group.js";
import User from "../models/User.js";

export async function createGroupService(userId, name) {
  return await Group.create({
    name,
    createdBy: userId,
    admins: [userId],
    members: [userId]
  });
}

export async function findGroupById(id) {
  return await Group.findById(id);
}

export async function findUserByUsername(username) {
  return await User.findOne({ username });
}

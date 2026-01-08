import {
  createGroupService,
  findGroupById,
  findUserByUsername
} from "../services/group.service.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import Todo from "../models/Todo.js";
import { cacheDel } from "../utils/cache.js";

export const createGroup = async (req, res) => {
  try {
    const group = await createGroupService(req.user.id, req.body.name);
    res.json(group);
  } catch {
    res.status(500).json({ msg: "Error creating group" });
  }
};


export const myGroups = async (req, res) => {
  const allGroups = await Group.find({ members: req.user.id }).populate('members', 'name');

  const admin = allGroups.filter(g => g.admins.some(a => a.toString() === req.user.id));
  const member = allGroups.filter(g => !g.admins.some(a => a.toString() === req.user.id));

  res.json({ admin, member });
};


export const addUserToGroup = async (req, res) => {
  try {
    const group = await findGroupById(req.params.id);
    if (!group) return res.sendStatus(404);

    if (!group.admins.some(a => a.toString() === req.user.id))
      return res.sendStatus(403);

    const user = await findUserByUsername(req.body.username);
    if (!user) return res.sendStatus(404);

    if (group.members.includes(user._id))
      return res.status(400).json({ msg: "Already member" });

    group.members.push(user._id);
    await group.save();

    // Clear cache
    await cacheDel(`groups:${req.user.id}`);

    // Notify the added user
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    const sockets = userSockets.get(user._id.toString());
    if (sockets) {
      for (const socketId of sockets) {
        io.to(socketId).emit('userAdded', { group: group.name, groupId: group._id });
      }
    }

    res.json({ msg: "User added" });

  } catch {
    res.status(500).json({ msg: "Error adding user" });
  }
};


export const leaveGroup = async (req, res) => {
  try {
    const group = await findGroupById(req.params.id);
    if (!group) return res.sendStatus(404);

    if (group.admins.includes(req.user.id))
      return res.status(400).json({ msg: "Admin cannot leave group" });

    group.members = group.members.filter(
      m => m.toString() !== req.user.id
    );

    await group.save();

    // Clear cache
    await cacheDel(`groups:${req.user.id}`);

    // Notify remaining members
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    const user = await User.findById(req.user.id).select('name');
    for (const memberId of group.members) {
      const sockets = userSockets.get(memberId.toString());
      if (sockets) {
        for (const socketId of sockets) {
          io.to(socketId).emit('userLeft', { groupId: group._id, groupName: group.name, userName: user.name });
        }
      }
    }

    res.json({ msg: "Left group" });
  } catch {
    res.status(500).json({ msg: "Error leaving group" });
  }
};


export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query || query.length < 2) return res.json([]);

    // Use MongoDB text search for better performance
    const users = await User.find({
      $text: { $search: query }
    }, {
      score: { $meta: "textScore" }
    }).select("name username email").sort({ score: { $meta: "textScore" } }).limit(10);

    res.json(users);
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ msg: "Error searching users" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await findGroupById(req.params.id);
    if (!group) return res.sendStatus(404);

    if (!group.admins.some(a => a.toString() === req.user.id))
      return res.sendStatus(403);

    // Check if all todos are completed
    const uncheckedTodos = await Todo.find({ groupId: req.params.id, completed: false });
    if (uncheckedTodos.length > 0) {
      return res.status(400).json({ msg: "Cannot delete group with unchecked todos" });
    }

    // Delete all todos in the group
    await Todo.deleteMany({ groupId: req.params.id });

    // Delete the group
    await Group.findByIdAndDelete(req.params.id);

    // Notify all members
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    for (const memberId of group.members) {
      const sockets = userSockets.get(memberId.toString());
      if (sockets) {
        for (const socketId of sockets) {
          io.to(socketId).emit('groupDeleted', { groupId: req.params.id, groupName: group.name });
        }
      }
    }

    res.json({ msg: "Group deleted" });
  } catch (error) {
    console.error("Delete group error:", error);
    res.status(500).json({ msg: "Error deleting group" });
  }
};

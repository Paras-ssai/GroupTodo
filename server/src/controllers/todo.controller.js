import {
  createTodoService,
  getUserTodos,
  getGroupTodos,
  updateTodoById,
  deleteTodoById
} from "../services/todo.service.js";

import { canEditTodo, canDeleteTodo } from "../middleware/permissions.js";
import { cacheGet, cacheSet, cacheDel } from "../utils/cache.js";
import Todo from "../models/Todo.js";
import Group from "../models/Group.js";


// CREATE
export const createTodo = async (req, res) => {
  try {
    const todo = await createTodoService({
      title: req.body.title,
      description: req.body.description,
      userId: req.user.id,
      groupId: req.body.groupId || null,
      updatedBy: req.user.id
    });

    await cacheDel(`todos:user:${req.user.id}`);
    if (req.body.groupId) await cacheDel(`todos:group:${req.body.groupId}`);

    const populated = await Todo.findById(todo._id).populate('userId', 'name').populate('updatedBy', 'name');
    res.json(populated);

    // Notify group members
    if (req.body.groupId) {
      const io = req.app.get('io');
      const userSockets = req.app.get('userSockets');
      const group = await Group.findById(req.body.groupId);
      if (group) {
        for (const memberId of group.members) {
          if (memberId.toString() !== req.user.id) {
            const sockets = userSockets.get(memberId.toString());
            if (sockets) {
              for (const socketId of sockets) {
                io.to(socketId).emit('todoCreated', { groupId: req.body.groupId, groupName: group.name, todo: populated });
              }
            }
          }
        }
      }
    }
  } catch {
    res.status(500).json({ msg: "Error creating todo" });
  }
};


// MY TODOS — cached
export const myTodos = async (req, res) => {
  const key = `todos:user:${req.user.id}`;
  const cached = await cacheGet(key);
  if (cached) return res.json(cached);

  const todos = await getUserTodos(req.user.id);

  await cacheSet(key, todos);
  res.json(todos);
};


// GROUP TODOS — cached
export const groupTodos = async (req, res) => {
  const key = `todos:group:${req.params.id}`;
  const cached = await cacheGet(key);
  if (cached) return res.json(cached);

  const todos = await getGroupTodos(req.params.id);

  await cacheSet(key, todos);
  res.json(todos);
};


// EDIT — owner or group admin
export const editTodo = async (req, res) => {
  const allowed = await canEditTodo(req.user.id, req.params.id);
  if (!allowed) return res.sendStatus(403);

  const updated = await updateTodoById(
    req.params.id,
    { ...req.body, updatedBy: req.user.id }
  );

  await cacheDel(`todos:user:${updated.userId}`);
  if (updated.groupId) await cacheDel(`todos:group:${updated.groupId}`);

  const populated = await Todo.findById(updated._id).populate('userId', 'name').populate('updatedBy', 'name');
  res.json(populated);

  // Notify group members
  if (updated.groupId) {
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    const group = await Group.findById(updated.groupId);
    if (group) {
      for (const memberId of group.members) {
        if (memberId.toString() !== req.user.id) {
          const sockets = userSockets.get(memberId.toString());
          if (sockets) {
            for (const socketId of sockets) {
              io.to(socketId).emit('todoUpdated', { groupId: updated.groupId, groupName: group.name, todo: populated });
            }
          }
        }
      }
    }
  }
};


// DELETE — owner only
export const deleteTodo = async (req, res) => {
  const allowed = await canDeleteTodo(req.user.id, req.params.id);
  if (!allowed) return res.sendStatus(403);

  const todo = await deleteTodoById(req.params.id);

  await cacheDel(`todos:user:${todo.userId}`);
  if (todo.groupId) await cacheDel(`todos:group:${todo.groupId}`);

  res.json({ msg: "Deleted" });

  // Notify group members
  if (todo.groupId) {
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    const group = await Group.findById(todo.groupId);
    if (group) {
      for (const memberId of group.members) {
        if (memberId.toString() !== req.user.id) {
          const sockets = userSockets.get(memberId.toString());
          if (sockets) {
            for (const socketId of sockets) {
              io.to(socketId).emit('todoDeleted', { groupId: todo.groupId, groupName: group.name, todoId: todo._id });
            }
          }
        }
      }
    }
  }
};

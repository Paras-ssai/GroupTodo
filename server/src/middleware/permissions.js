import Group from "../models/Group.js";
import Todo from "../models/Todo.js";

export async function isGroupAdmin(userId, groupId) {
  const group = await Group.findById(groupId);
  if (!group) return false;
  return group.admins.some(a => a.toString() === userId);
}

export async function canEditTodo(userId, todoId) {
  const todo = await Todo.findById(todoId);
  if (!todo) return false;

  if (todo.userId.toString() === userId) return true;

  if (todo.groupId) return await isGroupAdmin(userId, todo.groupId);

  return false;
}

export async function canDeleteTodo(userId, todoId) {
  const todo = await Todo.findById(todoId);
  if (!todo) return false;

  return todo.userId.toString() === userId;
}

import Todo from "../models/Todo.js";

export async function createTodoService(data) {
  return await Todo.create(data);
}

export async function getUserTodos(userId) {
  return await Todo.find({ userId }).populate('userId', 'name').populate('updatedBy', 'name');
}

export async function getGroupTodos(groupId) {
  return await Todo.find({ groupId }).populate('userId', 'name').populate('updatedBy', 'name');
}

export async function updateTodoById(todoId, update) {
  return await Todo.findByIdAndUpdate(todoId, update, { new: true });
}

export async function deleteTodoById(todoId) {
  return await Todo.findByIdAndDelete(todoId);
}

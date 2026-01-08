import api from "./axios";

export const getMyTodosApi = () =>
  api.get("/todos/my");

export const getGroupTodosApi = (groupId) =>
  api.get(`/todos/group/${groupId}`);

export const createTodoApi = (data) =>
  api.post("/todos", data);

export const updateTodoApi = (id, data) =>
  api.put(`/todos/${id}`, data);

export const deleteTodoApi = (id) =>
  api.delete(`/todos/${id}`);

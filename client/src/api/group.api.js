import api from "./axios";

export const fetchGroupsApi = () =>
  api.get("/groups/my");

export const createGroupApi = (data) =>
  api.post("/groups", data);

export const searchUsersApi = (query) =>
  api.get(`/groups/search?q=${query}`);

export const addUserToGroupApi = (groupId, username) =>
  api.post(`/groups/${groupId}/addUser`, { username });

export const leaveGroupApi = (groupId) =>
  api.post(`/groups/${groupId}/leave`);

export const deleteGroupApi = (groupId) =>
  api.delete(`/groups/${groupId}`);

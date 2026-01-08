export const canCreateGroup = (role) => role === "admin";
export const canAddMembers = (role) => role === "admin";
export const canCreateTodo = (role) => true;

export const canEditTodo = (isOwner, isGroupAdmin) => isOwner || isGroupAdmin;
export const canDeleteTodo = (isOwner) => isOwner;

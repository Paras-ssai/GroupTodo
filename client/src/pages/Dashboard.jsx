import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client';
import { toast } from 'react-toastify';

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import GroupTabs from "../components/GroupTabs";
import GroupMembers from "../components/GroupMembers";
import TodoList from "../components/TodoList";
import CreateGroupModal from "../components/CreateGroupModal";
import CreateTodoModal from "../components/CreateTodoModal";

import {
  fetchGroupsRequest,
  selectGroup,
  createGroupRequest,
  deleteGroupRequest
} from "../features/group/groupSlice";

import {
  fetchTodosRequest,
  createTodoRequest,
  updateTodoRequest,
  deleteTodoRequest
} from "../features/todo/todoSlice";

import {
  canCreateGroup,
  canCreateTodo
} from "../utils/permissions";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { adminGroups, memberGroups, selectedGroup } =
    useSelector((state) => state.group);

  const { todos } = useSelector((state) => state.todo);

  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("admin");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateTodo, setShowCreateTodo] = useState(false);

  const socketRef = useRef(null);

  // 🔹 Fetch groups on load
  useEffect(() => {
    dispatch(fetchGroupsRequest());
  }, [dispatch]);

  // 🔹 Socket connection
  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io('http://localhost:5000');
      
      const emitRegister = () => {
        socketRef.current.emit('register', user._id);
      };

      emitRegister();

      socketRef.current.on('connect', emitRegister);

      socketRef.current.on('userAdded', (data) => {
        toast(`You were added to group "${data.group}"`);
        dispatch(fetchGroupsRequest());
      });

      socketRef.current.on('todoCreated', (data) => {
        toast(`A new todo was added to group "${data.groupName}"`);
        if (selectedGroup && selectedGroup._id === data.groupId) {
          dispatch(fetchTodosRequest({ groupId: data.groupId }));
        }
        console.log("Received todoCreated for group", data.groupId);
      });

      socketRef.current.on('todoUpdated', (data) => {
        toast(`A todo was updated in group "${data.groupName}"`);
        if (selectedGroup && selectedGroup._id === data.groupId) {
          dispatch(fetchTodosRequest({ groupId: data.groupId }));
        }
        console.log("Received todoUpdated for group", data.groupId);
      });

      socketRef.current.on('todoDeleted', (data) => {
        toast(`A todo was deleted from group "${data.groupName}"`);
        if (selectedGroup && selectedGroup._id === data.groupId) {
          dispatch(fetchTodosRequest({ groupId: data.groupId }));
        }
        console.log("Received todoDeleted for group", data.groupId);
      });

      socketRef.current.on('groupDeleted', (data) => {
        toast(`Group "${data.groupName}" was deleted`);
        dispatch(fetchGroupsRequest());
        if (selectedGroup && selectedGroup._id === data.groupId) {
          // Deselect if current group is deleted
          dispatch(selectGroup(null));
        }
        console.log("Received groupDeleted", data.groupId);
      });

      socketRef.current.on('userLeft', (data) => {
        if (selectedGroup && selectedGroup._id === data.groupId) {
          toast(`${data.userName} left the group "${data.groupName}"`);
          dispatch(fetchGroupsRequest()); // To update member list
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  // 🔹 Get correct groups by role
  const groups =
    activeTab === "admin" ? adminGroups : memberGroups;

  const role = activeTab === "admin" ? "admin" : "member";

  // 🔹 Select group
  const handleSelectGroup = (group) => {
    dispatch(selectGroup(group));
    dispatch(fetchTodosRequest({ groupId: group._id }));
  };

  // 🔹 Create group
  const handleCreateGroup = (groupData) => {
    dispatch(createGroupRequest(groupData));
    setShowCreateGroup(false);
  };

  // 🔹 Create todo
  const handleCreateTodo = (todoData) => {
    const data = { ...todoData, groupId: selectedGroup._id };
    dispatch(createTodoRequest(data));
  };

  // 🔹 Update todo
  const handleUpdateTodo = (id, data) => {
    const fullData = { ...data, groupId: selectedGroup._id };
    dispatch(updateTodoRequest({ id, data: fullData }));
  };

  // 🔹 Delete todo
  const handleDeleteTodo = (id) => {
    dispatch(deleteTodoRequest({ id, groupId: selectedGroup._id }));
  };

  // 🔹 Delete group
  const handleDeleteGroup = () => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      dispatch(deleteGroupRequest(selectedGroup._id));
    }
  };

  return (
    <>
      {/* 🔹 Top Navbar */}
      <Navbar />

      <div className="flex h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* 🔹 Sidebar */}
        <Sidebar
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={handleSelectGroup}
          showCreate={canCreateGroup(role)}
          onCreateClick={() => setShowCreateGroup(true)}
          totalGroups={adminGroups.length + memberGroups.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* 🔹 Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Tabs */}
          <GroupTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {!selectedGroup ? (
            <p className="text-gray-500 mt-6">
              Select a group to view todos
            </p>
          ) : (
            <>
              {/* Group Header */}
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                  {selectedGroup.name}
                </h1>

                <div className="flex items-center space-x-4">
                  <GroupMembers users={selectedGroup.members || []} />
                  {activeTab === "admin" && adminGroups.some(g => g._id === selectedGroup?._id) && todos.every(t => t.completed) && (
                    <button
                      onClick={handleDeleteGroup}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete Group
                    </button>
                  )}
                </div>
              </div>

              {/* Create Todo Button */}
              {canCreateTodo(role) && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowCreateTodo(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add New Todo</span>
                  </button>
                </div>
              )}

              {/* Todo List */}
              <TodoList todos={todos} onUpdate={handleUpdateTodo} onDelete={handleDeleteTodo} user={user} group={selectedGroup} />
            </>
          )}
        </main>
      </div>

      {/* 🔹 Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}

      {/* 🔹 Create Todo Modal */}
      {showCreateTodo && (
        <CreateTodoModal
          onClose={() => setShowCreateTodo(false)}
          onCreate={handleCreateTodo}
        />
      )}
    </>
  );
}

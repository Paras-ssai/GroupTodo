import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminGroups: [],
  memberGroups: [],
  selectedGroup: null,
  users: [],
  loading: false,
  error: null
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    fetchGroupsRequest: (state) => {
      state.loading = true;
    },
    fetchGroupsSuccess: (state, action) => {
      state.loading = false;
      state.adminGroups = action.payload.admin;
      state.memberGroups = action.payload.member;
    },
    fetchGroupsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    selectGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },

    createGroupRequest: (state) => {
      state.loading = true;
    },
    createGroupSuccess: (state, action) => {
      state.loading = false;
      state.adminGroups.push(action.payload);
    },
    createGroupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    searchUsersRequest: (state) => {
      state.loading = true;
    },
    searchUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    searchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addUserToGroupRequest: (state) => {
      state.loading = true;
    },
    addUserToGroupSuccess: (state) => {
      state.loading = false;
    },
    addUserToGroupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteGroupRequest: (state) => {
      state.loading = true;
    },
    deleteGroupSuccess: (state, action) => {
      state.loading = false;
      state.adminGroups = state.adminGroups.filter(g => g._id !== action.payload);
      if (state.selectedGroup && state.selectedGroup._id === action.payload) {
        state.selectedGroup = null;
      }
    },
    deleteGroupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchGroupsRequest,
  fetchGroupsSuccess,
  fetchGroupsFailure,
  selectGroup,
  createGroupRequest,
  createGroupSuccess,
  createGroupFailure,
  searchUsersRequest,
  searchUsersSuccess,
  searchUsersFailure,
  addUserToGroupRequest,
  addUserToGroupSuccess,
  addUserToGroupFailure,
  deleteGroupRequest,
  deleteGroupSuccess,
  deleteGroupFailure
} = groupSlice.actions;

export default groupSlice.reducer;

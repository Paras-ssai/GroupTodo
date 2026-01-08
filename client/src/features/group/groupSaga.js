import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchGroupsApi,
  createGroupApi,
  searchUsersApi,
  addUserToGroupApi,
  deleteGroupApi
} from "../../api/group.api";

import {
  fetchGroupsRequest,
  fetchGroupsSuccess,
  fetchGroupsFailure,
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
} from "./groupSlice";

function* fetchGroups() {
  try {
    const res = yield call(fetchGroupsApi);
    yield put(fetchGroupsSuccess(res.data));
  } catch (err) {
    yield put(fetchGroupsFailure("Failed to load groups"));
  }
}

function* createGroup(action) {
  try {
    const { members, ...groupData } = action.payload;
    const res = yield call(createGroupApi, groupData);
    const group = res.data;

    // Add selected members
    if (members && members.length > 0) {
      for (const user of members) {
        try {
          yield call(addUserToGroupApi, group._id, user.username);
        } catch (err) {
          // ignore errors for now
        }
      }
    }

    yield put(createGroupSuccess(group));
  } catch (err) {
    yield put(createGroupFailure("Failed to create group"));
  }
}

function* searchUsers(action) {
  try {
    const res = yield call(searchUsersApi, action.payload);
    yield put(searchUsersSuccess(res.data));
  } catch (err) {
    yield put(searchUsersFailure("Failed to search users"));
  }
}

function* addUserToGroup(action) {
  try {
    yield call(addUserToGroupApi, action.payload.groupId, action.payload.username);
    yield put(addUserToGroupSuccess());
  } catch (err) {
    yield put(addUserToGroupFailure("Failed to add user"));
  }
}

function* deleteGroup(action) {
  try {
    yield call(deleteGroupApi, action.payload);
    yield put(deleteGroupSuccess(action.payload));
  } catch (err) {
    yield put(deleteGroupFailure("Failed to delete group"));
  }
}

export default function* groupSaga() {
  yield takeLatest(fetchGroupsRequest.type, fetchGroups);
  yield takeLatest(createGroupRequest.type, createGroup);
  yield takeLatest(searchUsersRequest.type, searchUsers);
  yield takeLatest(addUserToGroupRequest.type, addUserToGroup);
  yield takeLatest(deleteGroupRequest.type, deleteGroup);
}

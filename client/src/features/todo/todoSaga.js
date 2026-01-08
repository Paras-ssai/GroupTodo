import { call, put, takeLatest } from "redux-saga/effects";

import {
  getMyTodosApi,
  getGroupTodosApi,
  createTodoApi,
  updateTodoApi,
  deleteTodoApi
} from "../../api/todo.api";

import {
  fetchTodosRequest,
  fetchTodosSuccess,
  createTodoRequest,
  createTodoSuccess,
  updateTodoRequest,
  updateTodoSuccess,
  deleteTodoRequest,
  deleteTodoSuccess,
  updateTodoOptimistic,
  deleteTodoOptimistic
} from "./todoSlice";

function* fetchTodos(action) {
  try {
    const apiCall = action.payload.groupId ? getGroupTodosApi : getMyTodosApi;
    const res = yield call(apiCall, action.payload.groupId);
    yield put(fetchTodosSuccess(res.data));
  } catch (err) {
    // handle error
  }
}

function* createTodo(action) {
  try {
    yield call(createTodoApi, action.payload);
    yield put(createTodoSuccess());
    // Refetch todos
    const apiCall = action.payload.groupId ? getGroupTodosApi : getMyTodosApi;
    const res = yield call(apiCall, action.payload.groupId);
    yield put(fetchTodosSuccess(res.data));
  } catch (err) {
    // handle error
  }
}

function* updateTodo(action) {
  // Optimistic update
  yield put(updateTodoOptimistic(action.payload));

  try {
    yield call(updateTodoApi, action.payload.id, action.payload.data);
    yield put(updateTodoSuccess());
    // No need to refetch, already updated
  } catch (err) {
    // On error, refetch to revert
    const apiCall = action.payload.data.groupId ? getGroupTodosApi : getMyTodosApi;
    const res = yield call(apiCall, action.payload.data.groupId);
    yield put(fetchTodosSuccess(res.data));
  }
}

function* deleteTodo(action) {
  // Optimistic update
  yield put(deleteTodoOptimistic(action.payload));

  try {
    yield call(deleteTodoApi, action.payload.id);
    yield put(deleteTodoSuccess());
    // No need to refetch
  } catch (err) {
    // On error, refetch to revert
    const apiCall = action.payload.groupId ? getGroupTodosApi : getMyTodosApi;
    const res = yield call(apiCall, action.payload.groupId);
    yield put(fetchTodosSuccess(res.data));
  }
}

export default function* todoSaga() {
  yield takeLatest(fetchTodosRequest.type, fetchTodos);
  yield takeLatest(createTodoRequest.type, createTodo);
  yield takeLatest(updateTodoRequest.type, updateTodo);
  yield takeLatest(deleteTodoRequest.type, deleteTodo);
}

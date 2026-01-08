import { call, put, takeLatest } from "redux-saga/effects";
import {
  loginApi,
  registerApi,
  logoutApi,
  meApi
} from "../../api/auth.api";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  checkAuthRequest,
  checkAuthSuccess,
  checkAuthFailure,
  logout
} from "./authSlice";

function* loginUser(action) {
  try {
    const res = yield call(loginApi, action.payload);
    yield put(loginSuccess(res.data.user));
  } catch (err) {
    yield put(
      loginFailure(err.response?.data?.msg || "Login failed")
    );
  }
}

function* registerUser(action) {
  try {
    const res = yield call(registerApi, action.payload);
    yield put(registerSuccess(res.data.user));
  } catch (err) {
    yield put(
      registerFailure(err.response?.data?.msg || "Register failed")
    );
  }
}

function* logoutUser() {
  try {
    yield call(logoutApi);
  } catch (err) {
    // ignore
  }
  yield put(logout());
}

function* checkAuth() {
  try {
    const res = yield call(meApi);
    yield put(checkAuthSuccess(res.data));
  } catch (err) {
    yield put(checkAuthFailure());
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginUser);
  yield takeLatest(registerRequest.type, registerUser);
  yield takeLatest(logoutRequest.type, logoutUser);
  yield takeLatest(checkAuthRequest.type, checkAuth);
}

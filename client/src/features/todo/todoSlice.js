import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
  loading: false
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    fetchTodosRequest: (state) => {
      state.loading = true;
    },
    fetchTodosSuccess: (state, action) => {
      state.loading = false;
      state.todos = action.payload;
    },

    createTodoRequest: (state) => {
      state.loading = true;
    },
    createTodoSuccess: (state) => {
      state.loading = false;
    },

    updateTodoRequest: (state) => {
      state.loading = true;
    },
    updateTodoSuccess: (state) => {
      state.loading = false;
    },

    deleteTodoRequest: (state) => {
      state.loading = true;
    },
    deleteTodoSuccess: (state) => {
      state.loading = false;
    },

    updateTodoOptimistic: (state, action) => {
      const { id, data } = action.payload;
      const index = state.todos.findIndex(t => t._id === id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...data };
      }
    },

    deleteTodoOptimistic: (state, action) => {
      state.todos = state.todos.filter(t => t._id !== action.payload.id);
    },
  }
});

export const {
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
} = todoSlice.actions;

export default todoSlice.reducer;

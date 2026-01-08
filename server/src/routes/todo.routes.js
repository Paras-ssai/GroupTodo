import express from "express";
import auth from "../middleware/auth.js";
import {
  createTodo,
  myTodos,
  groupTodos,
  editTodo,
  deleteTodo
} from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/", auth, createTodo);
router.get("/my", auth, myTodos);
router.get("/group/:id", auth, groupTodos);
router.put("/:id", auth, editTodo);
router.delete("/:id", auth, deleteTodo);

export default router;

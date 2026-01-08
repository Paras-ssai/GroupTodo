import express from "express";
import auth from "../middleware/auth.js";
import {
  createGroup,
  myGroups,
  addUserToGroup,
  leaveGroup,
  searchUsers,
  deleteGroup
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", auth, createGroup);
router.get("/my", auth, myGroups);
router.post("/:id/addUser", auth, addUserToGroup);
router.post("/:id/leave", auth, leaveGroup);
router.get("/search", auth, searchUsers);
router.delete("/:id", auth, deleteGroup);

export default router;

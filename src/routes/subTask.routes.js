import { Router } from "express";
import {
  createSubTask,
  deleteSubTask,
  getSubTaskById,
  getSubTasks,
  updateSubTask,
} from "../controllers/subTask.controllers.js";
import isLoggedIn from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/create/:taskId", isLoggedIn, createSubTask);
router.post("/get-sub-tasks/:taskId", isLoggedIn, getSubTasks);
router.post("/get-sub-task-by-id/:subTaskId", isLoggedIn, getSubTaskById);
router.put("/update-sub-task/:subTaskId", isLoggedIn, updateSubTask);
router.delete("/delete-sub-task/:subTaskId", isLoggedIn, deleteSubTask);

export default router;

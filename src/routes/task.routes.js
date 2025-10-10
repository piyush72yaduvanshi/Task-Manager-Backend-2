import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controllers.js";
import isLoggedIn from "../middlewares/auth.middlewares.js";
import { validateProjectIdAndRole } from "../middlewares/validateProject.middleware.js";

const router = Router();

router.post(
  "/create-task/:projectId",
  isLoggedIn,
  validateProjectIdAndRole,
  createTask,
);

router.post("/get-tasks/:projectId", isLoggedIn, getTasks);
router.post("/get-task-by-id/:taskId", isLoggedIn, getTaskById);
router.put("/update-task/:taskId", isLoggedIn, updateTask);
router.delete("/delete-task/:taskId", isLoggedIn, deleteTask);
router.put("/update-task-status/:taskId", isLoggedIn, updateTaskStatus);

export default router;

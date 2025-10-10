import { Router } from "express";
import isLoggedIn from "../middlewares/auth.middlewares.js";
import {
  createProjects,
  deleteProject,
  getProjects,
  getProjectsById,
  updateProject,
} from "../controllers/project.controllers.js";

const router = Router();

router.post("/get-projects", isLoggedIn, getProjects);
router.post("/get-project-by-id/:projectId", isLoggedIn, getProjectsById);
router.post("/create-project", isLoggedIn, createProjects);
router.put("/update-project/:projectId", isLoggedIn, updateProject);
router.delete("/delete-project/:projectId", isLoggedIn, deleteProject);

export default router;

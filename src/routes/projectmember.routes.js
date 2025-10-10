import { Router } from "express";

import {
  addMemberToProject,
  deleteMember,
  getProjectMembers,
  updateMemberRole,
  updateProjectMember,
} from "../controllers/projectmember.controllers.js";

import isLoggedIn from "../middlewares/auth.middlewares.js";
import { validateProjectIdAndRole } from "../middlewares/validateProject.middleware.js";

const router = Router();

router.post(
  "/add-member/:projectId",
  isLoggedIn,
  validateProjectIdAndRole,
  addMemberToProject,
);

router.post("/get-members/:projectId", isLoggedIn, getProjectMembers);

router.put(
  "/update-member/:projectId",
  isLoggedIn,
  validateProjectIdAndRole,
  updateProjectMember,
);

router.put(
  "/update-member-role/:projectId",
  isLoggedIn,
  validateProjectIdAndRole,
  updateMemberRole,
);

router.delete(
  "/delete-member/:projectId",
  isLoggedIn,
  validateProjectIdAndRole,
  deleteMember,
);

export default router;

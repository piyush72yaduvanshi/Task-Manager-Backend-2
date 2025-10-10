import { Router } from "express";
import isLoggedIn from "../middlewares/auth.middlewares.js";

import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";
import { validateProjectMember } from "../middlewares/validateProject.middleware.js";
import { UserRoleEnum } from "../utils/constants.js";

const router = Router();

router.post(
  "/get-notes/:projectId",
  isLoggedIn,
  validateProjectMember([
    UserRoleEnum.ADMIN,
    UserRoleEnum.PROJECT_ADMIN,
    UserRoleEnum.MEMBER,
  ]),
  getNotes,
);

router.post(
  "/create/:projectId",
  isLoggedIn,
    validateProjectMember([
    UserRoleEnum.ADMIN,
    UserRoleEnum.PROJECT_ADMIN,
    UserRoleEnum.MEMBER,
  ]),
  createNote,
);

router.get("/get-note-by-id/:noteId", isLoggedIn, getNoteById);
router.put("/update/:noteId", isLoggedIn, updateNote);
router.delete("/delete/:noteId", isLoggedIn, deleteNote);

export default router;

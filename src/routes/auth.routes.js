import { Router } from "express";

import {
  getProfile,
  loginUser,
  registerUser,
  resendVerificationEmail,
  verifyEmail,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changeCurrentPassword,
  logoutUser,
} from "../controllers/auth.controllers.js";

import {
  userLoginValidator,
  userRegistrationValidator,
} from "../validators/validateUserData.js";

import { validate } from "../middlewares/validator.middlewares.js";
import isLoggedIn from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", userRegistrationValidator(), validate, registerUser);

router.post("/login", userLoginValidator(), validate, loginUser);

router.post("/verify/:token", verifyEmail);

router.post("/refresh-access-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/change-password", isLoggedIn, changeCurrentPassword);

router.get("/resend-email", isLoggedIn, resendVerificationEmail);
router.get("/profile", isLoggedIn, getProfile);
router.get("/logout", isLoggedIn, logoutUser);

export default router;

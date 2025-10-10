import { body } from "express-validator";
const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username should be at least 3 char")
      .isLength({ max: 13 })
      .withMessage("Username cannot exceed 13 char"),
    body("fullname").trim().notEmpty().withMessage("Full Name is required"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 char")
      .isLength({ max: 32 })
      .withMessage("Password cannot exceed 32 char"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 char")
      .isLength({ max: 32 })
      .withMessage("Password cannot exceed 32 char"),
  ];
};

export { userRegistrationValidator, userLoginValidator };

import jwt from "jsonwebtoken";
import { User } from "../models/auth.models.js";
import { ApiResponse } from "../utils/Api-response.js";
import { ApiError } from "../utils/api-error.js";
import { sendMail } from "../utils/emailSender.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const registerUser = async (req, res) => {
  const { email, username, password, fullname } = req.body;

  if (!email || !username || !password || !fullname) {
    throw new ApiError(400, "All fields are requred");
  }
  try {
    if (await User.findOne({ email })) {
      return res.status(401).json(new ApiError(401, "User already registered"));
    }

    const newUser = await User.create({
      email,
      password,
      fullname,
      username,
    });

    if (!newUser) {
      throw new ApiError(400, "user not register");
    }

    const { token, tokenExpiry } = newUser.generateEmailVerificationToken();

    newUser.emailVerificationExpiry = tokenExpiry;
    newUser.emailVerificationToken = token;

    await newUser.save();

    const options = {
      email: email,
      subject: "Email Varification",
      url: `${process.env.BASE_URL}/api/v1/users/verify/${token}`,
      instructions: "<h3>for email verification, please click here:</h3>",
      name: fullname,
      text: "Verify Now",
    };

    await sendMail(options);

    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "Uesr register successfully"));
  } catch (error) {
    console.log("Internel server error :-", error);
    throw new ApiError(500, "Internel server error", error);
  }
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!(email || username) || !password) {
    throw new ApiError(401, "All fields are required");
  }

  try {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      throw new ApiError(401, "Invalid Password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              username: user.username,
              email: user.email,
              fullname: user.fullname,
              isVerified: user.isEmailVerified,
              avatar: user.avatar,
              role: user.role,
            },
          },
          "user login successfully",
        ),
      );
  } catch (error) {
    console.log("Internel server error :-", error);
    throw new ApiError(500, "Internel server error", error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      throw new ApiError(401, "Invalid Token");
    }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      throw new ApiError(401, "Invalid Token");
    }

    if (user.emailVerificationExpiry < Date.now()) {
      new ApiError(400, "Email varicafication time expired");
    }

    user.emailVerificationExpiry = undefined;
    user.emailVerificationToken = undefined;
    user.isEmailVerified = true;

    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, {}, "email verification successfully"));
  } catch (error) {
    console.log("Internel server error :-", error);
    throw new ApiError(500, "Internel server error", error);
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    console.log(user);

    if (!user) {
      throw new ApiError(401, "Unauthrizaed user");
    }

    const { token, tokenExpiry } = user.generateEmailVerificationToken();

    user.emailVerificationExpiry = tokenExpiry;
    user.emailVerificationToken = token;

    await user.save();

    const options = {
      email: user.email,
      subject: "Email Varification",
      url: `${process.env.BASE_URL}/api/v1/users/verify/${token}`,
      instructions: "<h3>for email verification, please click here:</h3>",
      name: user.fullname,
      text: "Verify Now",
    };

    await sendMail(options);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          username: user.username,
          email: user.email,
          name: user.fullname,
        },
        "Verification email resend Successfully",
      ),
    );
  } catch (error) {
    console.log("Err :-", error);

    throw new ApiError(500, "Internel Server Error", error);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(404, "refresh token invalid");
    }

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    if (!decodedRefreshToken) {
      throw new ApiError(401, "Refresh Token Expired");
    }

    const user = await User.findById(decodedRefreshToken._id);

    if (!user) {
      throw new ApiError(401, "Refresh Token Expired");
    }

    const accessToken = user.generateAccessToken();
    const newlyRefreshToken = user.generateRefreshToken();
    user.refreshToken = newlyRefreshToken;

    await user.save();

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newlyRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              username: user.username,
              email: user.email,
              fullname: user.fullname,
              isVerified: user.isEmailVerified,
              avatar: user.avatar,
              role: user.role,
              accessToken: accessToken,
              refreshToken: newlyRefreshToken,
            },
          },
          "Update Access Token successfully",
        ),
      );
  } catch (error) {
    console.log("Internel server error :-", error);
    throw new ApiError(500, "Internel server error", error);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "Access token is invalid");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { user: user }, "Get profile successfully"));
  } catch (error) {
    throw new ApiError(500, "Internel server error", error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(401, "Email filed is required");
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(400, "Email not register first Register now");
    }

    const { token, tokenExpiry } = user.generateEmailVerificationToken();
    user.forgotPasswordToken = token;
    user.forgotPasswordExpiry = tokenExpiry;

    await user.save();

    const options = {
      email: user.email,
      subject: "Reset Password",
      url: `${process.env.BASE_URL}/api/v1/users/reset-password/${token}`,
      instructions: "<h3>for reset password, please click here:</h3>",
      name: user.fullname,
      text: "Reset Now",
    };

    await sendMail(options);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          username: user.username,
          email: user.email,
          name: user.fullname,
        },
        "Verification email resend Successfully",
      ),
    );
  } catch (error) {
    throw new ApiError(500, "Internel Server Error", error);
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;
  if (!password || !token) {
    throw new ApiError(401, "Password is required");
  }

  try {
    const user = await User.findOne({ forgotPasswordToken: token });

    if (!user) {
      throw new ApiError(400, "Forgot password token invalid");
    }

    if (user.forgotPasswordExpiry < Date.now()) {
      throw new ApiError(400, "Token Expired");
    }

    user.password = password;

    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          username: user.username,
          email: user.email,
          name: user.fullname,
          newPassword: password,
        },
        "Password Reset Successfully",
      ),
    );
  } catch (error) {
    throw new ApiError(500, "Internel Server Error", error);
  }
};

const changeCurrentPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(401, "new and old password are required");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "new and old password are same");
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(400, "user invalid");
    }

    const isMatch = await user.isPasswordCorrect(oldPassword);

    if (!isMatch) {
      throw new ApiError(400, "Invalid Old Password");
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json(
      new ApiResponse(200, {
        username: user.username,
        email: user.email,
        name: user.fullname,
        newPassword: newPassword,
      }),
    );
  } catch (error) {
    throw new ApiError(500, "Internel Server Error", error);
  }
};

const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("accessToken", "")
      .cookie("refreshToken", "")
      .json(
        new ApiResponse(
          200,
          { email: req.user.email },
          "User Logout Successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "Internel Server Error", error);
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  verifyEmail,
  resendVerificationEmail,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changeCurrentPassword,
  logoutUser,
};

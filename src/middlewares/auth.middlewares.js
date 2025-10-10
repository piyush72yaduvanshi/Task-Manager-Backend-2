import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new ApiError(404, "User not loggedin");
    }

    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    if (!decodedAccessToken) {
      throw new ApiError(404, "User not loggedin");
    }

    req.user = decodedAccessToken;
    next();
  } catch (error) {
    console.log("Inernel error in middleware :- ", error);
    throw new ApiError(500, "Internel server error", error.message);
  }
};

export default isLoggedIn;

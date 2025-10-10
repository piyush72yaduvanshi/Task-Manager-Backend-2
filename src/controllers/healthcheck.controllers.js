import { ApiResponse } from "../utils/Api-response.js";

const healthcheck = (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { message: "Server is running" }));
};

export { healthcheck };

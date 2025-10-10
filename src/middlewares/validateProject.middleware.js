import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js";
import { UserRoleEnum } from "../utils/constants.js";

const validateProjectIdAndRole = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(403, "Project Id invalid");
    }

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id,
    });

    const member = await ProjectMember.findOne({
      user: req.user._id,
      project: projectId,
      $or: [{ role: UserRoleEnum.PROJECT_ADMIN }, { role: UserRoleEnum.ADMIN }],
    });

    if (project) {
      req.project = project;
    } else if (member) {
      req.member = member;
    } else {
      throw new ApiError(401, "You cannot add member to project");
    }

    next();
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Error validating project id and role",
    );
  }
};

const validateProjectMember = (role = []) => 
  async (req, res, next) => {
    try {
      const { projectId } = req.params;

      if (!projectId) {
        throw new ApiError(403, "Project Id invalid");
      }

      const member = await ProjectMember.findOne({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(projectId),
        role: { $in: role },
      });

      if (!member) {
        throw new ApiError(401, "You cannot perform this action");
      }

      req.member = member;

      next();
    } catch (error) {
      throw new ApiError(
        500,
        error?.message || "Error validating project id and role",
      );
    }
  };


export { validateProjectIdAndRole, validateProjectMember };

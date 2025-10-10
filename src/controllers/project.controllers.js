import { Project } from "../models/project.models.js";
import { ApiResponse } from "../utils/Api-response.js";
import { ApiError } from "../utils/api-error.js";

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    if (!projects) {
      throw new ApiError(404, "Project not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, projects, "Projects get successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Error fetching projects");
  }
};

const getProjectsById = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(403, "Invalid Project id");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project id not found in the database");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, project, "Project get successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Error fetching projects");
  }
};

const createProjects = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      throw new ApiError(401, "All fileds are required");
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
    });

    if (!project) {
      throw new ApiError(401, "Error Project Creating");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, project, "Project Creating Successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Error Project Creating");
  }
};

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { name, description } = req.body;

    if (!projectId || !name || !description) {
      throw new ApiError(401, "All fileds are required");
    }

    const project = await Project.findOne({
      createdBy: req.user._id,
      _id: projectId,
    });

    if (!project) {
      throw new ApiError(403, "Uesr cannot delete this project");
    }

    project.name = name;
    project.description = description;

    await project.save();

    return res
      .status(201)
      .json(new ApiResponse(201, project, "Project Updating Successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Error Project updating");
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(401, "Project id required");
    }

    const project = await Project.findOne({
      createdBy: req.user._id,
      _id: projectId,
    });

    if (!project) {
      throw new ApiError(403, "Uesr cannot delete this project");
    }

    const projectDeleted = await Project.findByIdAndDelete(projectId);

    if (!projectDeleted) {
      throw new ApiError(404, "Project not found for Deleting");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, projectDeleted, "Project Deletion Successfully"),
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Error Project Deleting");
  }
};

export {
  getProjects,
  getProjectsById,
  createProjects,
  updateProject,
  deleteProject,
};

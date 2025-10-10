import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/Api-response.js";
import { Task } from "../models/task.models.js";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectmember.models.js";
import { UserRoleEnum } from "../utils/constants.js";
import { User } from "../models/auth.models.js";

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title || !description || !assignedTo) {
      throw new ApiError(401, "All fileds are required");
    }

    const projectId =
      new mongoose.Types.ObjectId(req.project._id) ||
      new mongoose.Types.ObjectId(req.member.project);

    console.log(projectId);

    const isAssignedTo = await User.findOne({ email: assignedTo });

    if (!isAssignedTo) {
      throw new ApiError(401, "Error invalid user");
    }

    const newTask = await Task.create({
      title,
      description,
      assignedTo: isAssignedTo._id,
      project: projectId,
      assignedBy: req.user._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newTask, "Task Creating Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for creating task",
    );
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(401, "Project id is required");
    }

    const member = await ProjectMember.findOne({
      project: projectId,
      user: req.user._id,
    });

    if (!member) {
      throw new ApiError(401, "You are not member of this project");
    }

    const tasks = await Task.find({ project: projectId }).populate(
      "assignedTo",
      "email username fullname",
    );

    if (!tasks) {
      throw new ApiError(404, "Tasks not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks Finding Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for fatching tasks",
    );
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      throw new ApiError(401, "Task id is required");
    }

    const task = await Task.findById(taskId).populate(
      "assignedTo",
      "email username fullname",
    );

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (task.assignedTo._id !== req.user._id) {
      throw new ApiError(401, "You are not member of this project");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task fatching Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for fatching task",
    );
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      throw new ApiError(401, "Task id is required");
    }

    const { title, description } = req.body;

    if (!title || !description) {
      throw new ApiError(401, "All fileds are required");
    }

    const task = await Task.findById(taskId).populate(
      "assignedTo",
      "email username fullname",
    );

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const project = await ProjectMember.findOne({
      project: task.project,
      user: req.user._id,
      $or: [{ role: UserRoleEnum.PROJECT_ADMIN }, { role: UserRoleEnum.ADMIN }],
    });

    if (!project) {
      throw new ApiError(401, "You are cannot update this task");
    }

    task.title = title;
    task.description = description;

    await task.save();

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task Updating Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for updating task",
    );
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      throw new ApiError(401, "Task id is required");
    }

    const task = await Task.findById(taskId).populate(
      "assignedTo",
      "email username fullname",
    );

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const project = await ProjectMember.findOne({
      project: task.project,
      user: req.user._id,
      $or: [{ role: UserRoleEnum.PROJECT_ADMIN }, { role: UserRoleEnum.ADMIN }],
    });

    if (!project) {
      throw new ApiError(401, "You are cannot delete this task");
    }

    const taskDeleted = await Task.findByIdAndDelete(taskId);

    if (!taskDeleted) {
      throw new ApiError(404, "Task not found for Deleting");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, taskDeleted, "Task Deletion Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for deleting task",
    );
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      throw new ApiError(401, "Task id is required");
    }

    const { status } = req.body;

    if (!status) {
      throw new ApiError(401, "Status is required");
    }

    const task = await Task.findById(taskId).populate(
      "assignedTo",
      "email username fullname",
    );

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const isMember = await ProjectMember.findOne({
      project: task.project,
      user: req.user._id,
    });

    if (!isMember) {
      throw new ApiError(401, "You are not member of this project");
    }

    task.status = status;

    await task.save();

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task Status Updating Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for updating task status",
    );
  }
};

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
};

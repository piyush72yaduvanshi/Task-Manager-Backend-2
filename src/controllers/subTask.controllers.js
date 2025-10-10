import mongoose from "mongoose";
import { Task } from "../models/task.models.js";
import { ApiError } from "../utils/api-error.js";
import { SubTask } from "../models/subTask.models.js";
import { ApiResponse } from "../utils/Api-response.js";

const createSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findOne({
      _id: new mongoose.Types.ObjectId(taskId),
      assignedTo: new mongoose.Types.ObjectId(req.uesr._id),
    });

    if (!task) {
      throw new ApiError(403, "You cannot create sub-task");
    }

    const subTask = await SubTask.create({
      title,
      task: taskId,
      createdBy: req.uesr._id,
    });

    if (!subTask) {
      throw new ApiError(401, "Sub-task creating error");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, subTask, "Sub-Task creating successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for creating subtask",
    );
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { subTaskId } = req.params;
    const title = req.body?.title;
    const isCompleted = req.body?.isCompleted;

    if (!title && !isCompleted) {
      throw new ApiError(403, "Minimum 1 value requried");
    }

    const task = await SubTask.findOne({
      _id: new mongoose.Types.ObjectId(subTaskId),
      createdBy: new mongoose.Types.ObjectId(req.uesr._id),
    });

    if (!task) {
      throw new ApiError(403, "You cannot update sub-task");
    }

    if (title) task.title = title;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;

    await task.save();

    return res
      .status(200)
      .json(new ApiResponse(200, subTask, "Sub-Task updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for updating sub-task",
    );
  }
};

const deleteSubTask = async (req, res) => {
  try {
    const { subTaskId } = req.params;

    const subTask = await SubTask.findOne({
      _id: new mongoose.Types.ObjectId(subTaskId),
      createdBy: new mongoose.Types.ObjectId(req.uesr._id),
    });

    if (!subTask) {
      throw new ApiError(403, "You cannot deleted sub-task");
    }

    const deleteSubTask = await SubTask.findByIdAndDelete(subTask._id);

    if (!deleteSubTask) {
      throw new ApiError(401, "Error for Deletion");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, subTask, "Sub-Task deleted successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for deleting sub-task",
    );
  }
};

const getSubTasks = async (req, res) => {
  try {
    const { taskId } = req.params;

    const subTasks = await SubTask.find({ _id: taskId });

    if (!subTasks) {
      throw new ApiError(404, "Sub-tasks not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, subTasks, "Fatching sub-task successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for fatching sub-tasks",
    );
  }
};

const getSubTaskById = async (req, res) => {
  try {
    const { subTaskId } = req.params;

    const subTask = await SubTask.findById(subTaskId);

    if (!subTask) {
      throw new ApiError(404, "Sub-task not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, subTask, "Fatching sub-task successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for fatching sub-task",
    );
  }
};

export {
  createSubTask,
  updateSubTask,
  deleteSubTask,
  getSubTaskById,
  getSubTasks,
};

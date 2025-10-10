import mongoose from "mongoose";
import { Note } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/Api-response.js";

const getNotes = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const notes = await Note.find({
      project: new mongoose.Types.ObjectId(projectId),
    }).populate("createdBy", "username fullname email");

    if (!notes) {
      throw new ApiError(404, "Notes not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, notes, "Fatching notes successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for get notes",
    );
  }
};

const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId).populate(
      "createdBy",
      "username fullname email",
    );

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, note, "Fatching note successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for fatching note",
    );
  }
};
const createNote = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { contant } = req.body;

    if (!contant) {
      throw new ApiError(401, "Contant is required");
    }

    const project = await Project.findById(projectId);

    const note = await Note.create({
      project: new mongoose.Types.ObjectId(projectId),
      createdBy: new mongoose.Types.ObjectId(req.user._id),
      contant,
    });

    if (!note) {
      throw new ApiError(401, "Creating note failed");
    }

    const populateNote = await Note.findById(note._id).populate(
      "createdBy",
      "username fullname email",
    );

    return res
      .status(201)
      .json(new ApiResponse(201, populateNote, "Creating note successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for creating note",
    );
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const { contant } = req.body;

    if (!contant) {
      throw new ApiError(401, "Contant is required");
    }

    const note = await Note.findByIdAndUpdate(
      noteId,
      { contant },
      { new: true },
    ).populate("createdBy", "username fullname email");

    if (!note) {
      throw new ApiError(401, "Updating note failed");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, note, "Updating note successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for update note",
    );
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    if (!noteId) {
      throw new ApiError(401, "Note id is required");
    }

    const note = await Note.findByIdAndDelete(noteId);
    if (!note) {
      throw new ApiError(404, "Note not found for deleting");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, note, "Deleting note successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internel server error for delete note",
    );
  }
};

export { createNote, updateNote, deleteNote, getNoteById, getNotes };

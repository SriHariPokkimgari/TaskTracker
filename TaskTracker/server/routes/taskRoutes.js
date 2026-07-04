import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status, priority, dueDate, tag } = req.body;

    // Server-side validation
    const errors = [];
    if (!title || !title.trim()) errors.push("Title is required");
    if (!description || !description.trim())
      errors.push("Description is required");
    if (title && title.length > 100)
      errors.push("Title cannot exceed 100 characters");
    if (description && description.length > 500)
      errors.push("Description cannot exceed 500 characters");

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const task = new Task({
      title: title.trim(),
      description: description.trim(),
      priority: priority,
      dueDate: dueDate,
      status: status,
      tag: tag,
      userId: userId,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, status, priority, dueDate, tag } = req.body;

    // Server-side validation
    const errors = [];
    if (title !== undefined && !title.trim())
      errors.push("Title cannot be empty");
    if (description !== undefined && !description.trim())
      errors.push("Description cannot be empty");
    if (title && title.length > 100)
      errors.push("Title cannot exceed 100 characters");
    if (description && description.length > 500)
      errors.push("Description cannot exceed 500 characters");
    if (status && !["pending", "in-progress", "completed"].includes(status)) {
      errors.push("Status must be pending, in-progress, or completed");
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const taskExist = await Task.find({ userId, _id: req.params.id });
    if (taskExist.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskExist[0];

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (status) updateData.status = status;
    if (dueDate) updateData.dueDate = dueDate;
    if (priority) updateData.priority = priority;
    if (tag) updateData.tag = tag;

    const updatedTask = await Task.findByIdAndUpdate(task._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    console.log(err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;

    const taskExist = await Task.find({ userId, _id: req.params.id });
    if (taskExist.length === 0) {
      return res.status(404).json({ message: "task not found." });
    }

    const task = taskExist[0];
    const deletedTask = await Task.findByIdAndDelete(task._id);

    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

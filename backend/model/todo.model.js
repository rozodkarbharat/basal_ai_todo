const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, default: "No description" },
    status: { type: String, required: true, enum: ["To Do", "In Progress", "Completed"] },
    priority: { type: String, required: true, enum: ["Low", "Medium", "High"] },
    dueDate: { type: Date, required: true},
    userId: { type: String, required: true},
    createdAt:{ type: Number, required: true, default: Date.now()},
    updatedAt:{ type: Number, default: null},
});

const todoModel = mongoose.model("todo", todoSchema);

module.exports = todoModel;

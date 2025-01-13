const express = require('express');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../Controller/todo.controller');
const Authentication = require('../middleware/Authentication');

const todoRoute = express.Router()

todoRoute.post("/create-todo",Authentication, createTodo);
todoRoute.get("/", Authentication, getTodos);
todoRoute.post("/update/:id", Authentication, updateTodo);
todoRoute.get("/delete/:id", Authentication, deleteTodo);




module.exports = todoRoute
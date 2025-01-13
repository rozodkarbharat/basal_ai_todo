const todoModel = require("../model/todo.model");
const jwt = require("jsonwebtoken");



async function createTodo(req, res) {
    try {
      const { title, description, status, priority, dueDate } = req.body;

      const token = req.cookies.token

      if (!token) {
          return res.status(401).json({ message: "Access denied, no token provided", error: true });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded,'decoded')
        let userId = decoded.userid;

        console.log(userId,'userid')
      // Input validation
      if (!title || !status || !priority || !dueDate) {
        return res.status(400).send({ message: "All required fields must be filled", error: true });
      }
  
      const todo = new todoModel({
        title,
        description,
        status,
        priority,
        dueDate,
        userId,
        updatedAt:null,
      });
  
      await todo.save();
      res.status(201).send({ message: "Todo created successfully", todo, error: false });
    } catch (err) {
      console.log(err,'error creating')
      res.status(500).send({ message: "Server Error", error: true });
    }
  }
  
  async function getTodos(req, res) {
    try {
      const todos = await todoModel.find({ userId: req.userid });
      res.status(200).send({ todos, error: false });
    } catch (err) {
      res.status(500).send({ message: "Server Error", error: true });
    }
  }
  
  async function updateTodo(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status, priority, dueDate } = req.body;
  
      const updatedTodo = await todoModel.findOneAndUpdate(
        { _id: id, userId: req.userId },
        {
          title,
          description,
          status,
          priority,
          dueDate,
          updatedAt: Date.now(),
        },
        { new: true }
      );
  
      if (!updatedTodo) {
        return res.status(404).send({ message: "Todo not found", error: true });
      }
  
      res.status(200).send({ message: "Todo updated successfully", updatedTodo, error: false });
    } catch (err) {
      res.status(500).send({ message: "Server Error", error: true });
    }
  }
  
  async function deleteTodo(req, res) {
    try {
      const { id } = req.params;
      if(!id){
        return res.status(400).send({ message: "Todo id is required", error: true });
      }
      const deletedTodo = await todoModel.findOneAndDelete({ _id: id.toString(), userId: req.userid });
  
      if (!deletedTodo) {
        return res.status(404).send({ message: "Todo not found", error: true });
      }
  
      res.status(200).send({ message: "Todo deleted successfully", id, error: false });
    } catch (err) {
      res.status(500).send({ message: "Server Error", error: true });
    }
  }

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };

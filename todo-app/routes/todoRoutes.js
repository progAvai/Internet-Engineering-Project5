const express = require("express");
const router = express.Router();
const controller = require("../controllers/todoController");

router.get("/", controller.getTodos);
router.post("/add", controller.addTodo);
router.get("/delete/:id", controller.deleteTodo);
router.get("/edit/:id", controller.editTodoForm);
router.post("/edit/:id", controller.updateTodo);

module.exports = router;
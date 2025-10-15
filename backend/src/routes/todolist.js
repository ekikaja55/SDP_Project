const express = require("express");
const {
  insertTodolist,
  updateTodolist,
  deleteTodolist,
  updateStatusTodolist,
  getTodolist,
} = require("../controllers/todolist");
const router = express.Router();
router.post("/", insertTodolist);
router.put("/:id", updateTodolist);
router.delete("/:id", deleteTodolist);
router.put("/status/:id", updateStatusTodolist);
router.get("/", getTodolist);

module.exports = router;

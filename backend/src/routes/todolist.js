/**
 * @fileoverview
 * Router untuk fitur todolist (CRUD dan update status).
 * Mengatur endpoint untuk menambah, mengubah, menghapus, dan memperbarui status todo.
 *
 * @module routes/todolist
 */

const express = require("express");
const {
  insertTodolist,
  updateTodolist,
  deleteTodolist,
  updateStatusTodolist,
  getTodolist,
} = require("../controllers/todolist");
const router = express.Router();

/**
 * POST /api/v1/todolist
 * Menambahkan todo baru ke dalam database.
 */
router.post("/", insertTodolist);

/**
 * PUT /api/v1/todolist/:id
 * Memperbarui isi todo berdasarkan ID.
 */
router.put("/:id", updateTodolist);

/**
 * DELETE /api/v1/todolist/:id
 * Menghapus todo berdasarkan ID.
 */
router.delete("/:id", deleteTodolist);

/**
 * PUT /api/v1/todolist/status/:id
 * Memperbarui status todo .
 */
router.put("/status/:id", updateStatusTodolist);

/**
 * GET /api/v1/todolist
 * Mengambil seluruh todo dari database.
 */
router.get("/", getTodolist);

module.exports = router;

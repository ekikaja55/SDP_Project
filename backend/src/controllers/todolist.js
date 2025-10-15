const prisma = require("../../prisma/prisma");
const insertTodolist = async (req, res) => {
  try {
    const { todolist_desc, todolist_status } = req.body;
    await prisma.todolist.create({ data: { todolist_desc, todolist_status } });
    return res
      .status(201)
      .json({ message: "Sukses insert todolist", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const updateStatusTodolist = async (req, res) => {
  try {
    const { id } = req.params;
    const todolist = await prisma.todolist.findUnique({ where: { id } });
    if (todolist.todolist_status === "Belum Dikerjakan")
      await prisma.todolist.update({
        where: { id },
        data: { todolist_status: "Sedang Dikerjakan" },
      });
    else if (todolist.todolist_status === "Sedang Dikerjakan")
      await prisma.todolist.update({
        where: { id },
        data: { todolist_status: "Selesai", deletedAt: new Date() },
      });
    return res
      .status(200)
      .json({ message: "Sukses update status", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const updateTodolist = async (req, res) => {
  try {
    const { id } = req.params;
    const { todolist_desc } = req.body;
    await prisma.todolist.update({
      where: { id },
      data: { todolist_desc },
    });
    return res
      .status(200)
      .json({ message: "Sukses update todolist", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const deleteTodolist = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todolist.delete({ where: { id } });
    return res
      .status(200)
      .json({ message: "Sukses delete todolist", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const getTodolist = async (req, res) => {
  try {
    const { status } = req.query;
    const kondisi = { ...(status ? { todolist_status: status } : {}) };
    const tasks = await prisma.todolist.findMany({
      where: kondisi,
      orderBy: { createdAt: "desc" },
    });
    if (tasks.length <= 0)
      return res.status(404).json({ message: "Tidak ada data", result: null });
    return res
      .status(200)
      .json({ message: "Sukses ambil todolist", result: tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
module.exports = {
  insertTodolist,
  updateStatusTodolist,
  updateTodolist,
  deleteTodolist,
  getTodolist,
};

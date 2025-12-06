/**
 * @fileoverview Controller untuk manajemen daftar tugas (todolist).
 * Menangani operasi CRUD dan perubahan status pekerjaan.
 * @module controllers/todolist.js
 */

const prisma = require("../../prisma/prisma");
const { createLog } = require("../utils/logHelper");
/**
 * @typedef {Object} TodolistDTO
 * @property {string} todolist_desc - Deskripsi tugas.
 * @property {"Belum Dikerjakan"|"Sedang Dikerjakan"|"Selesai"} todolist_status - Status tugas.
 * @property {Date|null} [deletedAt] - Waktu penghapusan (jika selesai/dihapus).
 */

/**
 * Menambahkan tugas baru ke dalam daftar todolist.
 * @async
 * @function insertTodolist
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>}
 *
 * @example <caption>Contoh Request</caption>
 * // POST /api/v1/todolist
 * // Body:
 * // { "todolist_desc": "Membuat laporan mingguan" }
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses insert todolist",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "result": null
 * }
 */
const insertTodolist = async (req, res) => {
  try {
    console.log("masuk insert todo");

    const { todolist_desc } = req.body;
    const data = await prisma.todolist.create({
      data: { todolist_desc, todolist_status: "Belum Dikerjakan" },
    });

    console.log("masuk insert todo 2");
    await createLog({
      actor: req.userLogin.user_nama,
      type: "TODOLIST",
      action: "INSERT",
      title: "Berhasil menambahkan Todolist baru",
      desc: {
        before: null,
        after: { ...data },
      },
    });

    console.log("masuk insert todo 3");

    return res
      .status(201)
      .json({ message: "Berhasil insert Todolist", result: null });
  } catch (error) {
    console.error(error.message);

    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

/**
 * Mengubah status tugas secara bertahap:
 * - Dari "Belum Dikerjakan" → "Sedang Dikerjakan"
 * - Dari "Sedang Dikerjakan" → "Selesai" (dan dihapus soft-delete)
 * @async
 * @function updateStatusTodolist
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>}
 *
 * @example <caption>Contoh Request</caption>
 * // PATCH /api/v1/todolist/123/status
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses update status",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (404)</caption>
 * {
 *   "message": "Todolist tidak ditemukan",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "result": null
 * }
 */
const updateStatusTodolist = async (req, res) => {
  try {
    const { id } = req.params;
    const todolist = await prisma.todolist.findUnique({ where: { id } });
    let newTodoList;
    if (!todolist)
      return res
        .status(404)
        .json({ message: "Todolist tidak ditemukan", result: null });

    if (todolist.todolist_status === "Belum Dikerjakan")
      newTodoList = await prisma.todolist.update({
        where: { id },
        data: { todolist_status: "Sedang Dikerjakan" },
      });
    else if (todolist.todolist_status === "Sedang Dikerjakan")
      newTodoList = await prisma.todolist.update({
        where: { id },
        data: { todolist_status: "Selesai", deletedAt: new Date() },
      });

    await createLog({
      actor: req.userLogin.user_nama,
      type: "TODOLIST",
      action: "UPDATE",
      title: `Berhasil update status Todolist `,
      desc: {
        before: { ...todolist },
        after: { ...newTodoList },
      },
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

/**
 * Memperbarui deskripsi dari todolist berdasarkan ID.
 * @async
 * @function updateTodolist
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>}
 *
 * @example <caption>Contoh Request</caption>
 * // PUT /api/v1/todolist/123
 * // Body:
 * // { "todolist_desc": "Menyelesaikan laporan bulanan" }
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses update todolist",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (404)</caption>
 * {
 *   "message": "Todolist tidak ditemukan",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "result": null
 * }
 */
const updateTodolist = async (req, res) => {
  try {
    const { id } = req.params;
    const { todolist_desc } = req.body;
    const existing = await prisma.todolist.findUnique({ where: { id } });
    let newTodoList;
    if (!existing)
      return res
        .status(404)
        .json({ message: "Todolist tidak ditemukan", result: null });

    newTodoList = await prisma.todolist.update({
      where: { id },
      data: { todolist_desc },
    });

    await createLog({
      actor: req.userLogin.user_nama,
      type: "TODOLIST",
      action: "UPDATE",
      title: `Berhasil update Todolist  `,
      desc: {
        before: { ...existing },
        after: { ...newTodoList },
      },
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

/**
 * Menghapus todolist secara permanen dari database.
 * @async
 * @function deleteTodolist
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>}
 *
 * @example <caption>Contoh Request</caption>
 * // DELETE /api/v1/todolist/123
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses delete todolist",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (404)</caption>
 * {
 *   "message": "Todolist tidak ditemukan",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "result": null
 * }
 */
const deleteTodolist = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.todolist.findUnique({ where: { id } });
    if (!existing)
      return res
        .status(404)
        .json({ message: "Todolist tidak ditemukan", result: null });

    await prisma.todolist.delete({ where: { id } });

    await createLog({
      actor: req.userLogin.user_nama,
      type: "TODOLIST",
      action: "DELETE",
      title: `Berhasil delete Todolist`,
      desc: {
        before:null,
        after: { ...existing},
      },
    });
    return res
      .status(200)
      .json({ message: "Sukses delete todolist", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

/**
 * Mengambil daftar todolist berdasarkan status.
 * Jika `status` tidak diberikan, maka semua todolist akan ditampilkan.
 * @async
 * @function getTodolist
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>}
 *
 * @example <caption>Contoh Request</caption>
 * // GET /api/v1/todolist?status=Belum%20Dikerjakan
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses ambil todolist",
 *   "result": [
 *     {
 *       "id": "1",
 *       "todolist_desc": "Membuat laporan",
 *       "todolist_status": "Belum Dikerjakan"
 *     }
 *   ]
 * }
 *
 * @example <caption>Response Error (404)</caption>
 * {
 *   "message": "Tidak ada data",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "result": null
 * }
 */
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

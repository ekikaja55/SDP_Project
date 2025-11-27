/**
 * @file index.js
 * @description Entry point utama server Express untuk aplikasi ini.
 * Mengatur middleware global, konfigurasi CORS, parser, routing, serta menjalankan server.
 *
 * @requires express
 * @requires cookie-parser
 * @requires cors
 * @requires path
 * @requires dotenv
 * @requires ./src/routes
 *
 * @module index.js
 *
 * @example
 * // Menjalankan server secara lokal:
 * npx nodemon index.js
 *
 * // Output di terminal:
 * Example app listening on port 3000!
 *
 * @example
 * // Request ke endpoint /api/v1/todolist
 * GET http://localhost:3000/api/v1/todolist
 *
 * // Response sukses:
 * {
 *   "message": "Sukses ambil todolist",
 *   "result": [
 *     {
 *       "id": "string",
 *       "todolist_desc": "Belajar Express",
 *       "todolist_status": "Belum Dikerjakan"
 *     }
 *   ]
 * }
 *
 * @example
 * // Response error jika server mengalami masalah:
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "result": null
 * }
 *
 */

const express = require("express");
const {
  authRouter,
  productRouter,
  todolistRouter,
  transactionRouter,
  reviewRouter,
  notifikasiRouter,
  userRouter,
} = require("./src/routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Middleware global
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
app.use(cookieParser());

// Konfigurasi CORS
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  console.log("CWD:", process.cwd());
  console.log("Dirname:", __dirname);
});

// Folder publik untuk file upload
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routing utama
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/todolist", todolistRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/notifikasi", notifikasiRouter);
app.use("/api/v1/user", userRouter);
// Jalankan server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

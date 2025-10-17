/**
 * @fileoverview
 * Router untuk autentikasi pengguna (register, login, refresh token, logout).
 * Mengarahkan setiap endpoint ke controller yang sesuai.
 *
 * @module routes/auth
 */

const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/auth");
const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Mendaftarkan pengguna baru ke dalam sistem.
 */
router.post("/register", register);

/**
 * POST /api/v1/auth/login
 * Melakukan proses login dan menghasilkan access token.
 */
router.post("/login", login);

/**
 * GET /api/v1/auth/refreshtoken
 * Mengembalikan access token baru berdasarkan refresh token.
 */
router.get("/refreshtoken", refreshToken);

/**
 * GET /api/v1/auth/logout
 * Menghapus sesi pengguna dan menghapus refresh token.
 */
router.get("/logout", logout);

module.exports = router;

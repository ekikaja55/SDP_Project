/**
 * @fileoverview Controller untuk autentikasi pengguna (register, login, refresh token, logout)
 * @module controllers/auth.js
 */

/** @type {import('bcryptjs')} */
const bcryptjs = require("bcryptjs");

/** @type {import('../utils/validation').userSchema} */
const { userSchema } = require("../utils/validation");

/** @type {import('jsonwebtoken')} */
const jwt = require("jsonwebtoken");

/** @type {import('@prisma/client').PrismaClient} */
const prisma = require("../../prisma/prisma");

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * Register user baru ke sistem.
 *
 * @route POST /api/v1/register
 * @param {Request} req - Express Request Object (berisi `user_nama`, `user_email`, `user_password`, dan `user_confirm_password`)
 * @param {Response} res - Express Response Object
 * @returns {Promise<void>} JSON Response
 *
 * @throws {ValidationError} Jika validasi input gagal
 * @throws {Error} Jika terjadi kesalahan pada server
 *
 * @example <caption>Request Body</caption>
 * {
 *   "user_nama": "Fabaon",
 *   "user_email": "fabaon55@gmail.com",
 *   "user_password": "123456",
 *   "user_confirm_password": "123456"
 * }
 *
 * @example <caption>Response Success (201)</caption>
 * {
 *   "message": "Sukses Register, silahkan login",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (400)</caption>
 * {
 *   "message": "Email sudah terdaftar",
 *   "result": null
 * }
 */
const register = async (req, res) => {
  try {
    const { user_nama, user_email, user_password, user_confirm_password } =
      await userSchema.validateAsync(req.body, { abortEarly: false });

    const adaUser = await prisma.user.findFirst({
      where: { user_email: user_email },
    });

    if (adaUser)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcryptjs.hash(user_password, 10);
    await prisma.user.create({
      data: {
        user_email,
        user_nama,
        user_password: hashedPassword,
        user_role: "customer",
      },
    });

    return res
      .status(201)
      .json({ message: "Sukses Register, silahkan login", result: null });
  } catch (error) {
    console.log(error);

    if (error.isJoi) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message),
        result: null,
      });
    }
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

/**
 * Login user yang sudah terdaftar.
 *
 * @route POST /api/v1/login
 * @param {Request} req - Express Request Object (berisi `user_email` dan `user_password`)
 * @param {Response} res - Express Response Object
 * @returns {Promise<void>} JSON Response
 *
 * @example <caption>Request Body</caption>
 * {
 *   "user_email": "fabaon55@gmail.com",
 *   "user_password": "123456"
 * }
 *
 * @example <caption>Response Success (200)</caption>
 * {
 *   "message": "Sukses Login",
 *   "result": "<JWT Access Token>"
 * }
 *
 * @example <caption>Response Error (400)</caption>
 * {
 *   "message": "Email belum terdaftar",
 *   "result": null
 * }
 */
const login = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    const user = await prisma.user.findFirst({
      where: { user_email: user_email },
    });
    if (!user)
      return res.status(400).json({ message: "Email belum terdaftar" });

    const validPassword = await bcryptjs.compare(
      user_password,
      user.user_password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Password salah" });

    const userJwt = await prisma.user.findFirst({
      where: { user_email: user_email },
      select: {
        id: true,
        user_email: true,
        user_nama: true,
        user_role: true,
      },
    });

    const accessToken = jwt.sign(userJwt, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(userJwt, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { user_refresh_token: refreshToken },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Sukses Login", result: accessToken });
  } catch (error) {
    return res.status(401).json({ message: "Gagal Login" });
  }
};

/**
 * Memperbarui Access Token menggunakan Refresh Token.
 *
 * @route GET /api/v1/refresh-token
 * @param {Request} req - Express Request Object (berisi cookie `refreshToken`)
 * @param {Response} res - Express Response Object
 * @returns {Promise<void>} JSON Response
 *
 * @example <caption>Response Success (200)</caption>
 * {
 *   "message": "Refresh Token Sukses",
 *   "result": "<JWT Access Token>"
 * }
 *
 * @example <caption>Response Error (403)</caption>
 * {
 *   "message": "Invalid Refresh Token"
 * }
 */
const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Token tidak ditemukan" });
    }

    const user = await prisma.user.findFirst({
      where: { user_refresh_token: refreshToken },
      select: {
        id: true,
        user_email: true,
        user_nama: true,
        user_role: true,
      },
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Forbidden - Refresh token tidak valid" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          console.error("Refresh token invalid:", err);
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
        }

        const newAccessToken = jwt.sign(
          {
            id: user.id,
            user_email: user.user_email,
            user_nama: user.user_nama,
            user_role: user.user_role,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 hari
        });

        return res.status(200).json({
          message: "Access token berhasil diperbarui",
          result: newAccessToken,
        });
      }
    );
  } catch (error) {
    console.error("Error saat refresh token:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
/**
 * Logout user dari sistem.
 *
 * @route POST /api/v1/logout
 * @param {Request} req - Express Request Object (berisi cookie `refreshToken`)
 * @param {Response} res - Express Response Object
 * @returns {Promise<void>} JSON Response
 *
 * @example <caption>Response Success (200)</caption>
 * {
 *   "message": "Success Logout"
 * }
 */
const logout = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken && !cookies?.accessToken) {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      return res.status(200).json({ message: "Success Logout" });
    }

    const refreshToken = cookies.refreshToken;

    const user = await prisma.user.findFirst({
      where: { user_refresh_token: refreshToken },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { user_refresh_token: null },
      });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Success Logout" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { register, login, refreshToken, logout };

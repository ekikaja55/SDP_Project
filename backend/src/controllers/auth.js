const bcryptjs = require("bcryptjs");
const { userSchema } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/prisma");
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
    const user = await prisma.user.create({
      data: {
        user_email,
        user_nama,
        user_password: hashedPassword,
        user_role: "customer",
      },
    });
    return res
      .status(201)
      .json({ message: "Sukses Register, silahkan login", result: user });
  } catch (error) {
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
const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
      return res.status(401).json({ message: "Tidak Login" });
    const user = await prisma.user.findFirst({
      where: { user_refresh_token: cookies.refreshToken },
      select: {
        id: true,
        user_email: true,
        user_nama: true,
        user_role: true,
      },
    });
    if (!user) return res.status(403).json({ message: "User tidak ditemukan" });
    jwt.verify(
      cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err) => {
        if (err)
          return res.status(403).json({ message: "Invalid Refresh Token" });
        else {
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1d",
          });
          return res
            .status(200)
            .json({ message: "Refresh Token Sukses", result: accessToken });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      return res.status(200).json({ message: "success logout" });
    }
    console.log(cookies?.refreshToken);

    const refreshToken = cookies.refreshToken;
    const user = await prisma.user.findFirst({
      where: { user_refresh_token: refreshToken },
    });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          user_refresh_token: null,
        },
      });
    }
    res.clearCookie("refreshToken", { httpOnly: true });
    return res.status(200).json({ message: "Success Logout" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = { register, login, refreshToken, logout };

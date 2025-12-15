const prisma = require("../../prisma/prisma");

const getAllNotifikasi = async (req, res) => {
  try {
    const notifikasi = await prisma.notifikasi.findMany({
      where: { role: "admin" },
      select: {
        id: true,
        user_id: true,
        transaksi_id: true,
        notifikasi_nama: true,
        notifikasi_isi: true,
        notifikasi_isread: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res
      .status(200)
      .json({ message: "Sukses ambil notifikasi admin", result: notifikasi });
  } catch (error) {
    console.log("ERROR :", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

const getAllNotifikasiCustomer = async (req, res) => {
  const user = req.userLogin;
  try {
    const notifikasi = await prisma.notifikasi.findMany({
      where: {
        user_id: user.id,
        role: "customer",
      },
      select: {
        id: true,
        user_id: true,
        transaksi_id: true,
        notifikasi_nama: true,
        notifikasi_isi: true,
        notifikasi_isread: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      message: "Sukses ambil notifikasi Customer",
      result: notifikasi,
    });
  } catch (error) {
    console.log("ERROR :", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

const updateIsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notifikasi.update({
      where: { id },
      data: { notifikasi_isread: "true" },
    });
    return res
      .status(200)
      .json({ message: "Sukses update notifikasi", result: null });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

const updateAllIsRead = async (req, res) => {
  try {
    await prisma.notifikasi.updateMany({
      data: { notifikasi_isread: "true" },
    });
    return res.status(200).json({
      message: "Semua notifikasi ditandai sudah dibaca",
      result: null,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

module.exports = {
  getAllNotifikasi,
  updateIsRead,
  updateAllIsRead,
  getAllNotifikasiCustomer,
};

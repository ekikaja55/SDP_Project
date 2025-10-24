const prisma = require("../../prisma/prisma");

const getAllNotifikasi = async (req, res) => {
  try {
    const notifikasi = await prisma.notifikasi.findMany({
      select: {
        id: true,
        notifikasi_nama: true,
        notifikasi_isi: true,
        notifikasi_isread: true,
        createdAt: true,
      },
    });
    return res
      .status(200)
      .json({ message: "Sukses ambil notifikasi", result: notifikasi });
  } catch (error) {
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
      data: { notifikasi_isread: "True" },
    });
    return res
      .status(200)
      .json({ message: "Sukses update notifikasi", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

module.exports = { getAllNotifikasi, updateIsRead };

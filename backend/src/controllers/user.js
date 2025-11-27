const prisma = require("../../prisma/prisma");

const getAllUser = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const sort = req.query.sort?.toLowerCase() || "terbaru";
    const orderBy = sort === "terlama" ? "asc" : "desc";
    const users = await prisma.user.findMany({
      where: {
        user_role: "customer",
        ...(search && {
          user_nama: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      select: {
        id: true,
        user_nama: true,
        user_email: true,
        user_role: true,
        createdAt: true,
        user_transaksi: true,
      },
      orderBy: {
        createdAt: orderBy,
      },
    });
    if (users.length === 0) {
      return res.status(404).json({ message: "Tidak ada data", result: [] });
    }
    const hasil = users.map((u) => ({
      id: u.id,
      user_nama: u.user_nama,
      user_email: u.user_email,
      user_role: u.user_role,
      createdAt: u.createdAt,
      total_transaksi: u.user_transaksi ? u.user_transaksi.length : 0,
    }));
    return res.status(200).json({
      message: "Success",
      result: hasil,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      result: null,
    });
  }
};

module.exports = { getAllUser };

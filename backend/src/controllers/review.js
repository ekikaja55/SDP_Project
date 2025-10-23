const prisma = require("../../prisma/prisma");

const getProdukYangPernahDibeli = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userLogin.id },
      select: { user_transaksi: true },
    });
    if (!user || !user.user_transaksi.length)
      return res
        .status(404)
        .json({ message: "Belum ada transaksi", result: null });
    const transaksiSelesai = user.user_transaksi.filter(
      (t) => t.transaksi_status === "Pesanan Selesai"
    );
    const semuaDetail = transaksiSelesai.flatMap(
      (t) => t.transaksi_detail || []
    );
    const namaUnik = new Set();
    for (const item of semuaDetail) {
      if (!namaUnik.has(item.detail_nama)) namaUnik.add(item.detail_nama);
    }
    if (namaUnik.size === 0)
      return res
        .status(404)
        .json({ message: "Belum ada transaksi", result: null });
    res.status(200).json({
      message: "Sukses ambil nama produk yang pernah dibeli",
      result: Array.from(namaUnik),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const tambahReview = async (req, res) => {
  try {
    const { produk_nama, review_rating, review_isi } = req.body;
    const user = req.userLogin;
    const produk = await prisma.produk.findFirst({
      where: { produk_nama },
      select: {
        produk_review: true,
        produk_avg_rating: true,
      },
    });
    if (!produk)
      return res
        .status(404)
        .json({ message: "Produk tidak ditemukan", result: null });
    const reviewBaru = {
      review_nama: user.user_nama,
      review_rating: Number(review_rating),
      review_isi,
    };
    const semuaReview = [...(produk.produk_review || []), reviewBaru];
    const totalRating = semuaReview.reduce(
      (sum, review) => sum + review.review_rating,
      0
    );
    const avgRating = totalRating / semuaReview.length;
    await prisma.produk.update({
      where: { produk_nama },
      data: {
        produk_review: semuaReview,
        produk_avg_rating: avgRating,
      },
    });
    res.status(200).json({ message: "Sukses tambah review", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const laporanReview = async (req, res) => {
  try {
    const produk = await prisma.produk.findMany({
      select: {
        produk_nama: true,
        produk_gambar: true,
        produk_avg_rating: true,
        produk_review: {
          select: {
            review_rating: true,
            review_isi: true,
            review_nama: true,
          },
        },
      },
    });
    if (!produk)
      return res.status(404).json({ message: "Tidak ada data", result: null });
    res.status(200).json({ message: "Sukses laporan review", result: produk });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
module.exports = {
  getProdukYangPernahDibeli,
  tambahReview,
  laporanReview,
};

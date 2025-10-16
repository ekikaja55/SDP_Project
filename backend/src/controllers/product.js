const prisma = require("../../prisma/prisma");

const getAllProducts = async (req, res) => {
  try {
    const { nama, filterstok } = req.query;
    const whereClause = {
      deletedAt: null,
    };
    if (nama && nama.trim() !== "") {
      whereClause.produk_nama = {
        contains: nama,
        mode: "insensitive",
      };
    }
    if (filterstok) {
      if (filterstok.toLowerCase() === "habis") {
        whereClause.produk_stok = 0;
      } else if (filterstok.toLowerCase() === "ada") {
        whereClause.produk_stok = { gt: 0 };
      }
    }

    const products = await prisma.produk.findMany({
      where: whereClause,
    });
    return res
      .status(200)
      .json({ message: "Sukses ambil produk", result: products });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
const insertProduct = async (req, res) => {
  try {
    const { produk_nama, produk_stok, produk_harga } = req.body;
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    await prisma.produk.create({
      data: {
        produk_nama,
        produk_stok: parseInt(produk_stok),
        produk_harga: parseInt(produk_harga),
        produk_gambar: gambar,
      },
    });
    return res
      .status(201)
      .json({ message: "Sukses insert produk", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { produk_nama, produk_stok, produk_harga } = req.body;
    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    const dataProdukLama = await prisma.produk.findUnique({ where: { id } });
    if (!dataProdukLama)
      return res
        .status(404)
        .json({ message: "Produk tidak ditemukan", result: null });
    let stok = dataProdukLama.produk_stok;
    if (produk_stok && produk_stok !== undefined) stok += parseInt(produk_stok);
    await prisma.produk.update({
      where: { id },
      data: {
        produk_nama: produk_nama || dataProdukLama.produk_nama,
        produk_stok: stok,
        produk_harga:
          produk_harga !== undefined
            ? parseInt(produk_harga)
            : dataProdukLama.produk_harga,
        produk_gambar: gambar ?? dataProdukLama.produk_gambar,
      },
    });
    return res
      .status(200)
      .json({ message: "Sukses update produk", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.produk.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return res
      .status(200)
      .json({ message: "Sukses delete produk", result: null });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

const getProductKatalog = async (req, res) => {
  try {
    const { nama, filterharga, filterrating } = req.query;
    const whereClause = {
      produk_stok: { gt: 0 },
      deletedAt: null,
    };
    if (nama && nama.trim() !== "") {
      whereClause.produk_nama = {
        contains: nama,
        mode: "insensitive",
      };
    }
    const orderByClause = [];
    if (filterharga) {
      if (filterharga.toLowerCase() === "termurah") {
        orderByClause.push({ produk_harga: "asc" });
      } else if (filterharga.toLowerCase() === "termahal") {
        orderByClause.push({ produk_harga: "desc" });
      }
    }
    if (filterrating) {
      if (filterrating.toLowerCase() === "tertinggi") {
        orderByClause.push({ produk_rating: "desc" });
      } else if (filterrating.toLowerCase() === "terendah") {
        orderByClause.push({ produk_rating: "asc" });
      }
    }
    const products = await prisma.produk.findMany({
      where: whereClause,
      orderBy: orderByClause.length > 0 ? orderByClause : undefined,
    });
    if (products.length <= 0)
      return res.status(404).json({ message: "Tidak ada data", result: null });
    return res
      .status(200)
      .json({ message: "Sukses ambil produk", result: products });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

module.exports = {
  getAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
  getProductKatalog,
};

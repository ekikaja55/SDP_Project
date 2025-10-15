const prisma = require("../../prisma/prisma");

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.produk.findMany();
    return res
      .status(200)
      .json({ message: "Sukses ambil produk", result: products });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
const insertProduct = async (req, res) => {
  try {
    const {} = req.body;
  } catch (error) {}
};
const updateProduct = async (req, res) => {
  try {
  } catch (error) {}
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

module.exports = {
  getAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
};

/**
 * @fileoverview
 * Router untuk manajemen produk (CRUD produk dan katalog).
 * Menggunakan middleware upload untuk menangani upload gambar produk.
 *
 * @module routes/product
 */

const express = require("express");
const {
  insertProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductKatalog,
} = require("../controllers/product");
const upload = require("../middlewares/upload");
const router = express.Router();

/**
 * POST /api/v1/product
 * Menambahkan produk baru ke dalam database.
 * Mengharuskan upload gambar dengan field `produk_gambar`.
 */
router.post("/", [upload.single("produk_gambar")], insertProduct);

/**
 * PUT /api/v1/product/:id
 * Memperbarui data produk berdasarkan ID.
 * Dapat menyertakan gambar baru untuk menggantikan yang lama.
 */
router.put("/:id", [upload.single("produk_gambar")], updateProduct);

/**
 * DELETE /api/v1/product/:id
 * Menghapus produk berdasarkan ID.
 */
router.delete("/:id", deleteProduct);

/**
 * GET /api/v1/product
 * Mengambil seluruh data produk dari database.
 */
router.get("/", getAllProducts);

/**
 * GET /api/v1/product/katalog
 * Mengambil daftar produk dalam format katalog (untuk user).
 */
router.get("/katalog", getProductKatalog);

module.exports = router;

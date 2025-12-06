/**
 * @fileoverview Controller untuk manajemen produk.
 * Menangani operasi CRUD dan filter katalog produk.
 * @module controllers/product.js
 */

/** @type {import('@prisma/client').PrismaClient} */
const prisma = require("../../prisma/prisma");
const { createLog } = require('../utils/logHelper');

/**
 * @typedef {Object} ProductDTO
 * @property {string} produk_nama - Nama produk.
 * @property {number} produk_stok - Jumlah stok produk.
 * @property {number} produk_harga - Harga produk.
 * @property {string|null} [produk_gambar] - Nama file gambar produk.
 * @property {number} [produk_avg_rating] - Rata-rata rating produk.
 * @property {Date|null} [deletedAt] - Tanggal produk dihapus (soft delete).
 */

/**
 * Mengambil semua produk berdasarkan filter nama atau stok.
 * @async
 * @function getAllProducts
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>} Mengirim JSON berisi daftar produk.
 *
 * @example <caption>Contoh Request</caption>
 * // GET /api/v1/products?nama=roti&filterstok=ada
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses ambil produk",
 *   "result": [
 *     {
 *       "produk_nama": "Roti Tawar",
 *       "produk_stok": 10,
 *       "produk_harga": 12000
 *     }
 *   ]
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "error": "Internal error message..."
 * }
 */
const getAllProducts = async (req, res) => {
  try {
    const { nama, filterstok } = req.query;
    const whereClause = {};
    if (nama && nama.trim() !== "") {
      whereClause.produk_nama = { contains: nama, mode: "insensitive" };
    }
    if (filterstok) {
      const stok = filterstok.toLowerCase();
      if (stok === "habis") whereClause.produk_stok = 0;
      else if (stok === "ada") whereClause.produk_stok = { gt: 0 };
    }
    const produkList = await prisma.produk.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    const products = JSON.parse(
      JSON.stringify(produkList, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );


    return res.status(200).json({
      message: "Sukses ambil produk",
      result: products,
    });
  } catch (error) {
    console.error("Error getAllProducts:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

/**
 * Menambahkan produk baru ke database.
 * @async
 * @function insertProduct
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>} Mengirim JSON hasil penyimpanan produk.
 *
 * @example <caption>Contoh Request</caption>
 * // POST /api/v1/products
 * // Body:
 * // {
 * //   "produk_nama": "Roti Sobek",
 * //   "produk_stok": 15,
 * //   "produk_harga": 20000
 * // }
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses insert produk",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "result": null
 * }
 */
const insertProduct = async (req, res) => {
  try {
    const { produk_nama, produk_stok, produk_harga } = req.body;
    const gambar = req.file ? req.file.filename : null;

    const data = await prisma.produk.create({
      data: {
        produk_nama,
        produk_stok: parseInt(produk_stok),
        produk_harga: parseInt(produk_harga),
        produk_gambar: gambar,
        produk_avg_rating: 0,
        deletedAt: null,
      },
    });

    const products = JSON.parse(
      JSON.stringify(data, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    await createLog({
      actor: req.userLogin.user_nama,
      type: "PRODUCT",
      action: "INSERT",
      title: `Berhasil insert Produk ${products.produk_nama} `,
      desc: {
        before: null,
        after: { ...products },
      },
    });

    return res
      .status(201)
      .json({ message: "Sukses insert produk", result: null });
  } catch (error) {
    console.log("ERORRRR",error.message);

    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

/**
 * Memperbarui data produk berdasarkan ID.
 * @async
 * @function updateProduct
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>} Mengirim JSON hasil update produk.
 *
 * @example <caption>Contoh Request</caption>
 * // PUT /api/v1/products/123
 * // Body:
 * // {
 * //   "produk_harga": 15000,
 * //   "produk_stok": 5
 * // }
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses update produk",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (404)</caption>
 * {
 *   "message": "Produk tidak ditemukan",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "result": null
 * }
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { produk_nama, produk_stok, produk_harga } = req.body;
    const gambar = req.file ? req.file.filename : null;

    const dataProdukLama = await prisma.produk.findUnique({ where: { id } });
    if (!dataProdukLama)
      return res
        .status(404)
        .json({ message: "Produk tidak ditemukan", result: null });

    let stok = dataProdukLama.produk_stok;
    if (produk_stok && produk_stok !== undefined) stok += parseInt(produk_stok);

    const data = await prisma.produk.update({
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

      const products = JSON.parse(
        JSON.stringify(data, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
      await createLog({
        actor: req.userLogin.user_nama,
        type: "PRODUCT",
        action: "UPDATE",
        title: `Berhasil update Produk ${products.produk_nama} `,
        desc: {
          before: {...dataProdukLama},
          after: { ...products},
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

/**
 * Melakukan soft delete terhadap produk berdasarkan ID.
 * @async
 * @function deleteProduct
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>} Mengirim JSON hasil penghapusan produk.
 *
 * @example <caption>Contoh Request</caption>
 * // DELETE /api/v1/products/123
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses delete produk",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server",
 *   "result": null
 * }
 */
const deleteProduct = async (req, res) => {
  try {
   const { id } = req.params;
   const data =  await prisma.produk.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    const products = JSON.parse(
     JSON.stringify(data, (_, value) =>
     typeof value === "bigint" ? value.toString() : value
     ));
     console.log("product ",{...products});

      await createLog({
        actor: req.userLogin.user_nama,
        type: "PRODUCT",
        action: "DELETE",
        title: `Berhasil delete Produk ${products.produk_nama}`,
        desc: {
          before: null,
          after: { ...products },
        },
      });

    return res
      .status(200)
      .json({ message: "Sukses delete produk", result: null });
  } catch (error) {
    console.log("ERRRORRR",error.message);

    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

/**
 * Mengambil daftar produk untuk katalog publik.
 * Termasuk fitur filter nama, harga, dan rating.
 * @async
 * @function getProductKatalog
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @returns {Promise<void>} Mengirim JSON hasil filter katalog produk.
 *
 * @example <caption>Contoh Request</caption>
 * // GET /api/v1/katalog?filterharga=termurah&filterrating=tertinggi
 *
 * @example <caption>Contoh Response</caption>
 * {
 *   "message": "Sukses ambil produk",
 *   "result": [
 *     {
 *       "produk_nama": "Roti Manis",
 *       "produk_harga": 10000,
 *       "produk_avg_rating": 4.8
 *     }
 *   ]
 * }
 *
 * @example <caption>Response Error (404)</caption>
 * {
 *   "message": "Tidak ada data",
 *   "result": null
 * }
 *
 * @example <caption>Response Error (500)</caption>
 * {
 *   "message": "Terjadi kesalahan pada server"
 * }
 */
const getProductKatalog = async (req, res) => {
  try {
    const { nama, filterharga, filterrating } = req.query;
    const whereClause = {
      produk_stok: { gt: 0 },
      deletedAt: null,
    };

    if (nama && nama.trim() !== "") {
      whereClause.produk_nama = { contains: nama, mode: "insensitive" };
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
        orderByClause.push({ produk_avg_rating: "desc" });
      } else if (filterrating.toLowerCase() === "terendah") {
        orderByClause.push({ produk_avg_rating: "asc" });
      }
    }

    const produkList = await prisma.produk.findMany({
      where: whereClause,
      orderBy: orderByClause.length > 0 ? orderByClause : undefined,
    });

    const products = JSON.parse(
      JSON.stringify(produkList, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

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

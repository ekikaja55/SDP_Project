const prisma = require("../../prisma/prisma");

const getAllProducts = async (req, res) => {
  try {
    const { nama, filterstok } = req.query;
    console.log("isi query nama :" + nama);
    console.log("isi query filterStok :" + filterstok);

    // kuganti soalnya kata gpt cara paling aman whereClause ya jadikan object kosong

    // codemu dibawah ini katanya buat sql, cara handling di mongo beda
    // const whereClause = { deletedAt: null };
    const whereClause = {};

    if (nama && nama.trim() !== "") {
      whereClause.produk_nama = {
        contains: nama,
        mode: "insensitive",
      };
    }

    if (filterstok) {
      const stok = filterstok.toLowerCase();
      if (stok === "habis") {
        whereClause.produk_stok = 0;
      } else if (stok === "ada") {
        whereClause.produk_stok = { gt: 0 };
      }
    }
    console.log("isi whereClause :", whereClause);
    const all = await prisma.produk.findMany();
    console.log("Semua produk:", all.length);

    const produkList = await prisma.produk.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      // include: {
      //   // contoh kalau ada relasi ke tabel rating, bisa ikut dimasukkan
      //   // rating: true,
      // },
    });

    console.log("produkList :", produkList);

    // pas kamu coba return data yang tipenya Big INT, JSON.Stringfy() gak dapat membaca data big int buat next time bisa pakai handling ini di utils buat nge parsein big int, btw JSON.Stringfy() itu mencoba menjadikan jadi JSON object dan ini selalu dilakukan setiap kali kamu return suatu respon di backend express (aku gtw kalo yang lain)
    const products = JSON.parse(
      JSON.stringify(produkList, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    console.log("data products :", products);

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

const insertProduct = async (req, res) => {
  console.log("masuk insert");

  try {
    console.log("masuk try");

    const { produk_nama, produk_stok, produk_harga } = req.body;
    console.log("data body :", produk_nama, produk_harga, produk_stok);

    // gaperlu pakai concat /uploads soalnya kamu di index.js udah nyetel 1 path routes yang ngambil url /uploads jadi yang disimpen di db itu cukup nama file namenya aja soalnya kalo kamu pake concat string /uploads misal nama filenya test.jpg jadinya nanti akses di url http://localhost:3000/uploads//uploads/test.jpg kau bisa lihat otomatis bakalan error 404 not  found karena salah ketik url jadi aku perbaiki

    const gambar = req.file ? req.file.filename : null;

    console.log(gambar);

    // kamu lupa naruh field produk_avg_rating jadi aku set 0 soalnya kalo ga diset dia masuk catch, dan aku taruh deletedAt nya null soalnya pada akhirnya pas aku coba di get katalog dia selalu return [] karena dari awal deletedAt itu undifined bukan null, itu yang ku temuin, ribet njir walawe
    await prisma.produk.create({
      data: {
        produk_nama,
        produk_stok: parseInt(produk_stok),
        produk_harga: parseInt(produk_harga),
        produk_gambar: gambar,
        produk_avg_rating: 0,
        deletedAt: null,
      },
    });
    console.log("lolos prisma create");

    return res
      .status(201)
      .json({ message: "Sukses insert produk", result: null });
  } catch (error) {
    console.log("masuk catch");
    console.log("errornya : ", error.message);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
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
          // kamu typo gada field produk_rating adanya field produk_avg_rating
          // orderByClause.push({ produk_rating: "desc" });
          orderByClause.push({ produk_avg_rating: "desc" });
        } else if (filterrating.toLowerCase() === "terendah") {
          // sama aja kamu typo aku punya feeling kamu ga ngecek di postman :)
          // orderByClause.push({ produk_rating: "asc" });
          orderByClause.push({ produk_avg_rating: "asc" });
        }
      }

      const produkList = await prisma.produk.findMany({
        where: whereClause,
        orderBy: orderByClause.length > 0 ? orderByClause : undefined,
      });

      console.log("data produkList di getProductKatalog : ", produkList);

      // kasusnya sama kayak yang diatas big int gabisa dibaca sama JSON.Stringfy()
      const products = JSON.parse(
        JSON.stringify(produkList, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      console.log("isi products di getProductKatalog : ", products);

      if (products.length <= 0)
        return res.status(404).json({ message: "Tidak ada data", result: null });
      return res
        .status(200)
        .json({ message: "Sukses ambil produk", result: products });
    } catch (error) {
      console.log(error.message);

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

const prisma = require("../../prisma/prisma");
const insertTransaction = async (req, res) => {
  try {
    const user = req.userLogin;
    let { transaksi_grand_total, transaksi_detail } = req.body;
    transaksi_detail = JSON.parse(transaksi_detail);
    // console.log(user);

    // console.log(typeof transaksi_detail);

    // console.log(transaksi_detail);
    // console.log(transaksi_detail.length);
    // console.log(Array.isArray(transaksi_detail));
    // console.log(transaksi_detail.length === 0);

    // console.log(transaksi_grand_total);

    if (
      !transaksi_detail ||
      !Array.isArray(transaksi_detail) ||
      transaksi_detail.length <= 0
    ) {
      return res.status(400).json({
        message: "Transaksi detail tidak boleh kosong",
        result: null,
      });
    }

    for (const item of transaksi_detail) {
      console.log("masuk for");
      console.log("item", item.detail_nama);

      const produk = await prisma.produk.findFirst({
        where: { produk_nama: item.detail_nama },
      });
      if (!produk) {
        return res.status(404).json({
          message: `Produk ${item.detail_nama} tidak ditemukan`,
          result: null,
        });
      }
      if (produk.produk_stok < item.detail_stok) {
        return res.status(400).json({
          message: `Stok produk ${item.detail_nama} tidak mencukupi`,
          result: null,
        });
      }

      await prisma.produk.update({
        where: { id: produk.id },
        data: {
          produk_stok: produk.produk_stok - item.detail_stok,
        },
      });
    }
    console.log("masuk setelah if");

    const gambar = req.file.filename;
    transaksi_detail = transaksi_detail.map((d) => ({
      ...d,
      detail_stok: Number(d.detail_stok),
      detail_sub_total: Number(d.detail_sub_total),
    }));

    console.log("hasil mapping transaksi detail : ", transaksi_detail);

    console.log("value sebelum diubah", transaksi_grand_total);
    console.log("type sebelum diubah", typeof transaksi_grand_total);

    transaksi_grand_total = Number(
      String(transaksi_grand_total).replace(/[^\d.-]/g, "")
    );

    console.log("value setelah diubah", transaksi_grand_total);
    console.log("type setelah diubah", typeof transaksi_grand_total);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        user_transaksi: {
          push: {
            transaksi_img: gambar,
            transaksi_grand_total,
            transaksi_status: "Belum Dikonfirmasi",
            transaksi_detail,
          },
        },
      },
    });
    await prisma.notifikasi.create({
      data: {
        notifikasi_nama: "Pesanan Baru",
        notifikasi_isi: "Pesanan baru telah dipesan oleh " + user.user_nama,
        notifikasi_isread: "False",
      },
    });
    return res.status(200).json({
      message:
        "Sukses melakukan transaksi, silahkan tunggu konfirmasi pemesanan",
      result: null,
    });
  } catch (error) {
    console.log(error.message);

    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const getStatusCustomer = async (req, res) => {
  try {
    const { filterStatus } = req.query;
    const user = await prisma.user.findUnique({
      where: { id: req.userLogin.id },
      select: {
        user_transaksi: true,
      },
    });
    console.log(user);

    let listTransaksi = user.user_transaksi;
    console.log("list transaksi : ", listTransaksi);

    if (filterStatus) {
      listTransaksi = listTransaksi.filter(
        (t) =>
          t.transaksi_status === filterStatus &&
          t.transaksi_status !== "Pesanan Dibatalkan" &&
          t.transaksi_status !== "Pesanan Selesai"
      );
    } else {
      listTransaksi = listTransaksi.filter(
        (t) =>
          t.transaksi_status !== "Pesanan Dibatalkan" &&
          t.transaksi_status !== "Pesanan Selesai"
      );
    }
    console.log(listTransaksi);

    if (listTransaksi.length <= 0)
      return res.status(404).json({ message: "Tidak ada data", result: null });
    const semuaProduk = await prisma.produk.findMany({
      select: {
        produk_nama: true,
        produk_gambar: true,
        produk_harga: true,
      },
    });
    const transaksiLengkap = listTransaksi.map((t) => ({
      ...t,
      transaksi_detail: t.transaksi_detail.map((d) => {
        const produk = semuaProduk.find((p) => p.produk_nama === d.detail_nama);
        return {
          ...d,
          produk_gambar: produk ? produk.produk_gambar : null,
          produk_harga: produk ? produk.produk_harga : null,
        };
      }),
    }));
    const data = JSON.parse(
      JSON.stringify(transaksiLengkap, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    console.log("data get status: ", JSON.stringify(data, null, 2));

    res.status(200).json({ message: "Sukses ambil data", result: data });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};
const getHistoriCustomer = async (req, res) => {
  try {
    const { filterStatus } = req.query;
    const user = await prisma.user.findUnique({
      where: { id: req.userLogin.id },
      select: {
        user_transaksi: true,
      },
    });
    let listTransaksi = user.user_transaksi;
    if (filterStatus) {
      listTransaksi = listTransaksi.filter(
        (t) => t.transaksi_status === filterStatus
      );
    }
    if (listTransaksi.length <= 0)
      return res.status(404).json({ message: "Tidak ada data", result: null });
    const semuaProduk = await prisma.produk.findMany({
      select: {
        produk_nama: true,
        produk_gambar: true,
      },
    });
    const transaksiLengkap = listTransaksi.map((t) => ({
      ...t,
      transaksi_detail: t.transaksi_detail.map((d) => {
        const produk = semuaProduk.find((p) => p.produk_nama === d.detail_nama);
        return {
          ...d,
          produk_gambar: produk ? produk.produk_gambar : null,
        };
      }),
    }));
    const data = JSON.parse(
      JSON.stringify(transaksiLengkap, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
    res.status(200).json({ message: "Sukses ambil data", result: data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
  Z;
};

const ubahStatusTransaksi = async (req, res) => {
  try {
    const userId = req.userLogin.id;
    const { transaksi_id } = req.params;
    const { transaksi_status } = req.body;
    const user = await prisma.user.findFirst({
      where: { user_transaksi: { some: { transaksi_id } } },
      select: { id: true, user_transaksi: true },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    const transaksiBaru = user.user_transaksi.map((t) => {
      console.log("Perbandingan:", t.transaksi_id, transaksi_id);
      return t.transaksi_id === transaksi_id
        ? { ...t, transaksi_status: transaksi_status }
        : t;
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { user_transaksi: transaksiBaru },
    });
    res
      .status(200)
      .json({ message: "Status transaksi berhasil diubah", result: null });
  } catch (error) {
    console.log(error.message);

    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

const getLaporanPenjualanAdmin = async (req, res) => {
  try {
    const { filterbulan, filtertahun } = req.query;
    const semuaUser = await prisma.user.findMany({
      select: {
        user_nama: true,
        user_transaksi: true,
      },
    });
    const semuaTransaksi = semuaUser.flatMap((user) =>
      (user.user_transaksi || []).map((t) => ({
        ...t,
        user_nama: user.user_nama,
      }))
    );
    let transaksiFilter = semuaTransaksi;
    if (filterbulan || filtertahun) {
      transaksiFilter = semuaTransaksi.filter((t) => {
        const createdAt = new Date(t.createdAt);
        const bulan = createdAt.getMonth() + 1; // Januari = 0
        const tahun = createdAt.getFullYear();
        const cocokBulan = filterbulan ? bulan === Number(filterbulan) : true;
        const cocokTahun = filtertahun ? tahun === Number(filtertahun) : true;
        return cocokBulan && cocokTahun;
      });
    }
    if (transaksiFilter.length === 0) {
      return res.status(404).json({
        message: "Tidak ada data transaksi untuk periode ini",
        result: null,
      });
    }
    const transaksiAman = JSON.parse(
      JSON.stringify(transaksiFilter, (_, value) =>
        typeof value === "bigint" ? Number(value) : value
      )
    );
    res.status(200).json({
      message: "Sukses ambil laporan penjualan",
      result: transaksiAman,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

module.exports = {
  insertTransaction,
  getStatusCustomer,
  getHistoriCustomer,
  getLaporanPenjualanAdmin,
  ubahStatusTransaksi,
};

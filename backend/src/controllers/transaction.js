const prisma = require("../../prisma/prisma");
const insertTransaction = async (req, res) => {
  try {
    const user = req.userLogin;
    let { transaksi_grand_total, transaksi_detail } = req.body;
    transaksi_detail = JSON.parse(transaksi_detail);
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
    const gambar = req.file.filename;
    transaksi_detail = transaksi_detail.map((d) => ({
      ...d,
      detail_stok: Number(d.detail_stok),
      detail_sub_total: Number(d.detail_sub_total),
    }));
    transaksi_grand_total = Number(
      String(transaksi_grand_total).replace(/[^\d.-]/g, "")
    );
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
    let listTransaksi = user.user_transaksi;
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
    res.status(200).json({ message: "Sukses ambil data", result: data });
  } catch (error) {
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
};

const getAllTransaction = async (req, res) => {
  try {
    const { filterStatus } = req.query;
    const users = await prisma.user.findMany({
      select: {
        id: true,
        user_nama: true,
        user_transaksi: true,
      },
    });
    let listTransaksi = users.flatMap((user) =>
      user.user_transaksi.map((t) => ({
        ...t,
        user_id: user.id,
        user_nama: user.user_nama,
      }))
    );
    listTransaksi.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filterStatus) {
      listTransaksi = listTransaksi.filter(
        (t) => t.transaksi_status === filterStatus
      );
    }
    if (listTransaksi.length <= 0) {
      return res.status(404).json({ message: "Tidak ada data", result: null });
    }
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
    return res
      .status(200)
      .json({ message: "Sukses ambil semua transaksi", result: data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

const ubahStatusTransaksi = async (req, res) => {
  try {
    const { transaksi_id } = req.params;
    const { transaksi_status } = req.body;
    const user = await prisma.user.findFirst({
      where: { user_transaksi: { some: { transaksi_id } } },
      select: { id: true, user_transaksi: true },
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    const transaksiBaru = user.user_transaksi.map((t) => {
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
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", result: null });
  }
};

// laporan penjualan admin
const getLaporanPenjualanAdmin = async (req, res) => {
  try {
    const { filterbulan, filtertahun } = req.query;
    const semuaUser = await prisma.user.findMany({
      select: {
        id: true,
        user_nama: true,
        user_transaksi: true,
      },
    });
    const hasil = semuaUser.map((user) => {
      let transaksiUser = user.user_transaksi || [];
      transaksiUser = transaksiUser.filter(
        (t) => t.transaksi_status === "Pesanan Selesai"
      );
      if (filterbulan || filtertahun) {
        transaksiUser = transaksiUser.filter((t) => {
          const createdAt = new Date(t.createdAt);
          const bulan = createdAt.getMonth() + 1;
          const tahun = createdAt.getFullYear();
          const cocokBulan = filterbulan ? bulan === Number(filterbulan) : true;
          const cocokTahun = filtertahun ? tahun === Number(filtertahun) : true;
          return cocokBulan && cocokTahun;
        });
      }
      if (transaksiUser.length === 0) return null;
      const transaksi_total = transaksiUser.reduce(
        (sum, t) => sum + Number(t.transaksi_grand_total),
        0
      );
      const transaksi_count = transaksiUser.length;
      const transaksi_largest = transaksiUser.reduce((max, t) =>
        Number(t.transaksi_grand_total) > Number(max.transaksi_grand_total)
          ? t
          : max
      );
      return {
        id: user.id,
        nama_user: user.user_nama,
        transaksi_total,
        transaksi_count,
        transaksi_largest: {
          transaksi_id: transaksi_largest.transaksi_id,
          transaksi_grand_total: Number(
            transaksi_largest.transaksi_grand_total
          ),
          createdAt: new Date(transaksi_largest.createdAt).toISOString(),
          detail: (transaksi_largest.transaksi_detail || []).map((d) => ({
            detail_nama: d.detail_nama,
            detail_stok: Number(d.detail_stok),
            detail_sub_total: Number(d.detail_sub_total),
          })),
        },
      };
    });
    const hasilAkhir = hasil.filter(Boolean);
    if (hasilAkhir.length === 0) {
      return res.status(404).json({
        message: "Tidak ada data transaksi dengan status 'Pesanan Selesai'",
        result: [],
      });
    }
    res.status(200).json({
      message: "Sukses ambil laporan penjualan (Pesanan Selesai)",
      result: hasilAkhir,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      result: null,
    });
  }
};

module.exports = {
  insertTransaction,
  getStatusCustomer,
  getHistoriCustomer,
  getLaporanPenjualanAdmin,
  ubahStatusTransaksi,
  getAllTransaction,
};

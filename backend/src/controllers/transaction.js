const prisma = require("../../prisma/prisma");
const { createLog } = require("../utils/logHelper");
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

const getTransbyId = async (req, res) => {
  // 1. Ambil iduser dan idtrans dari query param
  const { iduser, idtrans } = req.query;

  console.log("ISI IDUSER: ", iduser);
  console.log("ISI IDTRANS: ", idtrans);

  // Validasi input
  if (!iduser || !idtrans) {
    return res
      .status(400)
      .json({ message: "ID User dan ID Transaksi diperlukan", result: null });
  }

  try {
    // 2. Cari User berdasarkan iduser
    const user = await prisma.user.findFirst({
      where: { id: iduser },
      select: {
        id: true,
        user_nama: true,
        user_transaksi: true, // Ini mengambil SEMUA transaksi user dulu
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User tidak ditemukan", result: null });
    }

    // 3. Cari Transaksi Spesifik di dalam array user_transaksi
    const targetTransaksi = user.user_transaksi.find(
      (t) => t.transaksi_id === idtrans
    );

    if (!targetTransaksi) {
      return res
        .status(404)
        .json({
          message: "Transaksi tidak ditemukan pada user ini",
          result: null,
        });
    }

    // 4. Ambil Master Produk (untuk mapping gambar & harga)
    const semuaProduk = await prisma.produk.findMany({
      select: {
        produk_nama: true,
        produk_gambar: true,
        produk_harga: true,
      },
    });

    // 5. Mapping Data (Single Object)
    // Kita tidak pakai .map() pada user_transaksi lagi, tapi langsung olah targetTransaksi

    // Mapping Detail Transaksi
    const mappedDetails = (targetTransaksi.transaksi_detail || []).map((d) => {
      const produk = semuaProduk.find((p) => p.produk_nama === d.detail_nama);

      return {
        detail_nama: d.detail_nama,
        detail_stok: d.detail_stok.toString(),
        detail_sub_total: d.detail_sub_total.toString(),
        produk_gambar: produk ? produk.produk_gambar : null,
        produk_harga: produk ? produk.produk_harga.toString() : "0",
      };
    });

    // Construct Single Object Result
    const formattedData = {
      user_id: user.id,
      user_nama: user.user_nama,

      transaksi_id: targetTransaksi.transaksi_id,
      transaksi_img: targetTransaksi.transaksi_img,
      transaksi_grand_total: Number(targetTransaksi.transaksi_grand_total),
      transaksi_status: targetTransaksi.transaksi_status,

      transaksi_detail: mappedDetails, // Array detail yang sudah dimapping

      createdAt: targetTransaksi.createdAt,
      updatedAt: targetTransaksi.updatedAt || null,
    };

    // 6. Finalisasi JSON (Safety untuk sisa BigInt jika ada)
    const data = JSON.parse(
      JSON.stringify(formattedData, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    console.log("ISI TRANS FINAL: ", JSON.stringify(data, null, 2));

    return res
      .status(200)
      .json({ message: "Sukses ambil detail transaksi", result: {...data} });
  } catch (error) {
    console.log("ERROR:", error.message);
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
      select: { id: true, user_transaksi: true, user_nama: true },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const transaksiLama = user.user_transaksi.find(
      (t) => t.transaksi_id === transaksi_id
    );

    const listTransaksiBaru = user.user_transaksi.map((t) => {
      return t.transaksi_id === transaksi_id
        ? { ...t, transaksi_status: transaksi_status }
        : t;
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { user_transaksi: listTransaksiBaru },
    });

    const cleanLog = (obj) =>
      JSON.parse(
        JSON.stringify(obj, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

    const simpleLogBefore = {
      transaksi_id: transaksiLama.transaksi_id,
      transaksi_status: transaksiLama.transaksi_status,
      transaksi_grand_total: transaksiLama.transaksi_grand_total,
    };

    const simpleLogAfter = {
      ...simpleLogBefore,
      transaksi_status: transaksi_status,
    };

    await createLog({
      actor: req.userLogin.user_nama,
      type: "TRANSACTION",
      action: "UPDATE",
      title: `Berhasil update status Transaksi Cust: ${user.user_nama}`,
      desc: {
        before: cleanLog(simpleLogBefore),
        after: cleanLog(simpleLogAfter),
      },
    });

    res
      .status(200)
      .json({ message: "Berhasil update status Transaksi", result: null });
  } catch (error) {
    console.log("ERRORRRR", error);

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
  getTransbyId,
};

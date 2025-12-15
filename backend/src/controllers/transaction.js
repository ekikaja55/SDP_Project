const prisma = require("../../prisma/prisma");
const { createLog } = require("../utils/logHelper");
const { randomUUID } = require("crypto");
const {
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} = require("date-fns");

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

    const idTrans = randomUUID();
    const userTrans = await prisma.user.update({
      where: { id: user.id },
      data: {
        user_transaksi: {
          push: {
            transaksi_id: idTrans,
            transaksi_img: gambar,
            transaksi_grand_total,
            transaksi_status: "Belum Dikonfirmasi",
            transaksi_detail,
          },
        },
      },
    });

    console.log("ISI TRANSAKSI SETELAH DI UPDATE : ", { ...userTrans });

    await prisma.notifikasi.create({
      data: {
        user_id: user.id,
        role: "admin",
        transaksi_id: idTrans,
        notifikasi_nama: "Pesanan Baru Diterima",
        notifikasi_isi: "Pesanan baru telah dipesan oleh " + user.user_nama,
        notifikasi_isread: "false",
      },
    });

    await prisma.notifikasi.create({
      data: {
        user_id: user.id,
        transaksi_id: idTrans,
        role: "customer",
        notifikasi_nama: "Pesanan Berhasil Dibuat",
        notifikasi_isi:
          "Pesanan Anda telah kami terima dan sedang menunggu konfirmasi Admin.",
        notifikasi_isread: "false",
      },
    });

    return res.status(200).json({
      message:
        "Sukses melakukan transaksi, silahkan tunggu konfirmasi pemesanan",
      result: null,
    });
  } catch (error) {
    console.log("ERRORR :", error);
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
      return res.status(200).json({ message: "Tidak ada data", result: null });
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
      return res.status(404).json({
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
      .json({ message: "Sukses ambil detail transaksi", result: { ...data } });
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
      select: {
        id: true,
        user_transaksi: true,
        user_nama: true,
        user_role: true,
      },
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

    await prisma.notifikasi.create({
      data: {
        user_id: user.id,
        transaksi_id: transaksi_id,
        role: "customer",
        notifikasi_nama: "Status Pesanan Diperbarui",
        notifikasi_isi: `Pesanan Anda ${simpleLogAfter.transaksi_status} `,
        notifikasi_isread: "false",
      },
    });

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

const getLaporanPenjualan = async (req, res) => {
  try {
    const now = new Date();

    const month = req.query.month || now.getMonth() + 1;
    const year = req.query.year || now.getFullYear();

    const targetDate = parseISO(`${year}-${String(month).padStart(2, "0")}-01`);
    const startDate = startOfMonth(targetDate);
    const endDate = endOfMonth(targetDate);

    const usersWithTransactions = await prisma.user.findMany({
      where: {
        user_transaksi: {
          some: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      select: {
        user_transaksi: true,
      },
    });

    let allTransactions = [];
    usersWithTransactions.forEach((user) => {
      const relevantTransactions = user.user_transaksi.filter((t) => {
        const created = t.createdAt;
        return created >= startDate && created <= endDate;
      });
      allTransactions.push(...relevantTransactions);
    });

    const completedTransactions = allTransactions.filter(
      (t) =>
        t.transaksi_status === "Pesanan Selesai" ||
        t.transaksi_status === "Selesai"
    );

    const totalRevenue = completedTransactions.reduce(
      (sum, t) => sum + BigInt(t.transaksi_grand_total),
      0n
    );
    const totalOrders = completedTransactions.length;

    const lastMonth = subMonths(targetDate, 1);
    const lastMonthStartDate = startOfMonth(lastMonth);
    const lastMonthEndDate = endOfMonth(lastMonth);

    const usersWithLastMonthTrans = await prisma.user.findMany({
      where: {
        user_transaksi: {
          some: {
            createdAt: {
              gte: lastMonthStartDate,
              lte: lastMonthEndDate,
            },
          },
        },
      },
      select: { user_transaksi: true },
    });

    let lastMonthTransactions = [];
    usersWithLastMonthTrans.forEach((user) => {
      const relevant = user.user_transaksi.filter((t) => {
        const created = t.createdAt;
        return (
          created >= lastMonthStartDate &&
          created <= lastMonthEndDate &&
          (t.transaksi_status === "Selesai" ||
            t.transaksi_status === "Pesanan Selesai")
        );
      });
      lastMonthTransactions.push(...relevant);
    });

    const lastMonthRevenue = lastMonthTransactions.reduce(
      (sum, t) => sum + BigInt(t.transaksi_grand_total),
      0n
    );

    const summary = {
      totalRevenue: totalRevenue.toString(),
      totalOrders: totalOrders,
      lastMonthRevenue: lastMonthRevenue.toString(),
      revenueGrowth:
        totalRevenue > 0n && lastMonthRevenue > 0n
          ? ((Number(totalRevenue) - Number(lastMonthRevenue)) /
              Number(lastMonthRevenue)) *
            100
          : totalRevenue > 0n && lastMonthRevenue === 0n
          ? 100
          : 0,
    };

    const dailySalesMap = {};
    completedTransactions.forEach((t) => {
      const dateKey = format(t.createdAt, "yyyy-MM-dd");
      dailySalesMap[dateKey] =
        (dailySalesMap[dateKey] || 0n) + BigInt(t.transaksi_grand_total);
    });

    const salesTrend = Object.keys(dailySalesMap)
      .map((date) => ({
        date: date,
        revenue: dailySalesMap[date].toString(),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const productSalesMap = {};

    completedTransactions.forEach((t) => {
      t.transaksi_detail.forEach((detail) => {
        const name = detail.detail_nama;
        const quantity = detail.detail_stok;
        const subTotal = detail.detail_sub_total;

        if (!productSalesMap[name]) {
          productSalesMap[name] = { quantity: 0, total: 0n };
        }
        productSalesMap[name].quantity += quantity;
        productSalesMap[name].total += BigInt(subTotal);
      });
    });

    const topSellingProducts = Object.keys(productSalesMap)
      .map((name) => ({
        productName: name,
        totalQuantity: productSalesMap[name].quantity,
        totalRevenue: productSalesMap[name].total.toString(),
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);

    // --- STATUS DISTRIBUTION ---
    // (Opsional: Jika kamu ingin grafik Pie Chart tetap menampilkan perbandingan Sukses vs Gagal,
    // biarkan pakai 'allTransactions'. Tapi jika pie chart juga mau khusus yg sukses aja, ganti jadi 'completedTransactions')
    // Disini saya biarkan allTransactions agar Admin tau berapa % yang sukses vs gagal.
    const statusMap = {};
    allTransactions.forEach((t) => {
      const status = t.transaksi_status;
      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    const statusDistribution = Object.keys(statusMap).map((status) => ({
      status: status,
      count: statusMap[status],
    }));

    return res.status(200).json({
      message: "Berhasil fetch laporan",
      result: {
        summary,
        salesTrend,
        topSellingProducts,
        statusDistribution,
        rawTransactions: completedTransactions.map((t) => ({
          ...t,
          transaksi_grand_total: t.transaksi_grand_total.toString(),
          transaksi_detail: t.transaksi_detail.map((d) => ({
            ...d,
            detail_sub_total: d.detail_sub_total.toString(),
          })),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching sales report:", error);
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
  getLaporanPenjualan,
};

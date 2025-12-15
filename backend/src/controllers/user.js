const prisma = require("../../prisma/prisma");
const { format, parseISO, compareDesc } = require("date-fns");

const getAllUser = async (req, res) => {
  try {
    const search = req.query.search?.trim() || "";
    const sort = req.query.sort?.toLowerCase() || "terbaru";
    const orderBy = sort === "terlama" ? "asc" : "desc";
    const users = await prisma.user.findMany({
      where: {
        user_role: "customer",
        ...(search && {
          user_nama: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      select: {
        id: true,
        user_nama: true,
        user_email: true,
        user_role: true,
        createdAt: true,
        user_transaksi: true,
      },
      orderBy: {
        createdAt: orderBy,
      },
    });
    if (users.length === 0) {
      return res.status(404).json({ message: "Tidak ada data", result: [] });
    }
    const hasil = users.map((u) => ({
      id: u.id,
      user_nama: u.user_nama,
      user_email: u.user_email,
      user_role: u.user_role,
      createdAt: u.createdAt,
      total_transaksi: u.user_transaksi ? u.user_transaksi.length : 0,
    }));
    return res.status(200).json({
      message: "Success",
      result: hasil,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      result: null,
    });
  }
};

const getAllLog = async (req, res) => {
  try {
    const { actor, type, action, search, startDate, endDate } = req.query;

    const filters = {};

    if (actor) {
      filters.log_actor = actor;
    }

    if (type) {
      filters.log_type = type;
    }

    if (action) {
      filters.log_action = action;
    }

    if (search) {
      filters.log_title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (startDate || endDate) {
      filters.createdAt = {};

      if (startDate) {
        filters.createdAt.gte = new Date(startDate);
      }

      if (endDate) {
        filters.createdAt.lte = new Date(endDate);
      }
    }

    const dataLog = await prisma.log.findMany({
      where: filters,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Berhasil ambil data log",
      result: dataLog,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Terjadi kesalahan server",
      result: null,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "ID Customer diperlukan." });
    }
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {},
    });

    if (!user) {
      return res.status(404).json({ message: "Customer tidak ditemukan." });
    }

    const allTrans = user.user_transaksi || [];
    const successTrans = allTrans.filter(
      (t) =>
        t.transaksi_status === "Selesai" ||
        t.transaksi_status === "Pesanan Selesai"
    );

    const totalSpend = successTrans.reduce(
      (sum, t) => sum + BigInt(t.transaksi_grand_total),
      0n
    );

    const totalOrders = successTrans.length;

    const aov = totalOrders > 0 ? totalSpend / BigInt(totalOrders) : 0n;

    let lastOrderDate = null;
    if (allTrans.length > 0) {
      const sortedDates = allTrans.sort((a, b) =>
        compareDesc(new Date(a.createdAt), new Date(b.createdAt))
      );
      lastOrderDate = sortedDates[0].createdAt;
    }

    const historyMap = {};

    successTrans.forEach((t) => {
      const dateKey = format(new Date(t.createdAt), "MMM yyyy");
      if (!historyMap[dateKey]) historyMap[dateKey] = 0n;
      historyMap[dateKey] += BigInt(t.transaksi_grand_total);
    });

    const spendingChart = Object.keys(historyMap).map((key) => ({
      label: key,
      value: historyMap[key].toString(),
    }));

    const productMap = {};

    successTrans.forEach((t) => {
      t.transaksi_detail.forEach((d) => {
        const prodName = d.detail_nama;
        if (!productMap[prodName]) productMap[prodName] = 0;
        productMap[prodName] += d.detail_stok;
      });
    });

    const topProductsChart = Object.keys(productMap)
      .map((key) => ({
        productName: key,
        qty: productMap[key],
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const statusMap = {};
    allTrans.forEach((t) => {
      const status = t.transaksi_status;
      statusMap[status] = (statusMap[status] || 0) + 1;
    });

    const statusChart = Object.keys(statusMap).map((key) => ({
      status: key,
      count: statusMap[key],
    }));

    const responseData = {
      profile: {
        id: user.id,
        nama: user.user_nama,
        email: user.user_email,
        role: user.user_role,
        joinDate: user.createdAt,
        lastActive: lastOrderDate,
      },
      stats: {
        lifetimeValue: totalSpend.toString(),
        totalOrders: totalOrders,
        averageOrderValue: aov.toString(),
        customerTier:
          totalOrders > 10 ? "VIP" : totalOrders > 5 ? "Loyal" : "New",
      },
      charts: {
        spendingTrend: spendingChart,
        topProducts: topProductsChart,
        orderStatusDistribution: statusChart,
      },
      transactionHistory: allTrans
        .map((t) => ({
          id: t.transaksi_id,
          date: t.createdAt,
          status: t.transaksi_status,
          total: t.transaksi_grand_total.toString(),
          itemsCount: t.transaksi_detail.length,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    };

    console.log("hasil olah detail : ", responseData);

    res.status(200).json({
      message: "Berhasil Fetch Detail Customer",
      result: responseData,
    });
  } catch (error) {
    console.error("Error fetching user detail:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      result: null,
    });
  }
};
module.exports = { getAllUser, getAllLog, getUserById };

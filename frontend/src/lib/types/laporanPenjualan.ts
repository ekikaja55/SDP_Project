//src/lib/types/laporanPenjualanStore.ts
export interface LaporanSummary {
	totalRevenue: string;
	totalOrders: number;
	lastMonthRevenue: string;
	revenueGrowth: number;
}

export interface SalesTrend {
	date: string;
	revenue: string;
}

export interface TopProduct {
	productName: string;
	totalQuantity: number;
	totalRevenue: string;
}

export interface StatusDistribution {
	status: string;
	count: number;
}

export interface TransDetail {
	detail_nama: string;
	detail_stok: number;
	detail_sub_total: string;
}

export interface RawTransaction {
	id: string;
	transaksi_id: string;
	transaksi_img: string;
	transaksi_status: string;
	transaksi_grand_total: string;
	transaksi_detail: TransDetail[];
	createdAt: string;
}

export interface LaporanResponse {
	summary: LaporanSummary;
	salesTrend: SalesTrend[];
	topSellingProducts: TopProduct[];
	statusDistribution: StatusDistribution[];
	rawTransactions: RawTransaction[];
}

export interface queryLaporan {
	bulan: string;
	tahun: string;
}

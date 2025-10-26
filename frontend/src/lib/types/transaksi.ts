// src/lib/types/transaksi.ts
// setup type  transaksi handling

import type { LaporanTransaksiDetail, TransaksiDetail } from './transaksiDetail';

export interface Transaksi {
	transaksi_id: string;
	transaksi_img: string | File;
	transaksi_grand_total: number;
	transaksi_status: string;
	transaksi_detail: TransaksiDetail[];
	createdAt: string;
	updatedAt?: string;
}

export interface TransaksiAdmin {
	user_id: string;
	user_nama: string;
	transaksi_id: string;
	transaksi_img: string | File;
	transaksi_grand_total: number;
	transaksi_status: string;
	transaksi_detail: TransaksiDetail[];
	createdAt: string;
	updatedAt?: string;
}

export interface TransaksiDTO {
	transaksi_img: string | File;
	transaksi_grand_total: string;
	transaksi_detail: TransaksiDetail[];
}

export interface TransaksiUpdateDTO {
	transaksi_id: string;
	transaksi_status: string;
}

export interface QueryLaporan {
	id: string;
	isiFilter: string;
}

interface LaporanTransaksiLargest {
  transaksi_id: string;
	transaksi_grand_total: number;
  createdAt: string;
	detail: LaporanTransaksiDetail[];
}
export interface LaporanPenjualan {
	id: string;
	nama_user: string;
  transaksi_total:number;
  transaksi_count:number;
  transaksi_largest: LaporanTransaksiLargest
}

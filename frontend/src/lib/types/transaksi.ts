// src/lib/types/transaksi.ts
// setup type  transaksi handling

import type { TransaksiDetail } from './transaksiDetail';

export interface Transaksi {
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

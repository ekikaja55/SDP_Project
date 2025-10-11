// src/lib/types/transaksi.ts
// setup type  transaksi handling

import type { TransaksiDetail } from './transaksiDetail';

export interface Transaksi {
	id: number;
	user_id: number;
	transaksi_grandtotal: number;
	transaksi_status: string;
	transaksi_detail: TransaksiDetail[];
	transaksi_img: string;
	createdAt: string;
}

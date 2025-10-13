// src/lib/types/transaksi.ts
// setup type  transaksi handling

import type { TransaksiDetail } from './transaksiDetail';

export interface Transaksi {
	transaksi_img: string;
	transaksi_grand_total: number;
	transaksi_status: string;
	transaksi_detail: TransaksiDetail[];
}

// src/lib/types/transaksiDetail.ts
// setup type  transaksi handling

export interface TransaksiDetail {
	detail_nama: string;
	detail_stok: string;
	detail_sub_total: string;
	produk_gambar?: string;
	produk_harga?: string;
}

export interface LaporanTransaksiDetail {
	detail_nama: string;
	detail_stok: string;
	detail_sub_total: string;
}

// src/lib/types/produk.ts
// setup type produk handling

export interface Produk {
	id: number;
	produk_nama: string;
	produk_gambar: string;
	produk_stok: number;
	produk_harga: number;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

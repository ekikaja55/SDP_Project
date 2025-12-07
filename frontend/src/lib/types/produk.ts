// src/lib/types/produk.ts

import type { Review } from './review';

export interface Produk {
	id: string;
	produk_nama: string;
	produk_gambar: string | File;
	produk_stok: number;
	produk_harga: number;
	produk_avg_rating: number;
	produk_review: Review[];
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

/**
 *interface khusus untuk tambah & update produk
 *DTO itu Data Transfer Object
 *definisi DTO adalah struktur data ringan yang dirancang untuk mentransfer informasi antar proses *atau layer, tanpa menyertakan logika bisnis atau properti yang tidak relevan biasanya untuk *penamaan type CRUD, karena itu aku kasi penamaanya ada penambahan DTO misalnya nanti mau ganti nama *juga gpp
 */
export interface ProdukDTO {
	id?: string | null;
	produk_nama?: string;
	produk_gambar?: string | File;
	produk_stok?: number;
	produk_harga?: number;
	produk_avg_rating?: number;
	produk_review?: Review[] | null;
}


// optional: interface untuk update kenapa partial? biar semua fieldnya bisa opsional
// export interface ProdukUpdateDTO extends Partial<ProdukCreateDTO> {}

export interface CartProduk {
	id: string;
	produk_nama: string;
	produk_gambar: string | File;
	qty?:number;
  produk_harga: number;
  produk_total?:number;
}

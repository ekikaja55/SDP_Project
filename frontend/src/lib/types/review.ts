// src/lib/types/review.ts
// setup type review user  handling

export interface Review {
	review_nama: string;
	review_rating: number;
	review_isi: string;
	createdAt: string;
}

export interface ReviewCustomer {
	produk_nama: string;
	produk_gambar: string;
}

export interface ReviewDTO {
	produk_nama: string;
	review_rating: number;
	review_isi: string;
}

export interface laporanReview {
	produk_nama: string;
	produk_gambar: string;
	produk_avg_rating: number;
	produk_review: Review[];
}

// src/lib/types/review.ts
// setup type review user  handling

export interface Review {
	id: number;
	user_nama: string;
	produk_id: number;
	review_rating: number;
	review_isi: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

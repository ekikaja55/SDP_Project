// src/lib/types/metodeBayar.ts
// setup type  metode pembayaran  handling

export interface MetodeBayar {
	id: string;
	metode_nama: string;
	metode_qr?: string;
	metode_norek?: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

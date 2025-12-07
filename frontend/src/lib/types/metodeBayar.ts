// src/lib/types/metodeBayar.ts

export interface MetodeBayar {
	id: string;
	metode_nama: string;
	metode_qr?: string;
	metode_norek?: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

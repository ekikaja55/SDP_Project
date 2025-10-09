// src/lib/types/metodeBayar.ts
// setup type  metode pembayaran  handling

export interface MetodeBayar {
	id: number;
	metodebayar_nama: string;
	metodebayar_qr?: string;
	metodebayar_norek?: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

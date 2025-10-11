// src/lib/types/notifikasi.ts
// untuk types handling notifikasi

export interface Notifikasi {
	id: number;
	user_nama: string;
	notifikasi_pesan: string;
  notifikasi_is_read:boolean;
  createdAt:string;
  updated_at:string;
}

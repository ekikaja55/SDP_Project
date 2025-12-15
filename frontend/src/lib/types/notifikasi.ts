// src/lib/types/notifikasi.ts

// model Notifikasi {
//   id                String    @id @default(auto()) @map("_id") @db.ObjectId
//   user_id           String?
//   role              String
//   transaksi_id      String
//   notifikasi_nama   String
//   notifikasi_isi    String
//   notifikasi_isread String
//   createdAt         DateTime  @default(now())
//   updatedAt         DateTime  @updatedAt
//   deletedAt         DateTime?
// }
export interface Notifikasi {
	id: string;
	user_id: String;
	role: String;
	transaksi_id: String;
	notifikasi_nama: string;
	notifikasi_isi: string;
	notifikasi_isread: string;
	createdAt: string;
	updated_at: string;
}

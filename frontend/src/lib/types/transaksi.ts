// src/lib/types/transaksi.ts

import type { LaporanTransaksiDetail, TransaksiDetail } from './transaksiDetail';

export interface Transaksi {
	transaksi_id: string;
	transaksi_img: string | File;
	transaksi_grand_total: number;
	transaksi_status: string;
	transaksi_detail: TransaksiDetail[];
	createdAt: string;
	updatedAt?: string;
}

// {
//   "user_id": "6915e18b48761c2ca535e7a8",
//   "user_nama": "Fabian Kurniawan Limanto",
//   "transaksi_id": "8a8fe240-2c7b-44dd-9fa5-19920886ac8d",
//   "transaksi_img": "bukti4.jpeg",
//   "transaksi_grand_total": 140000,
//   "transaksi_status": "Belum Dikonfirmasi",
//   "transaksi_detail": [
//     {
//       "detail_nama": "Sari Kurma ",
//       "detail_stok": "1",
//       "detail_sub_total": "45000",
//       "produk_gambar": "sari kurma .jpg",
//       "produk_harga": "45000"
//     },
//     {
//       "detail_nama": "Minyak Zaitun Herbal",
//       "detail_stok": "1",
//       "detail_sub_total": "95000",
//       "produk_gambar": "minyak zaitun.png",
//       "produk_harga": "95000"
//     }
//   ],
//   "createdAt": "2025-12-07T18:16:59.422Z",
//   "updatedAt": null
// }
export interface TransaksiAdmin {
	user_id: string;
	user_nama: string;
	transaksi_id: string;
	transaksi_img: string | File;
	transaksi_grand_total: number;
	transaksi_status: string;
	transaksi_detail: TransaksiDetail[];
	createdAt: string;
	updatedAt?: string;
}

export interface TransaksiDTO {
	transaksi_img: string | File;
	transaksi_grand_total: string;
	transaksi_detail: TransaksiDetail[];
}

export interface TransaksiUpdateDTO {
	transaksi_id: string;
	transaksi_status: string;
}

export interface QueryLaporan {
	id: string;
	isiFilter: string;
}

interface LaporanTransaksiLargest {
  transaksi_id: string;
	transaksi_grand_total: number;
  createdAt: string;
	detail: LaporanTransaksiDetail[];
}
export interface LaporanPenjualan {
	id: string;
	nama_user: string;
  transaksi_total:number;
  transaksi_count:number;
  transaksi_largest: LaporanTransaksiLargest
}

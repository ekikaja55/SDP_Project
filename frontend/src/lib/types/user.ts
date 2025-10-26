// src/lib/types/user.ts
// setup type user handling

import type { Transaksi } from './transaksi';

// type untuk user
export interface User {
	id: string;
	user_nama: string;
	user_email: string;
	user_role: string;
	// satu user bisa punya banyak Transaksi di type transaksi
	user_transaksi?: Transaksi[];
	createdAt: string;
	updatedAt: string;
}

export type UserAuth = Omit<User, 'user_password' | 'createdAt' | 'updatedAt'>;

// type untuk Login user
export interface LoginDTO {
	user_email: string;
	user_password: string;
}

// type untuk Register user
export interface RegisterDTO {
	user_nama: string;
	user_email: string;
	user_password: string;
	user_confirm_password: string;
}

//        id: u.id,
//       user_nama: u.user_nama,
//       user_email: u.user_email,
//       user_role: u.user_role,
//       createdAt: u.createdAt,
//       total_transaksi: u.user_transaksi ? u.user_transaksi.length : 0,

export interface Customer {
	id: string;
	user_nama: string;
	user_email: string;
	user_role: string;
	createdAt: string;
	total_transaksi: number;
}

export interface QueryCustomer {
	search: string ;
	sort: string;
}

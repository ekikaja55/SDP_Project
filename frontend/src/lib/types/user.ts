// src/lib/types/user.ts

import type { Transaksi } from './transaksi';

export interface User {
	id: string;
	user_nama: string;
	user_email: string;
	user_role: string;
	user_transaksi?: Transaksi[];
	createdAt: string;
	updatedAt: string;
}

export type UserAuth = Omit<User, 'user_password' | 'createdAt' | 'updatedAt'>;

export interface LoginDTO {
	user_email: string;
	user_password: string;
}

export interface RegisterDTO {
	user_nama: string;
	user_email: string;
	user_password: string;
	user_confirm_password: string;
}


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

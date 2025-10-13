// src/lib/types/user.ts
// setup type user handling

import type { Transaksi } from './transaksi';

// type untuk user
export interface User {
	id: number;
	user_nama: string;
	user_email: string;
	user_role: string;
	// satu user bisa punya banyak Transaksi di type transaksi
	user_transaksi: Transaksi[];
	createdAt: string;
	updatedAt: string;
}

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

// src/lib/types/user.ts
// setup type user handling

export interface User {
	id: number;
	user_nama: string;
	user_email: string;
	user_role: string;
	createdAt: string;
	updatedAt: string;
}

// untuk types handling auth
export interface AuthResponse {
	token: string;
	user: User;
}

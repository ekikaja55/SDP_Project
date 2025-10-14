// src/app.d.ts
// Global type definition for your SvelteKit + Express + JWT setup

import type { AuthSession } from '$lib';

declare global {
	namespace App {
		/**
		 * Data yang nempel di setiap request di sisi server.
		 * Ini cocok kalau kamu nanti punya endpoint SvelteKit
		 * yang ngambil data dari backend Express (misal lewat JWT).
		 */
		interface Locals extends AuthSession {}

		/**
		 * Data yang dikirim dari server load() ke halaman Svelte.
		 * Misal kamu load user info dari backend, lalu kirim ke +page.svelte.
		 */
		interface PageData extends AuthSession {}

		/**
		 * Kalau load() atau action error, ini type error-nya.
		 * Kamu bisa isi sesuai struktur error dari backend.
		 */
		interface Error {
			message: string;
			status?: number;
		}

		// Biarkan kosong dulu, belum butuh di setup ini.
		interface PageState {}

		// Karena backend kamu pakai Node (Express),
		// kita belum perlu define platform environment.
		interface Platform {}
	}
}

export {};

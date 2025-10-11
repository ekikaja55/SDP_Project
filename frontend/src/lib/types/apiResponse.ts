// src/lib/types/apiResponse.ts

/**
 * Struktur umum untuk response dari backend API.
 *
 * Backend selalu mengembalikan data dengan format:
 * ```json
 * {
 *   "message": "Keterangan proses (success/error)",
 *   "result": {} | [] | null
 * }
 * ```
 *
 * @template T
 * `T` adalah tipe data dinamis (generic type parameter) yang akan diisi
 * dengan tipe data aktual dari `result`.
 *
 * Misal:
 * - `apiResponse<User>` → result berisi 1 objek user
 * - `apiResponse<User[]>` → result berisi array user
 * - `apiResponse<string>` → result berisi teks sederhana
 */
export interface ApiResponse<T> {
	message: string;
	result: T;
}

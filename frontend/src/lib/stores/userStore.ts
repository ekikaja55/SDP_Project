// src/lib/stores/userStore.ts
// ini handling  function dan reactive state untuk user ( login, register, logout)

// handling functiion axios
import {
	api,
	errorHandler,
	type ApiResponse,
	type LoginDTO,
	type MessageState,
	type RegisterDTO,
	type User
} from '$lib';
import { writable } from 'svelte/store';

// inisiasi state modelan redux
export const userStore = writable<User | null>(null);
export const loading = writable(false);
export const messageHandle = writable<MessageState | null>(null);

/**
 * Function Handle Store Login User
 *
 * @param {LoginDTO} data - Data Login credentials basis object yang berisi:
 *   @param {string} data.user_email - Email User.
 *   @param {string} data.user_password - Password User.
 * @returns {Promise<ApiResponse<User>>} API response berisi message dan akses token.
 *
 * @example
 * const data = {
 * user_email: "rizki@gmail.com",
 * user_password: "123"
 * };
 * @example <caption>Expected Output</caption>
 * {
 * "message": "Sukses Login",
 * "result":  { accessToken }
 * }
 */

export async function login(data: LoginDTO) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.post<ApiResponse<User>>('/auth/login', data);
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
		userStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
}

/**
 * Function Handle Store Register User
 * @param {RegisterDTO} data - Data Register kredensial user basis objek yang terdiri :
 *    @param {string} user_nama - Nama User.
 *    @param {string} user_email - Email User.
 *    @param {string} user_password - Password User.
 *    @param {string} user_confirm_password - Confirm Password User.
 * @returns {Promise<ApiResponse<User>>} API response berisi message dan data user.
 * @example
 * const data:RegisterDTO = {
 * user_nama = "rizki",
 * user_email = "rizki@example.com",
 * user_password = "123",
 * user_confirm_password = "123"
 * }
 * @example <caption>Expected Output</caption>
 * {
 * "message": "Sukses Register",
 * "result": { user }
 * }
 */
export async function register(data: RegisterDTO) {
	loading.set(true);
	messageHandle.set(null);

	if (data.user_password !== data.user_confirm_password) {
		messageHandle.set({ type: 'error', message: 'Password tidak cocok' });
		loading.set(false);
		return;
	}

	try {
		const res = await api.post<ApiResponse<User>>('/auth/register', data);
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
	} catch (err: unknown) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
}
/**
 * Function handling refresh token
 * @returns {Promise<ApiResponse<User>>} - API Message Berisi Message dan Result
 * @example <caption>Expected Output</caption>
 * {
 * "message": "Sukses Refresh Token",
 * "result": { accessToken }
 * }
 */
export async function checkAuth() {
	try {
		const res = await api.get<ApiResponse<User>>('/auth/refreshtoken');
		userStore.set(res.data.result);
	} catch {
		userStore.set(null);
	}
}

/**
 * Function handling logout()
 * @returns {Promise<ApiResponse<User>>} - API Message Berisi Message dan Result
 * @example <caption>Expected Output</caption>
 * {"message": "Sukses Refresh Token" }
 */
export async function logout() {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.get<ApiResponse<User>>('/auth/logout');
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
	} catch (err: unknown) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
	userStore.set(null);
	window.location.href = '/';
}

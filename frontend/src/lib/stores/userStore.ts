/**
 * src/lib/stores/userStore.ts
 *
 * ini handling  function dan reactive state untuk user ( login, register, logout)
 */

// handling functiion axios
import {
	api,
	errorHandler,
	type ApiResponse,
	type LoginDTO,
	type MessageState,
	type RegisterDTO,
	type User,
	type UserAuth
} from '$lib';
import { jwtDecode } from 'jwt-decode';
import { writable, type Writable } from 'svelte/store';

// inisiasi state modelan redux

export const userStore: Writable<UserAuth | null> = writable<UserAuth | null>(null);
export const loadingUser: Writable<boolean> = writable(false);
export const messageHandleUser: Writable<MessageState | null> = writable<MessageState | null>(null);

/**
 * Function Handle Store Login User
 *
 * @param {LoginDTO} data - Data Login credentials basis object yang berisi:
 *   @param {string} data.user_email - Email User.
 *   @param {string} data.user_password - Password User.
 * @returns {Promise<ApiResponse<UserAuth>>} API response berisi message dan akses token.
 *
 * @example
 * const data = {
 * user_email: "rizki@gmail.com",
 * user_password: "123"
 * };
 * @example <caption>Expected Output</caption>
 * {
 * "message": "Sukses Login",
 * "result":  accessToken //string literal
 * }
 */

export async function login(data: LoginDTO) {
	loadingUser.set(true);
	messageHandleUser.set(null);
	try {
		console.log('============================================');
		console.log('fn login userStore -> masuk 1');

		const res = await api.post<ApiResponse<string>>('/auth/login', data);
		console.log('fn login userStore -> masuk after fetch');

		messageHandleUser.set({
			type: 'success',
			message: res.data.message
		});

		console.log(
			'fn login userStore -> isi token hasil fetch\n' + JSON.stringify(res.data.result, null, 2)
		);
		const dataUser: UserAuth = jwtDecode(res.data.result);
		console.log('isi access token setelah di decode\n' + JSON.stringify(dataUser, null, 2));
		// userStore.set(dataUser);
		window.location.href = `/dashboard/${dataUser.user_role}`;
		// goto(`/dashboard/${dataUser.user_role}`)
	} catch (err: unknown) {
		messageHandleUser.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loadingUser.set(false);
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
	loadingUser.set(true);
	messageHandleUser.set(null);

	if (data.user_password !== data.user_confirm_password) {
		messageHandleUser.set({ type: 'error', message: 'Password tidak cocok' });
		loadingUser.set(false);
		return;
	}

	try {
		const res = await api.post<ApiResponse<User>>('/auth/register', data);
		messageHandleUser.set({
			type: 'success',
			message: res.data.message
		});
	} catch (err: unknown) {
		messageHandleUser.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loadingUser.set(false);
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
		const res = await api.get<ApiResponse<string>>('/auth/refreshtoken');
		const dataUser: UserAuth = jwtDecode(res.data.result);
		userStore.set(dataUser);
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
	loadingUser.set(true);
	messageHandleUser.set(null);
	try {
		const res = await api.get<ApiResponse<User>>('/auth/logout');
		messageHandleUser.set({
			type: 'success',
			message: res.data.message
		});
	} catch (err: unknown) {
		messageHandleUser.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loadingUser.set(false);
	}
	userStore.set(null);
	window.location.href = '/';
}

// src/lib/stores/userStore.ts
// ini handling  function dan reactive state untuk user ( login, register, logout)

// handling functiion axios
import {
	api,
	errorHandler,
	type apiResponse,
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

// handling login
export async function login(data: LoginDTO) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.post<apiResponse<User>>('/auth/login', data);
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

// handling register
export async function register(data: RegisterDTO) {
	loading.set(true);
	messageHandle.set(null);

	try {
		const res = await api.post<apiResponse<User>>('/auth/register', data);
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
// handling refresh token
export async function checkAuth() {
	try {
		const res = await api.get<apiResponse<User>>('/auth/refreshtoken');
		userStore.set(res.data.result);
	} catch {
		userStore.set(null);
	}
}

// handling logout
export async function logout() {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.get<apiResponse<User>>('/auth/logout');
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

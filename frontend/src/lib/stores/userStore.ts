// src/lib/stores/userStore
// handling functiion axios
import { writable } from 'svelte/store';
import { api } from '$lib';
import type { User, AuthResponse } from '$lib';

// state modelan redux
export const userStore = writable<User | null>(null);
export const loading = writable(false);
export const error = writable<string | null>(null);

export async function login(email: string, password: string) {
	loading.set(true);
	error.set(null);
	try {
		const res = await api.post<AuthResponse>('/auth/login', { email, password });
		localStorage.setItem('token', res.data.token);
		userStore.set(res.data.user);
	} catch (err: any) {
		error.set(err.response?.data?.message || 'Login gagal');
	} finally {
		loading.set(false);
	}
}

export async function register(nama: string, email: string, password: string) {
	loading.set(true);
	error.set(null);

	try {
		const res = await api.post<AuthResponse>('/auth/register', {
			user_nama: nama,
			user_email: email,
			user_password: password
		});
		localStorage.setItem('token', res.data.token);
		userStore.set(res.data.user);
	} catch (err: any) {
		error.set(err.response?.data?.message || 'Register gagal');
	} finally {
		loading.set(false);
	}
}

export function logout() {
	localStorage.removeItem('token');
	userStore.set(null);
	window.location.href = '/';
}

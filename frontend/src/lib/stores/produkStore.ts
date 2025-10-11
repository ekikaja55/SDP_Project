// src/lib/stores/produkStore.ts
// ini handling  function dan reactive state untuk crud  produk

import {
	api,
	errorHandler,
	type ApiResponse,
	type MessageState,
	type Produk,
	type ProdukCreateDTO,
	type ProdukUpdateDTO
} from '$lib';
import { writable } from 'svelte/store';

export const produkStore = writable<Produk[] | null>(null);
export const produkSingleStore = writable<Produk | null>(null);
export const loading = writable<boolean>(false);
export const messageHandle = writable<MessageState | null>(null);

// handling get all produk
export async function getAllProduk() {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.get<ApiResponse<Produk[]>>('/produk');
		produkStore.set(res.data.result);
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

// handling get one produk by id
export async function getProdukById(id: string) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.get<ApiResponse<Produk>>(`/produk/${id}`);
		produkSingleStore.set(res.data.result);
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

// handling untuk add produk
export async function addProduk(data: ProdukCreateDTO) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.post<ApiResponse<Produk>>('/produk', data);
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
		await refetchTodo();
	} catch (err: unknown) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
}
// handling update Produk
export async function updateProduk(id: string, data: ProdukUpdateDTO) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.put<ApiResponse<Produk>>(`/produk/${id}`, { data });
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
		await refetchTodo();
	} catch (err: unknown) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
}

// handling hapus Produk
export async function deleteProduk(id: string) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.delete<ApiResponse<Produk>>(`/produk/${id}`);
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
		await refetchTodo();
	} catch (err: unknown) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
}
// handling refetching setelah insert update delete
async function refetchTodo() {
	try {
		const res = await api.get<ApiResponse<Produk[]>>('/produk');
		produkStore.set(res.data.result);
	} catch (err) {
		console.error(err);
	}
}

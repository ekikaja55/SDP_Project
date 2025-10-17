// src/lib/stores/produkStore.ts
// ini handling  function dan reactive state untuk crud  produk

// src/lib/stores/produkStore.ts

import {
	api,
	errorHandler,
	loadingGlobal,
	messageHandleGlobal,
	type ApiResponse,
	type MessageState,
	type Produk,
	type ProdukDTO
} from '$lib';
import { writable } from 'svelte/store';

export const produkStore = writable<Produk[]>([]);
export const produkCatalogStore = writable<Produk[]>([]);
export const loadingProduk = writable(false);
export const messageHandleProduk = writable<MessageState | null>(null);

// GET ALL PRODUK
export async function getAllProduk(searchNama?: string, filterStok?: string) {
	loadingProduk.set(true);
	try {
		let url = '/product';
		const params: string[] = [];
		if (searchNama) params.push(`nama=${encodeURIComponent(searchNama)}`);
		if (filterStok) params.push(`filterstok=${encodeURIComponent(filterStok)}`);
		if (params.length > 0) url += `?${params.join('&')}`;

		console.log('url final', url);

		const res = await api.get<ApiResponse<Produk[]>>(url);
		produkStore.set(res.data.result ?? []);
	} catch (err: unknown) {
		messageHandleProduk.set({ type: 'error', message: errorHandler(err) });
	} finally {
		loadingProduk.set(false);
	}
}

// ADD PRODUK
export async function addProduk(data: ProdukDTO) {
	loadingProduk.set(true);
	messageHandleProduk.set(null);
	try {
		const formData = new FormData();
		formData.append('produk_nama', data.produk_nama || '');
		formData.append('produk_stok', String(data.produk_stok ?? 0));
		formData.append('produk_harga', String(data.produk_harga ?? 0));

		if (data.produk_gambar instanceof File) {
			formData.append('produk_gambar', data.produk_gambar);
		}

		const res = await api.post<ApiResponse<Produk>>('/product', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});

		messageHandleProduk.set({ type: 'success', message: res.data.message });
		await getAllProduk();
		await getKatalogProduk();
	} catch (err: unknown) {
		messageHandleProduk.set({ type: 'error', message: errorHandler(err) });
		produkCatalogStore.set([]);

	} finally {
		loadingProduk.set(false);
	}
}

// UPDATE PRODUK
export async function updateProduk(data: ProdukDTO) {
	if (!data.id) {
		messageHandleProduk.set({ type: 'error', message: 'ID produk tidak ditemukan.' });
		return;
	}

	loadingProduk.set(true);
	messageHandleProduk.set(null);

	try {
		const formData = new FormData();
		if (data.produk_nama) formData.append('produk_nama', data.produk_nama);
		if (data.produk_stok !== undefined) formData.append('produk_stok', String(data.produk_stok));
		if (data.produk_harga !== undefined) formData.append('produk_harga', String(data.produk_harga));

		// hanya upload file baru jika ada
		if (data.produk_gambar instanceof File) {
			formData.append('produk_gambar', data.produk_gambar);
		}

		const res = await api.put<ApiResponse<Produk>>(`/product/${data.id}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});

		messageHandleProduk.set({ type: 'success', message: res.data.message });
		await getAllProduk();
		await getKatalogProduk();
	} catch (err: unknown) {
		messageHandleProduk.set({ type: 'error', message: errorHandler(err) });
		produkCatalogStore.set([]);

	} finally {
		loadingProduk.set(false);
	}
}

// DELETE PRODUK
export async function deleteProduk(id: string) {
	loadingProduk.set(true);
	messageHandleProduk.set(null);
	try {
		const res = await api.delete<ApiResponse<Produk>>(`/product/${id}`);
		messageHandleProduk.set({ type: 'success', message: res.data.message });
		await getAllProduk();
		await getKatalogProduk();
	} catch (err: unknown) {
		messageHandleProduk.set({ type: 'error', message: errorHandler(err) });
		produkCatalogStore.set([]);
	} finally {
		loadingProduk.set(false);
	}
}

// GET KATALOG PRODUK
export async function getKatalogProduk(
	searchNama?: string,
	filterHarga?: string,
	filterRating?: string
) {
	loadingGlobal.set(true);
	messageHandleGlobal.set(null);

	try {
		let url = '/product/katalog';
		const params: string[] = [];

		if (searchNama) params.push(`nama=${encodeURIComponent(searchNama)}`);
		if (filterHarga) params.push(`filterharga=${encodeURIComponent(filterHarga)}`);
		if (filterRating) params.push(`filterrating=${encodeURIComponent(filterRating)}`);

		if (params.length > 0) url += `?${params.join('&')}`;

		console.log('URL final katalog:', url);

		const res = await api.get<{ message: string; result: Produk[] }>(url);
		produkCatalogStore.set(res.data.result ?? []);
		messageHandleGlobal.set({ type: 'success', message: res.data.message });
	} catch (err: unknown) {
		messageHandleGlobal.set({ type: 'error', message: errorHandler(err) });
		produkCatalogStore.set([]);
	} finally {
		loadingGlobal.set(false);
	}
}

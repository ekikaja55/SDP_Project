// src/lib/stores/transaksiStore.ts (Punya Ekik)
// ini handling  function dan reactive state untuk  handling TRANSAKSI

import {
	api,
	cartStore,
	errorHandler,
	type ApiResponse,
	type MessageState,
	type Transaksi,
	type TransaksiDTO
} from '$lib';
import { writable, type Writable } from 'svelte/store';

export const transaksiStore: Writable<Transaksi[]> = writable<Transaksi[]>([]);

export const loadingTrans: Writable<boolean> = writable(false);
export const messageHandleTrans: Writable<MessageState | null> = writable<MessageState | null>(
	null
);

// ADD TRANSAKSI
export async function addTransaksi(data: TransaksiDTO) {
	console.log("masuk add Transaksi");
  console.log("isi data : ",data);
  // return
  loadingTrans.set(true);
	messageHandleTrans.set(null);
	try {
		const formData = new FormData();
		formData.append('transaksi_grand_total', String(data.transaksi_grand_total ?? 0));
		formData.append('transaksi_detail', JSON.stringify(data.transaksi_detail ?? []));
		if (data.transaksi_img instanceof File) {
			formData.append('transaksi_img', data.transaksi_img);
		}

		const res = await api.post<ApiResponse<string>>('/transaction', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});

		messageHandleTrans.set({ type: 'success', message: res.data.message });
    cartStore.clear()
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
		transaksiStore.set([]);
	} finally {
		loadingTrans.set(false);
	}
}

// GET STATUS TRANSAKSI
export async function getStatusTransaksi(filterStatus?: string) {
	console.log('masuk getStatusTransaksi', filterStatus);
	loadingTrans.set(true);
	messageHandleTrans.set(null);

	try {
		const url = filterStatus
			? `/transaction/status?filterStatus=${encodeURIComponent(filterStatus)}`
			: '/transaction/status';

		const res = await api.get<ApiResponse<Transaksi[]>>(url);
		console.log('result:', res.data.result);

		messageHandleTrans.set({ type: 'success', message: res.data.message });
		transaksiStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
		transaksiStore.set([]);
	} finally {
		loadingTrans.set(false);
	}
}

export async function getHistoryTransaksi(filterStatus?: string) {
	console.log('masuk getStatusTransaksi', filterStatus);
	loadingTrans.set(true);
	messageHandleTrans.set(null);

	try {
		const url = filterStatus
			? `/transaction/histori?filterStatus=${encodeURIComponent(filterStatus)}`
			: '/transaction/histori';

		const res = await api.get<ApiResponse<Transaksi[]>>(url);
		console.log('result:', res.data.result);

		messageHandleTrans.set({ type: 'success', message: res.data.message });
		transaksiStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
		transaksiStore.set([]);
	} finally {
		loadingTrans.set(false);
	}
}

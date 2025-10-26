// src/lib/stores/transaksiStore.ts (Punya Ekik)
// ini handling  function dan reactive state untuk  handling TRANSAKSI

import {
	api,
	cartStore,
	errorHandler,
	type ApiResponse,
	type LaporanPenjualan,
	type MessageState,
	type QueryLaporan,
	type Transaksi,
	type TransaksiAdmin,
	type TransaksiDTO,
	type TransaksiUpdateDTO
} from '$lib';
import { writable, type Writable } from 'svelte/store';

export const loadingTrans: Writable<boolean> = writable(false);
export const messageHandleTrans: Writable<MessageState | null> = writable<MessageState | null>(
	null
);

export const optionQueryLaporan: QueryLaporan[] = [
	{ id: 'Bulan', isiFilter: 'filterbulan' },
	{ id: 'Tahun', isiFilter: 'filtertahun' }
];
export let dataUpdateTrans: TransaksiUpdateDTO = {
	transaksi_id: '',
	transaksi_status: ''
};

export const transaksiStore: Writable<Transaksi[]> = writable<Transaksi[]>([]);
export const transaksiAdminStore: Writable<TransaksiAdmin[]> = writable<TransaksiAdmin[]>([]);
export const laporanPenjualanStore: Writable<LaporanPenjualan[]> = writable<LaporanPenjualan[]>([]);
export let selectedQuery: Writable<string> = writable<string>('');

// WARNA STATUS
export function getStatusColorTrans(status: string) {
	switch (status) {
		case 'Belum Dikonfirmasi':
			return 'bg-gray-100 text-gray-700 border border-gray-200';
		case 'Pesanan Dibatalkan':
			return 'bg-red-100 text-red-700 border border-red-200';
		case 'Pesanan Sedang Diproses':
			return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
		case 'Pesanan Sedang Dalam Pengiriman':
			return 'bg-blue-100 text-blue-700 border border-blue-200';
		case 'Pesanan Selesai':
			return 'bg-green-100 text-green-700 border border-green-200';
		default:
			return 'bg-gray-100 text-gray-700 border border-gray-200';
	}
}

// ADD TRANSAKSI
export async function addTransaksi(data: TransaksiDTO) {
	console.log('masuk add Transaksi');
	console.log('isi data : ', data);
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
		cartStore.clear();
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

		const res = await api.get<ApiResponse<TransaksiAdmin[]>>(url);
		console.log('result:', res.data.result);

		// messageHandleTrans.set({ type: 'success', message: res.data.message });
		// transaksiStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
		transaksiStore.set([]);
	} finally {
		loadingTrans.set(false);
	}
}
// GET HISTORY TRANSAKSI
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

		// messageHandleTrans.set({ type: 'success', message: res.data.message });
		transaksiStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
		transaksiStore.set([]);
	} finally {
		loadingTrans.set(false);
	}
}

// GET ALL TRANSAKSI ADMIN
export async function getTransAdmin(filterStatus?: string) {
	console.log('masuk getTransAdmin', filterStatus);
	loadingTrans.set(true);
	messageHandleTrans.set(null);

	try {
		const url = filterStatus
			? `/transaction/all?filterStatus=${encodeURIComponent(filterStatus)}`
			: '/transaction/all';

		const res = await api.get<ApiResponse<TransaksiAdmin[]>>(url);
		console.log('result:', res.data.result);

		// messageHandleTrans.set({ type: 'success', message: res.data.message });
		transaksiAdminStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
		transaksiAdminStore.set([]);
	} finally {
		loadingTrans.set(false);
	}
}

// GET LAPORAN PENJUALAN
export async function getLaporanAdmin(query: string) {
	console.log('masuk getLaporanAdmin');
	console.log('getLaporanAdmin -> isi filter : ', query);
	loadingTrans.set(true);
	messageHandleTrans.set(null);
	try {
		const url = query
			? `/transaction/laporan?${encodeURIComponent(query)}`
			: '/transaction/laporan';

		console.log('isi url final :', url);
		const res = await api.get<ApiResponse<LaporanPenjualan[]>>(url);

		laporanPenjualanStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
	} finally {
		loadingTrans.set(false);
	}
}

// UPDATE STATUS TRANSAKSI
export async function updateTransaksi(data: TransaksiUpdateDTO) {
	console.log('masuk updateProduk()');
	console.log('data : ', data);
	if (!data.transaksi_status) {
		messageHandleTrans.set({ type: 'error', message: 'Harap isi status transaksi' });
		return;
	}
	loadingTrans.set(true);
	messageHandleTrans.set(null);
	try {
		const res = await api.put<ApiResponse<string>>(`/transaction/status/${data.transaksi_id}`, {
			...data
		});
		getTransAdmin();
		messageHandleTrans.set({ type: 'success', message: res.data.message });
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
	} finally {
		loadingTrans.set(false);
	}
}

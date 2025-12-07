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
export const oneTransaksiAdminStore: Writable<TransaksiAdmin|null> = writable<TransaksiAdmin|null>(null);
export const loadingTrans: Writable<boolean> = writable(false);
export const messageHandleTrans: Writable<MessageState | null> = writable<MessageState | null>(
	null
);
export const messageHandleCart: Writable<MessageState | null> = writable<MessageState | null>(null);

export async function getTransById(idUser:string = "",idTrans:string=""){
  console.log("fn getTransById -> masuk");
  console.log('fn getTransById -> idUser :',idUser);
  console.log('fn getTransById -> idUser :', idTrans);

  loadingTrans.set(false)
  try {
    const url = `/transaction/detail?iduser=${encodeURIComponent(idUser)}&idtrans=${encodeURIComponent(idTrans)}`
    console.log("isi url : ",url);

    const res= await api.get<ApiResponse<TransaksiAdmin>>(url)

    console.log('fn getTransById -> res :', res.data.result);
    oneTransaksiAdminStore.set(res.data.result)

  } catch (err:unknown) {
    console.log(errorHandler(err));

  }finally{
    loadingTrans.set(false)
  }
}

export async function addTransaksi(data: TransaksiDTO) {
	loadingTrans.set(true);
	messageHandleCart.set(null);
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

		messageHandleCart.set({ type: 'success', message: res.data.message });
		cartStore.clear();
	} catch (err: unknown) {
		messageHandleCart.set({ type: 'error', message: errorHandler(err) });
		transaksiStore.set([]);
	} finally {
		loadingTrans.set(false);
	}
}

export async function getStatusTransaksi(filterStatus?: string) {
	loadingTrans.set(true);
	messageHandleTrans.set(null);

	try {
		const url = filterStatus
			? `/transaction/status?filterStatus=${encodeURIComponent(filterStatus)}`
			: '/transaction/status';

		const res = await api.get<ApiResponse<TransaksiAdmin[]>>(url);

		transaksiStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
	} finally {
		loadingTrans.set(false);
	}
}

export async function getHistoryTransaksi(filterStatus?: string) {
	loadingTrans.set(true);
	messageHandleTrans.set(null);

	try {
		const url = filterStatus
			? `/transaction/histori?filterStatus=${encodeURIComponent(filterStatus)}`
			: '/transaction/histori';

		const res = await api.get<ApiResponse<Transaksi[]>>(url);

		transaksiStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
		transaksiStore.set([]);
	} finally {
		loadingTrans.set(false);
	}
}

export async function getTransAdmin(filterStatus?: string) {
	loadingTrans.set(true);
	messageHandleTrans.set(null);

	try {
		const url = filterStatus
			? `/transaction/all?filterStatus=${encodeURIComponent(filterStatus)}`
			: '/transaction/all';

		const res = await api.get<ApiResponse<TransaksiAdmin[]>>(url);

		transaksiAdminStore.set(res.data.result);

	} catch (err: unknown) {
    throw new Error(errorHandler(err));
  } finally {
		loadingTrans.set(false);
	}
}

export async function getLaporanAdmin(query: string) {
	loadingTrans.set(true);
	messageHandleTrans.set(null);
	try {
		const url = query
			? `/transaction/laporan?${encodeURIComponent(query)}`
			: '/transaction/laporan';

		const res = await api.get<ApiResponse<LaporanPenjualan[]>>(url);

		laporanPenjualanStore.set(res.data.result);
	} catch (err: unknown) {
		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
	} finally {
		loadingTrans.set(false);
	}
}

export async function updateTransaksi(data: TransaksiUpdateDTO,nama:string) {
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
    throw new Error(errorHandler(err));

		messageHandleTrans.set({ type: 'error', message: errorHandler(err) });
	} finally {
		loadingTrans.set(false);
	}
}

import { api, errorHandler, type ApiResponse, type MessageState, type Notifikasi } from '$lib';
import { writable, type Writable } from 'svelte/store';

export const notifikasiStoreAdmin: Writable<Notifikasi[] | null> = writable<Notifikasi[] | null>(
	[]
);
export const notifikasiStoreCust: Writable<Notifikasi[] | null> = writable<Notifikasi[] | null>([]);
export const loadingNotif: Writable<boolean> = writable<boolean>(false);
export const messageHandleNotif: Writable<MessageState | null> = writable<MessageState | null>(
	null
);
export const totalNotifStoreAdmin: Writable<number> = writable<number>(0);
export const totalNotifStoreCust: Writable<number> = writable<number>(0);

export async function getAllNotif() {
	loadingNotif.set(true);
	try {
		const res = await api.get<ApiResponse<Notifikasi[]>>('/notifikasi');
		notifikasiStoreAdmin.set(res.data.result);

		const totalCount = res.data.result.filter((obj) => {
			return obj.notifikasi_isread === 'false';
		});

		totalNotifStoreAdmin.set(totalCount.length);
	} catch (err: unknown) {
		throw new Error(errorHandler(err));
	} finally {
		loadingNotif.set(false);
	}
}

export async function getAllNotifCust() {
	loadingNotif.set(true);
	try {
		const res = await api.get<ApiResponse<Notifikasi[]>>('/notifikasi/cust');
		notifikasiStoreCust.set(res.data.result);

		const totalCount = res.data.result.filter((obj) => {
			return obj.notifikasi_isread === 'false';
		});

		totalNotifStoreCust.set(totalCount.length);
	} catch (err: unknown) {
		throw new Error(errorHandler(err));
	} finally {
		loadingNotif.set(false);
	}
}

export async function updateNotifById(id: string, role: string) {
	loadingNotif.set(true);
	try {
		const res = await api.put<ApiResponse<string>>(`/notifikasi/${id}`);
		console.log(res.data.message);
		if (role === 'admin') {
			getAllNotif();
			return;
		}
		getAllNotifCust();
	} catch (err: unknown) {
		throw new Error(errorHandler(err));
	} finally {
		loadingNotif.set(false);
	}
}

export async function updateAllNotif(role: string) {
	try {
		const res = await api.get<ApiResponse<string>>('/notifikasi/allread');
		if (role === 'admin') {
			getAllNotif();
			return;
		}
		getAllNotifCust();
	} catch (err: unknown) {
		throw new Error(errorHandler(err));
	} finally {
		loadingNotif.set(false);
	}
}

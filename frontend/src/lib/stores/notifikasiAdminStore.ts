import { api, errorHandler, type ApiResponse, type MessageState, type Notifikasi } from '$lib';
import { writable, type Writable } from 'svelte/store';

export const notifikasiStore: Writable<Notifikasi[] | null> = writable<Notifikasi[] | null>([]);
export const loadingNotif: Writable<boolean> = writable<boolean>(false);
export const messageHandleNotif: Writable<MessageState | null> = writable<MessageState | null>(
	null
);

export async function getAllNotif() {
	loadingNotif.set(true);
	try {
		const res = await api.get<ApiResponse<Notifikasi[]>>('/notifikasi');
		notifikasiStore.set(res.data.result);
	} catch (err: unknown) {
		console.log(errorHandler(err));
	} finally {
		loadingNotif.set(false);
	}
}

export async function updateNotifById(id: string) {
	loadingNotif.set(true);
	try {
		const res = await api.put<ApiResponse<string>>(`/notifikasi/${id}`);
		console.log(res.data.message);
    await getAllNotif()

	} catch (err: unknown) {
		console.log(errorHandler(err));
	}finally{
		loadingNotif.set(false);

  }
}

export async function updateAllNotif() {
	try {
		const res = await api.get<ApiResponse<string>>('/notifikasi/allread');
		console.log(res.data.message);
    await getAllNotif();
	} catch (err: unknown) {
		console.log(errorHandler(err));
	} finally {
		loadingNotif.set(false);
	}
}

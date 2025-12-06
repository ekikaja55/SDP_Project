import { writable, type Writable } from 'svelte/store';
import { api, errorHandler, type AnyLog, type ApiResponse, type LogFilter } from '$lib';

export const logStore: Writable<AnyLog[] | null> = writable(null);
export const loadingLog: Writable<boolean> = writable(false);



export async function getAllLog(filters: LogFilter = {}) {
	loadingLog.set(true);

	try {
		const res = await api.get<ApiResponse<AnyLog[]>>('/user/log', {
			params: filters
		});

		logStore.set(res.data.result);
	} catch (error) {
		console.error(errorHandler(error));
		logStore.set(null);
	} finally {
		loadingLog.set(false);
	}
}

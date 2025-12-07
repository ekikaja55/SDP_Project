// src/lib/utils/errorHandler.ts
import { AxiosError } from 'axios';

export function errorHandler(err: unknown): string {
	if (err instanceof AxiosError) {
		return (
			err.response?.data?.message || 'Terjadi kesalahan saat memproses permintaan (Axios Error).'
		);
	}
	if (err instanceof Error) {
		return err.message || 'Terjadi kesalahan umum pada aplikasi (JS Error).';
	}
	return 'Error tidak diketahui (Hubungi Pihak Developer)';
}

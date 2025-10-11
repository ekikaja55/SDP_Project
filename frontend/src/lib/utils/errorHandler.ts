// src/lib/utils/errorHandler.ts
import { AxiosError } from 'axios';

export function errorHandler(err: unknown): string {
	// cek apakah err ini dari axios? karena typenya unknown
	if (err instanceof AxiosError) {
		return (
			err.response?.data?.message || 'Terjadi kesalahan saat memproses permintaan (Axios Error).'
		);
	}
	// cek apakah err ini dari Error bawaan js? karena typenya unknown
	if (err instanceof Error) {
		return err.message || 'Terjadi kesalahan umum pada aplikasi (JS Error).';
	}
	// kalo ga lolos semua if diatas berarti error anomali
	return 'Error tidak diketahui (ANOMALI ALAMAK)';
}

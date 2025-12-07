// src/lib/stores/review/reviewRating.ts

import {
	api,
	errorHandler,
	type ApiResponse,
	type laporanReview,
	type MessageState,
	type ReviewCustomer,
	type ReviewDTO
} from '$lib';
import { writable, type Writable } from 'svelte/store';

export const reviewRatingStore: Writable<laporanReview[]> = writable<laporanReview[]>([]);
export const reviewCustStore: Writable<ReviewCustomer[]> = writable<ReviewCustomer[]>([]);
export const loadingReview: Writable<boolean> = writable<boolean>(false);
export const messageHandleReview: Writable<MessageState | null> = writable<MessageState | null>(
	null
);

export async function getReviewRatingCustomer() {
	loadingReview.set(false);
	messageHandleReview.set(null);
	try {
		loadingReview.set(true);
		const res = await api.get<ApiResponse<ReviewCustomer[]>>('/review');
		reviewCustStore.set(res.data.result);
	} catch (err: unknown) {
		throw new Error(errorHandler(err));
	} finally {
		loadingReview.set(false);
	}
}

export async function addReviewRatingCustomer(data: ReviewDTO) {
	loadingReview.set(false);
	messageHandleReview.set(null);
	try {
		loadingReview.set(true);
		const res = await api.post<ApiResponse<string>>('/review', { ...data });
		messageHandleReview.set({ type: 'success', message: res.data.message });
	} catch (err: unknown) {
		messageHandleReview.set({ type: 'error', message: errorHandler(err) });
	} finally {
		loadingReview.set(false);
	}
}

export async function getReviewRatingAdmin() {
	loadingReview.set(false);
	messageHandleReview.set(null);
	try {
		loadingReview.set(true);
		const res = await api.get<ApiResponse<laporanReview[]>>('/review/laporan');
		reviewRatingStore.set(res.data.result);
	} catch (err: unknown) {
		throw new Error(errorHandler(err));
	} finally {
		loadingReview.set(false);
	}
}

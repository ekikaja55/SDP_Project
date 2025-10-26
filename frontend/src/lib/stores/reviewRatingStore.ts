// src/lib/stores/review/reviewRating.ts

import {
	api,
	errorHandler,
	type ApiResponse,
	type MessageState,
	type Review,
	type ReviewCustomer,
	type ReviewDTO
} from '$lib';
import { writable, type Writable } from 'svelte/store';

export const reviewRatingStore: Writable<Review[]> = writable<Review[]>([]);
export const reviewCustStore: Writable<ReviewCustomer[]> = writable<ReviewCustomer[]>([]);
export const loadingReview: Writable<boolean> = writable<boolean>(false);
export const messageHandleReview: Writable<MessageState | null> = writable<MessageState | null>(
	null
);

// GET REVIEW & RATING UNTUK CUSTOMER
export async function getReviewRatingCustomer() {
	loadingReview.set(false);
	messageHandleReview.set(null);
	try {
		loadingReview.set(true);
		const res = await api.get<ApiResponse<ReviewCustomer[]>>('/review');
		reviewCustStore.set(res.data.result);
	} catch (err: unknown) {
		reviewCustStore.set([]);
	} finally {
		loadingReview.set(false);
	}
}

// ADD REVIEW & RATING UNTUK CUSTOMER
export async function addReviewRatingCustomer(data: ReviewDTO) {
	console.log('masuk');
	console.log('data : ', data);
	// return
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

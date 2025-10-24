<!-- src/lib/components/ReviewModal.svelte -->
<!-- ini component modal untuk handling inputan review -->
<script lang="ts">
	import type { ReviewDTO } from '$lib';

	export let visible = false;
	export let productName = '';

	// Callback props sebagai pengganti event
	export let onSubmit: (review: ReviewDTO) => void;
	export let onClose: () => void;

	let review: ReviewDTO = {
		produk_nama: '',
		review_rating: 0,
		review_isi: ''
	};

	function handleSubmit() {
		onSubmit?.({ ...review, produk_nama:productName });
		handleClose();
	}

	function handleClose() {
		onClose?.();
		review = { produk_nama: '', review_rating: 0, review_isi: '' };
	}
</script>

{#if visible}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
		<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-lg font-semibold text-gray-800">
				Beri Review untuk {productName}
			</h3>

			<div class="mb-3">
				<label class="mb-1 block text-sm font-medium text-gray-700">Rating (1-5)</label>
				<input
					type="number"
					min="1"
					max="5"
					bind:value={review.review_rating}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
					placeholder="Masukkan rating"
				/>
			</div>

			<div class="mb-4">
				<label class="mb-1 block text-sm font-medium text-gray-700">Ulasan</label>
				<textarea
					bind:value={review.review_isi}
					class="h-24 w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
					placeholder="Tulis ulasan Anda"
				></textarea>
			</div>

			<div class="flex justify-end gap-3">
				<button
					on:click={handleClose}
					class="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
				>
					Batal
				</button>

				<button
					on:click={handleSubmit}
					class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
				>
					Kirim Review
				</button>
			</div>
		</div>
	</div>
{/if}

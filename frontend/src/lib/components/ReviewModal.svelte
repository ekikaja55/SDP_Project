<!-- src/lib/components/ReviewModal.svelte -->
<script lang="ts">
	import type { ReviewDTO } from '$lib';
	import { fade, fly } from 'svelte/transition';
	import { Star, X } from '@lucide/svelte';

	export let visible = false;
	export let productName = '';

	export let onSubmit: (review: ReviewDTO) => void;
	export let onClose: () => void;

	let review: ReviewDTO = {
		produk_nama: '',
		review_rating: 0,
		review_isi: ''
	};

	function handleSubmit() {
		onSubmit?.({ ...review, produk_nama: productName });
		handleClose();
	}

	function handleClose() {
		onClose?.();
		review = { produk_nama: '', review_rating: 0, review_isi: '' };
	}
</script>

{#if visible}
	<div
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 150 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		on:click={handleClose}
	>
		<div
			in:fly={{ y: 30, duration: 200 }}
			out:fly={{ y: -20, duration: 150 }}
			on:click|stopPropagation
			class="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-2xl transition-all"
		>
			<!-- Tombol close -->
			<button
				on:click={handleClose}
				class="absolute right-3 top-3 rounded-full border border-zinc-300 bg-zinc-100 p-1.5 text-zinc-600 transition hover:bg-zinc-200"
			>
				<X class="h-4 w-4" />
			</button>

			<!-- Header -->
			<div class="mb-5 flex items-center gap-2 border-b border-zinc-200 pb-3">
				<Star class="h-5 w-5 text-zinc-700" />
				<h3 class="text-lg font-semibold text-zinc-800">
					Beri Review untuk <span class="text-zinc-800 font-extrabold">{productName}</span>
				</h3>
			</div>

			<!-- Input rating -->
			<div class="mb-4">
				<label class="mb-1 block text-sm font-medium text-zinc-700">Rating (1–5)</label>
				<input
					type="number"
					min="1"
					max="5"
					bind:value={review.review_rating}
					class="w-full rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-800 outline-none transition focus:border-zinc-400 focus:bg-zinc-50"
					placeholder="Masukkan rating"
				/>
			</div>

			<!-- Input ulasan -->
			<div class="mb-5">
				<label class="mb-1 block text-sm font-medium text-zinc-700">Ulasan</label>
				<textarea
					bind:value={review.review_isi}
					class="h-28 w-full resize-none rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-zinc-800 outline-none transition focus:border-zinc-400 focus:bg-zinc-50"
					placeholder="Tulis ulasan Anda di sini..."
				></textarea>
			</div>

			<!-- Tombol aksi -->
			<div class="flex justify-end gap-3">
				<button
					on:click={handleClose}
					class="rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
				>
					Batal
				</button>

				<button
					on:click={handleSubmit}
					class="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-50 transition hover:bg-zinc-700"
				>
					<Star class="h-4 w-4 text-zinc-200" />
					Kirim Review
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- src/routes/dashboard/customer/review_rating/+page.svelte -->
<script lang="ts">
	import {
		addReviewRatingCustomer,
		getReviewRatingCustomer,
		loadingReview,
		messageHandleReview,
		reviewCustStore,
		type ReviewDTO
	} from '$lib';
	import ReviewModal from '$lib/components/ReviewModal.svelte';
	import { onMount } from 'svelte';
	import NotificationModal from '$lib/components/NotificationModal.svelte';
	import { Star, MessageSquare } from '@lucide/svelte';

	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;
	let showModal = false;
	let selectedProduct = '';

	onMount(async () => {
		await getReviewRatingCustomer();
	});

	function openModal(productName: string) {
		selectedProduct = productName;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedProduct = '';
	}

	async function handleSubmitReview(data: ReviewDTO) {
		await addReviewRatingCustomer(data);
		closeModal();
	}
</script>

<h2 class="mb-6 flex items-center gap-2 text-3xl font-bold text-zinc-800">
	<span>Review & Rating</span>
</h2>

{#if $messageHandleReview}
	<NotificationModal
		message={$messageHandleReview.message}
		type={$messageHandleReview.type}
		onClose={() => messageHandleReview.set(null)}
	/>
{/if}

{#if $loadingReview}
	<div class="flex justify-center py-10">
		<div class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-400 border-t-transparent"></div>
	</div>
{:else if $reviewCustStore && $reviewCustStore.length > 0}
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each $reviewCustStore as item}
			<div
				class="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
			>
				<img
					src={`${BASE_URL}/uploads/${item.produk_gambar}`}
					alt={item.produk_nama}
					class="mb-3 h-44 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
				/>

				<h3 class="mb-2 text-lg font-semibold text-zinc-800">{item.produk_nama}</h3>
				<p class="text-sm text-zinc-500">Berikan ulasan jujur untuk membantu pelanggan lain.</p>

				<button
					on:click={() => openModal(item.produk_nama)}
					class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-400 bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200"
				>
					<MessageSquare class="h-4 w-4 text-zinc-600" />
					Beri Review
				</button>

				<div class="absolute inset-x-0 bottom-0 h-[3px] scale-x-0 bg-zinc-400 transition-transform duration-300 group-hover:scale-x-100"></div>
			</div>
		{/each}
	</div>

	<ReviewModal
		bind:visible={showModal}
		productName={selectedProduct}
		onSubmit={(data) => handleSubmitReview(data)}
		onClose={closeModal}
	/>
{:else}
	<p class="mt-10 text-center text-zinc-500">Tidak ada transaksi yang ditemukan.</p>
{/if}

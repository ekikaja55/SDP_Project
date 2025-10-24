<!--src/routes/dashboard/customer/review_rating/+page.svelte -->
<!-- halaman untuk review & rating  -->
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
	import NotificationModal from '../../../../lib/components/NotificationModal.svelte';

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
		console.log('Review dikirim:', data);
		await addReviewRatingCustomer(data);
		closeModal();
	}
</script>

<h2 class="mb-6 text-2xl font-semibold text-gray-800">Review & Rating Produk</h2>

{#if $messageHandleReview}
		<NotificationModal
			message={$messageHandleReview.message}
			type={$messageHandleReview.type}
			onClose={()=> messageHandleReview.set(null)}
		/>
{/if}
{#if $loadingReview}
	<div class="flex justify-center py-10">
		<div
			class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
		></div>
	</div>
{:else if $reviewCustStore && $reviewCustStore.length > 0}
	<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
		{#each $reviewCustStore as item}
			<div
				class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
			>
				<img
					src={`${BASE_URL}/uploads/${item.produk_gambar}`}
					alt={item.produk_nama}
					class="mb-3 h-40 w-full rounded-md object-cover"
				/>
				<h3 class="text-lg font-semibold text-gray-800">{item.produk_nama}</h3>

				<button
					on:click={() => openModal(item.produk_nama)}
					class="mt-3 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
				>
					Beri Review
				</button>
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
	<p class="mt-10 text-center text-gray-500">Tidak ada transaksi yang ditemukan</p>
{/if}

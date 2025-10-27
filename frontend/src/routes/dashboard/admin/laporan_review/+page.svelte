<!--src/routes/dashboard/admin/laporan_review/+page.svelte -->
<!-- halaman untuk laporan review rating customer -->
<script lang="ts">
	import { getReviewRatingAdmin, loadingReview, reviewRatingStore, type Review } from '$lib';
	import { onMount } from 'svelte';
	import ReviewDetail from '../../../../lib/components/ReviewDetail.svelte';
	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;
	let open: boolean = false;
	let reviewDetail: Review[] = [];

	onMount(() => {
		refreshReview();
	});

	async function refreshReview() {
		await getReviewRatingAdmin();
	}

	function openModal(param: Review[]) {
		console.log('isi param openModal : ', param);

		reviewDetail = param;
		open = true;
	}
</script>

<h1 class="mb-6 text-3xl font-bold text-gray-800">REVIEW DATA</h1>
{#if open}
	<ReviewDetail {reviewDetail} onClose={() => (open = false)} />
{/if}

{#if $loadingReview}
	<div class="flex justify-center py-10">
		<div
			class="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
		></div>
	</div>
{:else if $reviewRatingStore && $reviewRatingStore.length > 0}
	<div class="space-y-6">
		{#each $reviewRatingStore as item}
			<div
				class="group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all hover:border-blue-200 hover:shadow-lg"
			>
				<div class="flex flex-col items-start gap-5 p-5 md:flex-row md:items-center">
					<div class="relative flex-shrink-0">
						<img
							src={item.produk_gambar
								? `${BASE_URL}/uploads/${item.produk_gambar}`
								: '/no-image.png'}
							alt={item.produk_nama}
							class="h-28 w-28 rounded-xl border border-gray-200 object-cover shadow-sm"
						/>
					</div>

					<div class="flex-1">
						<h2 class="text-xl font-semibold text-gray-800">{item.produk_nama}</h2>
						<p class="mt-1 text-sm text-gray-500">
							Rata-rata Rating:
							<span class="font-medium text-yellow-600">
								{item.produk_avg_rating.toFixed(1)} ⭐
							</span>
						</p>
						<p class="mt-1 text-sm text-gray-400">
							{item.produk_review.length} review{item.produk_review.length === 1 ? '' : 's'}
						</p>
					</div>
					{#if item.produk_review.length > 0}
						<div class="mt-3 flex w-full md:mt-0 md:w-auto md:justify-end">
							<button
								on:click={() => openModal(item.produk_review)}
								class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.8"
									stroke="currentColor"
									class="h-4 w-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								Lihat Detail
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="mt-10 text-center text-gray-500">Tidak ada data review yang ditemukan.</p>
{/if}

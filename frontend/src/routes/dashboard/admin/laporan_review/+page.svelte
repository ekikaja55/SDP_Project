<script lang="ts">
	import { onMount } from 'svelte';
	import { Eye } from 'lucide-svelte';
	import { getReviewRatingAdmin, loadingReview, reviewRatingStore, type Review } from '$lib';
	import ReviewDetail from '../../../../lib/components/ReviewDetail.svelte';

	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;
	let open = false;
	let reviewDetail: Review[] = [];

	onMount(() => {
		refreshReview();
	});

	async function refreshReview() {
		await getReviewRatingAdmin();
	}

	function openModal(param: Review[]) {
		reviewDetail = param;
		open = true;
	}
</script>

<h1 class="mb-6 text-3xl font-bold text-zinc-800">Review Data</h1>

{#if open}
	<ReviewDetail {reviewDetail} onClose={() => (open = false)} />
{/if}

{#if $loadingReview}
	<div class="flex justify-center py-10">
		<div class="h-10 w-10 animate-spin rounded-full border-4 border-zinc-500 border-t-transparent"></div>
	</div>
{:else if $reviewRatingStore && $reviewRatingStore.length > 0}
	<!-- Grid 2 kolom -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each $reviewRatingStore as item}
			<div
				class="group overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-md transition-all hover:border-zinc-300 hover:shadow-lg"
			>
				<div class="flex flex-col items-start gap-5 p-5 md:flex-row md:items-center">
					<div class="relative flex-shrink-0">
						<img
							src={item.produk_gambar
								? `${BASE_URL}/uploads/${item.produk_gambar}`
								: '/no-image.png'}
							alt={item.produk_nama}
							class="h-28 w-28 rounded-xl border border-zinc-200 object-cover shadow-sm"
						/>
					</div>

					<div class="flex-1">
						<h2 class="text-xl font-semibold text-zinc-800">{item.produk_nama}</h2>
						<p class="mt-1 text-sm text-zinc-500">
							Rata-rata Rating:
							<span class="font-medium text-yellow-600">
								{item.produk_avg_rating.toFixed(1)} ⭐
							</span>
						</p>
						<p class="mt-1 text-sm text-zinc-400">
							{item.produk_review.length} review
							{item.produk_review.length === 1 ? '' : 's'}
						</p>
					</div>

					{#if item.produk_review.length > 0}
						<div class="mt-3 flex w-full md:mt-0 md:w-auto md:justify-end">
							<button
								on:click={() => openModal(item.produk_review)}
								class="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-400 bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-200 hover:text-zinc-900"
							>
								<Eye size="18" class="text-zinc-700" />
								Lihat Detail
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="mt-10 text-center text-zinc-500">Tidak ada data review yang ditemukan.</p>
{/if}

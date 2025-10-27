<script lang="ts">
	import type { Review } from '../types';

	export let reviewDetail:Review[];
	export let onClose: () => void;

	let visible = true;

  console.log("masuk modal :", reviewDetail);

	function handleClose() {
		visible = false;
		onClose?.();
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const tanggal = date.toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		const waktu = date.toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
		return `${tanggal} - ${waktu}`;
	}
</script>

{#if visible}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
		<div
			class="relative w-[90%] max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8"
		>
			<button
				class="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
				on:click={handleClose}
				aria-label="Close"
			>
				✕
			</button>

			<h2 class="mb-5 border-b pb-3 text-2xl font-bold text-gray-800">Daftar Review & Rating</h2>

			{#if reviewDetail && reviewDetail.length > 0}
				<div class="custom-scroll max-h-[70vh] space-y-4 overflow-y-auto pr-2">
					{#each reviewDetail as review}
						<div
							class="rounded-xl border border-gray-100 p-4 shadow-sm transition-all hover:shadow-md"
						>
							<div class="mb-2 flex items-center justify-between">
								<p class="font-semibold text-gray-800">{review.review_nama}</p>
								<p class="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
							</div>

							<p class="mb-2 text-sm leading-snug text-gray-700">{review.review_isi}</p>

							<div class="flex items-center gap-1">
								{#each Array(5) as _, i}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill={i < review.review_rating ? '#facc15' : '#e5e7eb'}
										class="h-5 w-5"
									>
										<path
											d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442a.563.563 0 01.32.986l-4.197 3.602a.563.563 0 00-.182.557l1.285 5.385a.563.563 0 01-.84.61l-4.724-2.885a.563.563 0 00-.586 0l-4.724 2.885a.563.563 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L2.042 10.383a.563.563 0 01.32-.986l5.518-.442a.563.563 0 00.475-.345L10.48 3.5z"
										/>
									</svg>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="py-10 text-center text-gray-500">Belum ada review untuk produk ini.</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.custom-scroll::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scroll::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 6px;
	}
	.custom-scroll::-webkit-scrollbar-thumb:hover {
		background-color: rgba(0, 0, 0, 0.3);
	}
</style>

<script lang="ts">
	import { getStatusTransaksi, loadingTrans, transaksiStore } from '$lib';
	import { onMount } from 'svelte';
	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

	let selectedStatus = '';

	const statusOptions = [
		'',
		'Belum Dikonfirmasi',
		'Pesanan Sedang Diproses',
		'Pesanan Sedang Dalam Pengiriman'
	];

	onMount(() => {
		refreshTransaksi();
	});

	async function refreshTransaksi() {
		await getStatusTransaksi(selectedStatus);
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'Belum Dikonfirmasi':
				return 'bg-gray-100 text-gray-700 border border-gray-200';
			case 'Pesanan Sedang Diproses':
				return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
			case 'Pesanan Sedang Dalam Pengiriman':
				return 'bg-blue-100 text-blue-700 border border-blue-200';
			default:
				return 'bg-gray-100 text-gray-700 border border-gray-200';
		}
	}
</script>

<h2 class="mb-4 text-2xl font-semibold text-gray-800">Transaction Status</h2>

<div class="mb-6 flex items-center justify-between">
	<label class="font-medium text-gray-700">Filter Status:</label>
	<select
		bind:value={selectedStatus}
		on:change={refreshTransaksi}
		class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
	>
		{#each statusOptions as option}
			<option value={option}>
				{option === '' ? 'Semua Status' : option}
			</option>
		{/each}
	</select>
</div>

{#if $loadingTrans}
	<div class="flex justify-center py-10">
		<div
			class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
		></div>
	</div>
{:else if $transaksiStore && $transaksiStore.length > 0}
	<div class="flex flex-col gap-6">
		{#each $transaksiStore as item}
			<div
				class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
			>
				<div class="flex flex-col md:flex-row md:gap-4">
					<div class="w-full space-y-3 md:w-3/4">
						<span
							class="max-w-full rounded-full border border-blue-200 bg-blue-500 px-3 py-2 text-sm font-bold text-white md:text-center"
						>
							id : {item.transaksi_id}
						</span>
						{#each item.transaksi_detail as produk}
							<div
								class="mt-3 flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
							>
								<img
									src={`${BASE_URL}/uploads/${produk.produk_gambar}`}
									alt={produk.detail_nama}
									class="h-16 w-16 flex-shrink-0 rounded-lg border object-cover"
								/>
								<div class="flex-grow">
									<span class="block font-medium text-gray-900">{produk.detail_nama}</span>
									<div class="flex gap-4 text-sm text-gray-600">
										<span>Qty: {produk.detail_stok}</span>
										<span>Harga: Rp {produk.produk_harga}</span>
									</div>
								</div>
								<div class="flex-shrink-0 text-right">
									<span class="text-sm text-gray-500">Subtotal</span>
									<p class="font-semibold text-blue-600">
										Rp {produk.detail_sub_total}
									</p>
								</div>
							</div>
						{/each}
					</div>

					<div
						class="mt-4 flex w-full flex-row items-center justify-between border-t pt-4 md:mt-0 md:w-1/4 md:flex-col md:items-end md:justify-between md:border-none md:pt-0"
					>
						<span
							class={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
								item.transaksi_status
							)}`}
						>
							{item.transaksi_status}
						</span>
						<div class="text-right">
							<span class="text-sm text-gray-500">Grand Total</span>
							<p class="text-lg font-semibold text-blue-600">
								Rp {item.transaksi_grand_total}
							</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="mt-10 text-center text-gray-500">Tidak ada produk ditemukan.</p>
{/if}

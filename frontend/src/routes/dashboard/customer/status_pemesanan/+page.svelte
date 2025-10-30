<script lang="ts">
	import { getStatusTransaksi, loadingTrans, transaksiStore } from '$lib';
	import { onMount } from 'svelte';
	import { Truck, PackageCheck, Clock } from '@lucide/svelte';
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
				return 'bg-zinc-100 text-zinc-700 border border-zinc-300';
			case 'Pesanan Sedang Diproses':
				return 'bg-amber-100 text-amber-700 border border-amber-300';
			case 'Pesanan Sedang Dalam Pengiriman':
				return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
			default:
				return 'bg-zinc-100 text-zinc-700 border border-zinc-300';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'Belum Dikonfirmasi':
				return Clock;
			case 'Pesanan Sedang Diproses':
				return PackageCheck;
			case 'Pesanan Sedang Dalam Pengiriman':
				return Truck;
			default:
				return Clock;
		}
	}
</script>

<h2 class="mb-6 text-3xl font-bold text-zinc-800">Transaction Status</h2>

<div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	<label class="font-medium text-zinc-700">Filter Status:</label>
	<select
		bind:value={selectedStatus}
		on:change={refreshTransaksi}
		class="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-400 transition-all"
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
		<div class="h-10 w-10 animate-spin rounded-full border-4 border-zinc-400 border-t-transparent"></div>
	</div>
{:else if $transaksiStore && $transaksiStore.length > 0}
	<div class="flex flex-col gap-8">
		{#each $transaksiStore as item}
			<div
				class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-md transition-all hover:shadow-lg hover:border-zinc-300"
			>
				<div class="flex flex-col md:flex-row md:gap-6">
					<div class="w-full space-y-4 md:w-3/4">
						<span
							class="inline-block rounded-full bg-zinc-200 px-4 py-1.5 text-sm font-semibold text-zinc-800 tracking-wide"
						>
							ID Transaksi: {item.transaksi_id}
						</span>

						{#each item.transaksi_detail as produk}
							<div
								class="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-100 p-4 transition hover:bg-zinc-200"
							>
								<img
									src={`${BASE_URL}/uploads/${produk.produk_gambar}`}
									alt={produk.detail_nama}
									class="h-16 w-16 flex-shrink-0 rounded-lg border border-zinc-300 object-cover shadow-sm"
								/>
								<div class="flex-grow">
									<span class="block font-medium text-zinc-800">{produk.detail_nama}</span>
									<div class="flex gap-6 text-sm text-zinc-600">
										<span>Qty: {produk.detail_stok}</span>
										<span>Harga: Rp {produk.produk_harga}</span>
									</div>
								</div>
								<div class="flex-shrink-0 text-right">
									<span class="text-sm text-zinc-500">Subtotal</span>
									<p class="font-semibold text-zinc-800">Rp {produk.detail_sub_total}</p>
								</div>
							</div>
						{/each}
					</div>

					<!-- Status & Total -->
					<div
						class="mt-6 flex w-full flex-row items-center justify-between border-t border-zinc-200 pt-4 md:mt-0 md:w-1/4 md:flex-col md:items-end md:justify-between md:border-none md:pt-0"
					>
						{#key item.transaksi_status}
							{@const Icon = getStatusIcon(item.transaksi_status)}
							<span
								class={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${getStatusColor(
									item.transaksi_status
								)}`}
							>
								<Icon size="16" class="text-current" />
								{item.transaksi_status}
							</span>
						{/key}

						<div class="text-right mt-4 md:mt-0">
							<span class="text-sm text-zinc-500">Grand Total</span>
							<p class="text-lg font-semibold text-zinc-800">
								Rp {item.transaksi_grand_total}
							</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="mt-10 text-center text-zinc-500">Tidak ada produk ditemukan.</p>
{/if}

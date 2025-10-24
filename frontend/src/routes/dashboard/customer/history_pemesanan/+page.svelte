<!--src/routes/dashboard/customer/history_pemesanan/+page.svelte -->
<!-- halaman untuk cek history pemesanan (customer)  -->
<script lang="ts">
	import { getHistoryTransaksi, loadingTrans, transaksiStore } from '$lib';
	import { onMount } from 'svelte';
	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

	let selectedStatus = '';

	const statusOptions = [
		'',
		'Belum Dikonfirmasi',
		'Pesanan Dibatalkan',
		'Pesanan Sedang Diproses',
		'Pesanan Sedang Dalam Pengiriman',
		'Pesanan Selesai'
	];

	onMount(() => {
		refreshTransaksi();
	});

	async function refreshTransaksi() {
		await getHistoryTransaksi(selectedStatus);
	}

	function generateId(index: number) {
		const temp = index.toString().padStart(3, '000');
		return `T-${temp}`;
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'Belum Dikonfirmasi':
				return 'bg-gray-100 text-gray-700 border border-gray-200';
			case 'Pesanan Dibatalkan':
				return 'bg-red-100 text-red-700 border border-red-200';
			case 'Pesanan Sedang Diproses':
				return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
			case 'Pesanan Sedang Dalam Pengiriman':
				return 'bg-blue-100 text-blue-700 border border-blue-200';
			case 'Pesanan Selesai':
				return 'bg-green-100 text-green-700 border border-green-200';
			default:
				return 'bg-gray-100 text-gray-700 border border-gray-200';
		}
	}
</script>

<h2 class="mb-4 text-2xl font-semibold text-gray-800">Status Pemesanan</h2>

<!-- Filter Dropdown -->
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
		{#each $transaksiStore as item, index}
			<div
				class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
			>
				<div class="mb-3 flex items-center justify-between">
					<h3 class="text-lg font-semibold text-gray-800">{generateId(index + 1)}</h3>
					<span
						class={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(item.transaksi_status)}`}
					>
						{item.transaksi_status}
					</span>
				</div>

				<p class="mb-4 text-gray-700">
					<span class="font-medium">Grand Total:</span>
					<span class="ml-1 font-semibold text-blue-600">Rp {item.transaksi_grand_total}</span>
				</p>

				<div class="space-y-3">
					<p class="font-semibold text-gray-800">Detail Pesanan:</p>
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
						{#each item.transaksi_detail as produk}
							<div
								class="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:bg-gray-100"
							>
								<img
									src={`${BASE_URL}/uploads/${produk.produk_gambar}`}
									alt={produk.detail_nama}
									class="h-16 w-16 rounded-lg border object-cover"
								/>
								<div class="flex flex-col text-sm text-gray-700">
									<span class="font-medium text-gray-900">{produk.detail_nama}</span>
									<span>Harga: Rp {produk.produk_harga}</span>
									<span>Qty: {produk.detail_stok}</span>
									<span class="font-semibold text-blue-600"
										>Subtotal: Rp {produk.detail_sub_total}</span
									>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="mt-10 text-center text-gray-500">Tidak ada produk ditemukan.</p>
{/if}

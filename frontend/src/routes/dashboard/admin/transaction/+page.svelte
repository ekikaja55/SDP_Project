<!-- src/routes/dashboard/admin/transaction/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		dataUpdateTrans,
		getStatusColorTrans,
		getTransAdmin,
		loadingTrans,
		messageHandleTrans,
		transaksiAdminStore,
		updateTransaksi
	} from '$lib';
	import BuktiModal from '$lib/components/BuktiModal.svelte';
	import NotificationModal from '$lib/components/NotificationModal.svelte';
	import { Eye, RefreshCcw, FileSpreadsheet, Upload, ArrowUpRight } from 'lucide-svelte';

	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;
	let url = '';
	let open = false;
	let selectedStatus = '';

	const statusOptions = [
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
		await getTransAdmin(selectedStatus);
	}

	async function handleSubmit(transaksi_id: string) {
		dataUpdateTrans.transaksi_id = transaksi_id;
		await updateTransaksi(dataUpdateTrans);
	}
</script>

<h2 class="text-3xl font-bold tracking-tight text-zinc-800">Manage Transaction</h2>

{#if open}
	<BuktiModal onClose={() => (open = false)} img={url} />
{/if}

{#if $messageHandleTrans}
	<NotificationModal
		message={$messageHandleTrans.message}
		type={$messageHandleTrans.type}
		onClose={() => messageHandleTrans.set(null)}
	/>
{/if}

<!-- Filter -->
<div class="mb-8 flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
	<div class="flex items-center gap-4">
		<label class="font-medium text-zinc-700">Filter Status:</label>
		<select
			bind:value={selectedStatus}
			on:change={refreshTransaksi}
			class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
		>
			<option value="">Semua Status</option>
			{#each statusOptions as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	</div>

	<div class="flex gap-3">
		<button
			on:click={() => {
				selectedStatus = '';
				refreshTransaksi();
			}}
			class="flex items-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-300"
		>
			<RefreshCcw class="h-4 w-4" />
			Reset Filter
		</button>

		<button
			on:click={() => goto('laporan_penjualan')}
			class="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-700"
		>
			<FileSpreadsheet class="h-4 w-4" />
			Lihat Rekap Penjualan
		</button>
	</div>
</div>

<!-- Data Transaksi -->
{#if $loadingTrans}
	<div class="flex justify-center py-10">
		<div class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent"></div>
	</div>
{:else if $transaksiAdminStore && $transaksiAdminStore.length > 0}
	<div class="flex flex-col gap-6">
		{#each $transaksiAdminStore as item}
			<div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md">
				<!-- Header Transaksi -->
				<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
					<div>
						<p class="text-sm text-zinc-700">
							<span class="font-medium">ID Transaksi:</span>
							<span class="ml-1 font-semibold text-zinc-900">{item.transaksi_id}</span>
						</p>
						<p class="text-sm text-zinc-700">
							<span class="font-medium">Tanggal Dibuat:</span>
							<span class="ml-1 text-zinc-800">
								{new Date(item.createdAt).toLocaleString('en-GB', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: false
								})}
							</span>
						</p>
						<p class="text-sm text-zinc-700">
							<span class="font-medium">Nama:</span>
							<span class="ml-1 font-semibold text-zinc-900">{item.user_nama}</span>
						</p>
						<p class="text-sm text-zinc-700">
							<span class="font-medium">User ID:</span>
							<span class="ml-1 text-zinc-500">{item.user_id}</span>
						</p>
					</div>
					<span
						class={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColorTrans(item.transaksi_status)}`}
					>
						{item.transaksi_status}
					</span>
				</div>

				<!-- Total -->
				<p class="mb-4 text-zinc-700">
					<span class="font-medium">Grand Total:</span>
					<span class="ml-1 font-semibold text-zinc-900">Rp {item.transaksi_grand_total}</span>
				</p>

				<!-- Detail Pesanan -->
				<div class="space-y-3">
					<p class="font-semibold text-zinc-800">Detail Pesanan:</p>
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
						{#each item.transaksi_detail as produk}
							<div
								class="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 transition hover:bg-zinc-100"
							>
								<img
									src={`${BASE_URL}/uploads/${produk.produk_gambar}`}
									alt={produk.detail_nama}
									class="h-16 w-16 rounded-lg border object-cover"
								/>
								<div class="flex flex-col text-sm text-zinc-700">
									<span class="font-medium text-zinc-900">{produk.detail_nama}</span>
									<span>Harga: Rp {produk.produk_harga}</span>
									<span>Qty: {produk.detail_stok}</span>
									<span class="font-semibold text-zinc-800">
										Subtotal: Rp {produk.detail_sub_total}
									</span>
								</div>
							</div>
						{/each}
					</div>

					<button
						class="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-700"
						on:click={() => {
							url = `${BASE_URL}/uploads/${item.transaksi_img}`;
							open = true;
						}}
					>
						<Eye class="h-4 w-4" />
						Lihat Bukti Pembayaran
					</button>
				</div>

				<!-- Update Status -->
				<div class="mt-6 border-t border-zinc-200 pt-4">
					<form
						on:submit|preventDefault={() => handleSubmit(item.transaksi_id)}
						class="flex flex-wrap items-center gap-3"
					>
						<label class="text-sm font-medium text-zinc-700">Ubah Status:</label>
						<select
							bind:value={dataUpdateTrans.transaksi_status}
							class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
						>
							<option value="" disabled selected>Pilih Status Baru</option>
							{#each statusOptions.filter((s) => s !== 'Belum Dikonfirmasi') as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						<button
							type="submit"
							class="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-700"
						>
							<ArrowUpRight class="h-4 w-4" />
							Update
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="mt-10 text-center text-zinc-500">Tidak ada transaksi ditemukan.</p>
{/if}

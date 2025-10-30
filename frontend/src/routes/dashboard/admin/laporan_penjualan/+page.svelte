<!-- src/routes/dashboard/admin/laporan_penjualan/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		getLaporanAdmin,
		loadingTrans,
		optionQueryLaporan,
		selectedQuery,
		laporanPenjualanStore,
		type LaporanPenjualan
	} from '$lib';
	import DetailTransModal from '$lib/components/DetailTransModal.svelte';
	import { ArrowLeft, RefreshCcw, BarChart3, Eye } from '@lucide/svelte';

	let showModal: boolean = false;
	let data: LaporanPenjualan | null = null;

	onMount(async () => {
		await refreshLaporan();
	});

	async function refreshLaporan() {
		await getLaporanAdmin($selectedQuery);
	}

	function openDetail(laporan: any) {
		data = laporan;
		showModal = true;
	}
</script>

<h2 class="mb-6 text-3xl font-bold text-zinc-800">Business Recap</h2>

<div class="flex flex-col gap-6">
	<!-- Tombol Kembali -->
	<button
		on:click={() => goto('transaction')}
		class="flex w-fit items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-700"
	>
		<ArrowLeft class="h-4 w-4" />
		Kembali
	</button>

	<!-- FILTER -->
	<div
		class="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm"
	>
		<div class="flex items-center gap-3">
			<label class="font-medium text-zinc-700">Filter Data:</label>
			<select
				bind:value={$selectedQuery}
				on:change={refreshLaporan}
				class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
			>
				{#each optionQueryLaporan as option}
					<option value={option.isiFilter}>{option.id}</option>
				{/each}
			</select>
		</div>

		<div class="flex gap-3">
			<button
				on:click={() => {
					selectedQuery.set('');
					refreshLaporan();
				}}
				class="flex items-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-300"
			>
				<RefreshCcw class="h-4 w-4" />
				Reset Filter
			</button>


		</div>
	</div>

	<!-- LOADING -->
	{#if $loadingTrans}
		<div class="flex justify-center py-10">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent"></div>
		</div>
	{/if}

	<!-- DATA -->
	{#if !$loadingTrans && $laporanPenjualanStore && $laporanPenjualanStore.length > 0}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each $laporanPenjualanStore as laporan}
				<div
					class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
				>
					<h3 class="mb-2 text-lg font-semibold text-zinc-900">{laporan.nama_user}</h3>
					<p class="mb-1 text-sm text-zinc-500">ID User: {laporan.id}</p>
					<p class="text-sm text-zinc-700">
						Total Transaksi:
						<span class="font-semibold text-zinc-900">
							Rp {laporan.transaksi_total.toLocaleString()}
						</span>
					</p>
					<p class="mb-4 text-sm text-zinc-700">
						Jumlah Transaksi:
						<span class="font-semibold text-zinc-900">{laporan.transaksi_count}</span>
					</p>

					<div class="mb-4 border-t border-zinc-200 pt-4">
						<h4 class="mb-2 font-medium text-zinc-800">Transaksi Terbesar</h4>
						<p class="text-sm text-zinc-700">
							ID:
							<span class="font-mono text-zinc-900">{laporan.transaksi_largest.transaksi_id}</span>
						</p>
						<p class="text-sm text-zinc-700">
							Nominal:
							<span class="font-semibold text-green-700">
								Rp {laporan.transaksi_largest.transaksi_grand_total.toLocaleString()}
							</span>
						</p>
						<p class="mb-3 text-sm text-zinc-500">
							Tanggal: {new Date(laporan.transaksi_largest.createdAt).toLocaleString('id-ID')}
						</p>
					</div>

					<button
						on:click={() => openDetail(laporan)}
						class="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-700"
					>
						<Eye class="h-4 w-4" />
						Lihat Detail Transaksi
					</button>
				</div>
			{/each}
		</div>

		<!-- Modal -->
		{#if showModal && data}
			<DetailTransModal data={data} onClose={() => (showModal = false)} />
		{/if}
	{:else if !$loadingTrans}
		<p class="mt-10 text-center text-zinc-500">Tidak ada laporan ditemukan.</p>
	{/if}
</div>

  <!--src/routes/dashboard/admin/laporan_penjualan/+page.svelte -->
  <!-- halaman laporan penjualan  admin-->
 <script lang="ts">
	import { goto } from '$app/navigation';
	import {
		getLaporanAdmin,
		loadingTrans,
		optionQueryLaporan,
		selectedQuery,
		laporanPenjualanStore,

		type LaporanPenjualan

	} from '$lib';
	import { onMount } from 'svelte';
	import DetailTransModal from '../../../../lib/components/DetailTransModal.svelte';

	let showModal:boolean = false;
	let data:LaporanPenjualan|null = null;

	onMount(async () => {
		await refreshLaporan();
	});

	async function refreshLaporan() {
		await getLaporanAdmin($selectedQuery);
	}

	function openDetail(laporan:any) {
		data = laporan;
		showModal = true;
	}


</script>

<h2 class="mb-6 text-2xl font-semibold text-gray-800">BUSINESS RECAP</h2>

<div class="flex flex-col gap-6">
	<button
		on:click={() => goto('transaction')}
		class="mb-4 w-20 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-200"
	>
		Kembali
	</button>

	<!-- FILTER -->
	<div class="flex items-center gap-4 mb-6">
		<label class="font-medium text-gray-700">Filter Status:</label>
		<select
			bind:value={$selectedQuery}
			on:change={refreshLaporan}
			class="w-30 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			{#each optionQueryLaporan as option}
				<option value={option.isiFilter}>{option.id}</option>
			{/each}
		</select>

		<button
			on:click={() => {
				selectedQuery.set('');
				refreshLaporan();
			}}
			class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
		>
			Reset Filter
		</button>
	</div>

	<!-- LOADING -->
	{#if $loadingTrans}
		<div class="flex justify-center py-10">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
		</div>
	{/if}

	<!-- DATA -->
	{#if !$loadingTrans && $laporanPenjualanStore && $laporanPenjualanStore.length > 0}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each $laporanPenjualanStore as laporan}
				<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
					<h3 class="text-lg font-semibold text-gray-800 mb-2">{laporan.nama_user}</h3>
					<p class="text-sm text-gray-500 mb-1">ID User: {laporan.id}</p>
					<p class="text-sm text-gray-700">
						Total Transaksi:
						<span class="font-semibold text-blue-600">Rp {laporan.transaksi_total.toLocaleString()}</span>
					</p>
					<p class="text-sm text-gray-700 mb-4">
						Jumlah Transaksi: <span class="font-semibold">{laporan.transaksi_count}</span>
					</p>

					<div class="border-t pt-4 mb-4">
						<h4 class="font-medium text-gray-800 mb-2">Transaksi Terbesar</h4>
						<p class="text-sm text-gray-700">
							ID: <span class="font-mono">{laporan.transaksi_largest.transaksi_id}</span>
						</p>
						<p class="text-sm text-gray-700">
							Nominal:
							<span class="font-semibold text-green-600">
								Rp {laporan.transaksi_largest.transaksi_grand_total.toLocaleString()}
							</span>
						</p>
						<p class="text-sm text-gray-500 mb-3">
							Tanggal: {new Date(laporan.transaksi_largest.createdAt).toLocaleString('id-ID')}
						</p>
					</div>

					<!-- Tombol Detail -->
					<button
						on:click={() => openDetail(laporan)}
						class="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
					>
						Lihat Detail Transaksi
					</button>
				</div>
			{/each}
		</div>

		<!-- Modal -->
		{#if showModal && data}
			<DetailTransModal data={data} onClose={() => showModal = false} />
		{/if}
	{:else if !$loadingTrans}
		<p class="mt-10 text-center text-gray-500">Tidak ada laporan ditemukan.</p>
	{/if}
</div>

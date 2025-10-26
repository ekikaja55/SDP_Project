<script lang="ts">
	import type { LaporanPenjualan } from '../types';

	export let data: LaporanPenjualan;
	export let onClose: () => void;
	let visible = true;

	console.log(data);

	function handleClose() {
		visible = false;
		onClose?.();
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
	<div
		class="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
	>
		<h2 class="mb-4 text-xl font-semibold text-gray-800">Detail Transaksi - {data.nama_user}</h2>

		<button class="absolute right-3 top-3 text-gray-500 hover:text-gray-700" on:click={handleClose}>
			✕
		</button>
		{#if data.transaksi_largest.detail.length >= 0}
			<!-- {#each data as item}{/each} -->
			<table class="w-full border-collapse text-sm">
				<thead>
					<tr class="bg-gray-50 text-gray-600">
						<th class="border px-2 py-1 text-left">Nama Barang</th>
						<th class="border px-2 py-1 text-center">Qty</th>
						<th class="border px-2 py-1 text-right">Subtotal</th>
					</tr>
				</thead>
				{#each data.transaksi_largest.detail as d}
					<tr class="hover:bg-gray-50">
						<td class="border px-2 py-1">{d.detail_nama}</td>
						<td class="border px-2 py-1 text-center">{d.detail_stok}</td>
						<td class="border px-2 py-1 text-right">Rp {d.detail_sub_total.toLocaleString()}</td>
					</tr>
				{/each}
			</table>
		{:else}
			<p class="text-gray-500">Tidak ada transaksi ditemukan.</p>
		{/if}
	</div>
</div>

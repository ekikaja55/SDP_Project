<script lang="ts">
	import { X } from '@lucide/svelte';
	import type { LaporanPenjualan } from '../types';

	export let data: LaporanPenjualan;
	export let onClose: () => void;
	let visible = true;

	function handleClose() {
		visible = false;
		onClose?.();
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/70 backdrop-blur-sm">
	<div
		class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-50 p-6 shadow-2xl border border-zinc-200"
	>
		<!-- HEADER -->
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-2xl font-semibold text-zinc-800">
				Detail Transaksi – {data.nama_user}
			</h2>

			<button
				on:click={handleClose}
				class="rounded-full p-2 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 transition"
				aria-label="Tutup"
			>
				<X size="20" />
			</button>
		</div>

		<!-- INFO TRANSAKSI -->
		<div class="mb-6 text-sm text-zinc-600 space-y-1">
			<p><span class="font-medium text-zinc-700">ID Transaksi:</span> {data.transaksi_largest.transaksi_id}</p>
			<p><span class="font-medium text-zinc-700">Tanggal:</span> {new Date(data.transaksi_largest.createdAt).toLocaleString('id-ID')}</p>
			<p>
				<span class="font-medium text-zinc-700">Total:</span>
				<span class="text-zinc-900 font-semibold">
					Rp {data.transaksi_largest.transaksi_grand_total.toLocaleString()}
				</span>
			</p>
		</div>

		<!-- DETAIL BARANG -->
		{#if data.transaksi_largest.detail.length > 0}
			<div class="overflow-hidden rounded-xl border border-zinc-200 shadow-sm bg-white">
				<table class="w-full text-sm">
					<thead class="bg-zinc-100 text-zinc-700">
						<tr>
							<th class="px-4 py-2 text-left font-medium">Nama Barang</th>
							<th class="px-4 py-2 text-center font-medium">Qty</th>
							<th class="px-4 py-2 text-right font-medium">Subtotal</th>
						</tr>
					</thead>
					<tbody>
						{#each data.transaksi_largest.detail as d}
							<tr class="border-t border-zinc-200 hover:bg-zinc-50 transition">
								<td class="px-4 py-2">{d.detail_nama}</td>
								<td class="px-4 py-2 text-center">{d.detail_stok}</td>
								<td class="px-4 py-2 text-right">
									Rp {d.detail_sub_total.toLocaleString()}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="text-center text-zinc-500 mt-6">Tidak ada transaksi ditemukan.</p>
		{/if}


	</div>
</div>

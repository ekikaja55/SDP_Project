<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { getHistoryTransaksi, loadingTrans, transaksiStore, type UserAuth } from '$lib';
	import {
		Ban,
		Calendar,
		CheckCircle2,
		ChevronRight,
		Clock,
		Filter,
		PackageCheck,
		Receipt,
		Truck
	} from '@lucide/svelte';
	import { jwtDecode } from 'jwt-decode';
	import { onMount } from 'svelte';
	import Whatsapp from '../../../../lib/components/Whatsapp.svelte';

	let selectedStatus = '';

	let user: UserAuth | null = null;

	if (browser) {
		const token = localStorage.getItem('token');
		if (token) {
			try {
				user = jwtDecode(token);
			} catch {
				localStorage.removeItem('token');
				user = null;
			}
		}
	}

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

	function getStatusColor(status: string) {
		switch (status) {
			case 'Belum Dikonfirmasi':
				return 'bg-zinc-100 text-zinc-600 border-zinc-200';
			case 'Pesanan Dibatalkan':
				return 'bg-rose-50 text-rose-600 border-rose-200';
			case 'Pesanan Sedang Diproses':
				return 'bg-blue-50 text-blue-600 border-blue-200';
			case 'Pesanan Sedang Dalam Pengiriman':
				return 'bg-amber-50 text-amber-600 border-amber-200';
			case 'Pesanan Selesai':
				return 'bg-emerald-50 text-emerald-600 border-emerald-200';
			default:
				return 'bg-zinc-100 text-zinc-600 border-zinc-200';
		}
	}

	function getStatusIcon(status: string) {
		switch (status) {
			case 'Belum Dikonfirmasi':
				return Clock;
			case 'Pesanan Dibatalkan':
				return Ban;
			case 'Pesanan Sedang Diproses':
				return PackageCheck;
			case 'Pesanan Sedang Dalam Pengiriman':
				return Truck;
			case 'Pesanan Selesai':
				return CheckCircle2;
			default:
				return Clock;
		}
	}

	const formatRupiah = (number: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(number);
	};
</script>

<div class="min-h-screen space-y-6 pb-20">
	<div class="flex flex-col gap-4 border-b border-zinc-200 pb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-zinc-800">History Transaction</h1>
				<p class="mt-1 text-sm text-zinc-500">Daftar riwayat belanja Anda.</p>
			</div>
			<div class="hidden sm:block">
				<Whatsapp />
			</div>
		</div>
		<div class="sm:hidden">
			<Whatsapp />
		</div>
	</div>

	<div
		class="custom-scroll relative max-h-[75vh] overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-sm"
	>
		<div
			class="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-100 bg-white/95 px-5 py-4 backdrop-blur-sm"
		>
			<div class="flex items-center gap-2 text-zinc-600">
				<Filter class="h-4 w-4" />
				<span class="text-sm font-semibold">Filter Status</span>
			</div>

			<select
				bind:value={selectedStatus}
				on:change={refreshTransaksi}
				class="cursor-pointer rounded-lg border-zinc-200 bg-zinc-50 py-1.5 pr-8 pl-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus:border-zinc-400 focus:ring-0"
			>
				<option value="">Semua Riwayat</option>
				{#each statusOptions.slice(1) as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</div>

		<div class="p-2">
			{#if $loadingTrans}
				<div class="flex flex-col items-center justify-center py-20">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800"
					></div>
					<p class="mt-4 text-sm text-zinc-500">Memuat riwayat...</p>
				</div>
			{:else if $transaksiStore && $transaksiStore.length > 0}
				<div class="flex flex-col gap-2">
					{#each $transaksiStore as item}
						<div
							class="group relative flex flex-col gap-4 rounded-xl border border-zinc-100 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
						>
							<div class="flex items-start gap-4">
								<div
									class={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${getStatusColor(item.transaksi_status)}`}
								>
									<svelte:component this={getStatusIcon(item.transaksi_status)} class="h-5 w-5" />
								</div>

								<div>
									<div class="mb-1 flex items-center gap-2">
										<span class="text-base font-bold text-zinc-800">{item.transaksi_id}</span>
										<span
											class={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold sm:hidden ${getStatusColor(item.transaksi_status)}`}
										>
											{item.transaksi_status}
										</span>
									</div>

									<div class="flex items-center gap-4 text-sm text-zinc-500">
										<div class="flex items-center gap-1.5">
											<Calendar class="h-3.5 w-3.5" />
											{new Date(item.createdAt).toLocaleDateString('id-ID', {
												day: 'numeric',
												month: 'short',
												year: 'numeric'
											})}
										</div>
										<div class="h-1 w-1 rounded-full bg-zinc-300"></div>
										<div class="font-medium text-zinc-900">
											{formatRupiah(item.transaksi_grand_total)}
										</div>
									</div>
								</div>
							</div>

							<div
								class="mt-2 flex items-center justify-between border-t border-zinc-100 pt-3 sm:mt-0 sm:justify-end sm:gap-6 sm:border-t-0 sm:pt-0"
							>
								<div class="hidden text-right sm:block">
									<span
										class={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(item.transaksi_status)}`}
									>
										{item.transaksi_status}
									</span>
								</div>

								<button
									on:click={() =>
										goto(`/dashboard/customer/history_pemesanan/${user?.id}/${item.transaksi_id}`)}
									class="flex items-center gap-1 text-sm font-semibold text-indigo-600 decoration-2 underline-offset-4 transition hover:text-indigo-700 hover:underline"
								>
									Lihat Detail <ChevronRight class="h-4 w-4" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-24 text-center">
					<div class="mb-4 rounded-full bg-zinc-50 p-6 ring-1 ring-zinc-100">
						<Receipt class="h-10 w-10 text-zinc-300" />
					</div>
					<h3 class="text-lg font-bold text-zinc-800">Belum ada pesanan</h3>
					<p class="mt-1 max-w-xs text-sm text-zinc-500">
						Mulai belanja sekarang dan riwayat pesananmu akan muncul di sini.
					</p>
					<a
						href="/"
						class="mt-6 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800"
					>
						Mulai Belanja
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Custom Scrollbar */
	.custom-scroll::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scroll::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scroll::-webkit-scrollbar-thumb {
		background-color: #d4d4d8;
		border-radius: 20px;
	}
	.custom-scroll::-webkit-scrollbar-thumb:hover {
		background-color: #a1a1aa;
	}
</style>

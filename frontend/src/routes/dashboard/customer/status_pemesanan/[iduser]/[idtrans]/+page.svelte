<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getTransById, loadingTrans, oneTransaksiAdminStore } from '$lib';
	import BuktiModal from '$lib/components/BuktiModal.svelte';

	import {
		ArrowLeft,
		Check,
		Clock,
		Package,
		Truck,
		CheckCircle2,
		Receipt,
		User,
		X,
		CreditCard,
		ShoppingBag,
		Eye,
		Copy,
		ShieldCheck
	} from '@lucide/svelte';

	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

	let showBuktiModal = false;

	$: idUser = $page.params.iduser;
	$: idTrans = $page.params.idtrans;

	$: if (idUser && idTrans) {
		getTransById(idUser, idTrans);
	}

	const steps = [
		{ label: 'Menunggu', fullLabel: 'Belum Dikonfirmasi', icon: Clock },
		{ label: 'Diproses', fullLabel: 'Pesanan Sedang Diproses', icon: Package },
		{ label: 'Dikirim', fullLabel: 'Pesanan Sedang Dalam Pengiriman', icon: Truck },
		{ label: 'Selesai', fullLabel: 'Pesanan Selesai', icon: CheckCircle2 }
	];

	$: currentStepIndex = steps.findIndex(
		(s) => s.fullLabel === $oneTransaksiAdminStore?.transaksi_status
	);
	$: isCancelled = $oneTransaksiAdminStore?.transaksi_status === 'Pesanan Dibatalkan';

	function handleBack() {
		goto('/dashboard/customer/history_pemesanan');
	}

	const formatRupiah = (val: string | number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(Number(val));
	};

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

{#if showBuktiModal && $oneTransaksiAdminStore}
	<BuktiModal
		img={`${BASE_URL}/uploads/${$oneTransaksiAdminStore.transaksi_img}`}
		title="Bukti Pembayaran Anda"
		onClose={() => (showBuktiModal = false)}
	/>
{/if}

<div class="flex h-[calc(100vh-2rem)] flex-col overflow-hidden bg-zinc-50 font-sans">
	<div class="relative z-30 flex-shrink-0 border-b border-zinc-200 bg-white shadow-sm">
		<div class="flex items-center justify-between px-6 py-4">
			<div class="flex items-center gap-4">
				<button
					on:click={handleBack}
					class="group rounded-full border border-zinc-200 p-2 text-zinc-500 transition-all hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
				>
					<ArrowLeft class="h-6 w-6" />
				</button>
				<div>
					<h1 class="text-xl font-bold tracking-tight text-zinc-900">Detail Pesanan</h1>
					{#if $oneTransaksiAdminStore}
						<button
							on:click={() => copyToClipboard($oneTransaksiAdminStore.transaksi_id)}
							class="group flex cursor-pointer items-center gap-2 font-mono text-sm text-zinc-400 transition-colors hover:text-indigo-600"
						>
							<span>#{$oneTransaksiAdminStore.transaksi_id}</span>
							<Copy class="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
						</button>
					{/if}
				</div>
			</div>

			<div>
				{#if isCancelled}
					<span
						class="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-sm font-bold text-rose-600"
					>
						<X class="h-4 w-4" /> Dibatalkan
					</span>
				{:else if $oneTransaksiAdminStore}
					<div class="flex flex-col items-end">
						<span
							class="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700"
						>
							<span class="relative flex h-2 w-2">
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"
								></span>
								<span class="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
							</span>
							<span>{$oneTransaksiAdminStore.transaksi_status}</span>
						</span>
					</div>
				{/if}
			</div>
		</div>

		{#if $oneTransaksiAdminStore && !isCancelled}
			<div class="hidden border-t border-zinc-200 bg-zinc-50/50 px-4 py-4 sm:block">
				<div class="relative mx-auto max-w-4xl">
					<div class="absolute top-4 left-0 -z-0 h-1 w-full rounded-full bg-zinc-200"></div>
					<div class="relative z-10 grid w-full grid-cols-4">
						{#each steps as step, i}
							{@const isCompleted = i < currentStepIndex}
							{@const isCurrent = i === currentStepIndex}

							<div class="group flex cursor-default flex-col items-center">
								<div
									class={`
                                flex h-9 w-9 items-center justify-center rounded-full border-[3px] bg-white transition-all duration-300
                                ${isCompleted ? 'border-indigo-600 text-indigo-600' : ''}
                                ${isCurrent ? 'scale-110 border-indigo-500 text-indigo-600 shadow-md ring-2 ring-white' : ''}
                                ${!isCompleted && !isCurrent ? 'border-zinc-300 text-zinc-300' : ''}
                            `}
								>
									{#if isCompleted}
										<Check class="h-4 w-4" strokeWidth={3} />
									{:else}
										<svelte:component this={step.icon} class="h-4 w-4" />
									{/if}
								</div>
								<span
									class={`mt-2 text-center text-xs font-bold ${isCurrent ? 'text-indigo-700' : 'text-zinc-500'}`}
								>
									{step.label}
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		{#if $oneTransaksiAdminStore}
			<div
				class="flex items-center justify-between border-t border-b border-indigo-100 bg-indigo-50/60 px-6 py-3 lg:hidden"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-200 bg-white text-sm font-bold text-indigo-600 shadow-sm"
					>
						{$oneTransaksiAdminStore.user_nama.charAt(0)}
					</div>
					<div class="flex flex-col">
						<span class="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Pembeli</span
						>
						<span class="max-w-[120px] truncate text-sm font-bold text-zinc-900"
							>{$oneTransaksiAdminStore.user_nama}</span
						>
					</div>
				</div>
				<button
					on:click={() => (showBuktiModal = true)}
					class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
				>
					<Eye class="h-4 w-4" /> Lihat Bukti
				</button>
			</div>
		{/if}
	</div>

	<div class="relative z-10 flex flex-1 overflow-hidden">
		{#if $loadingTrans && !$oneTransaksiAdminStore}
			<div class="flex h-full w-full items-center justify-center">
				<div class="flex flex-col items-center gap-3">
					<div
						class="h-8 w-8 animate-spin rounded-full border-[3px] border-zinc-200 border-t-indigo-600"
					></div>
					<span class="text-sm font-medium text-zinc-500">Memuat data...</span>
				</div>
			</div>
		{:else if $oneTransaksiAdminStore}
			<div
				class="hidden h-full w-[350px] flex-shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-white lg:flex"
			>
				<div class="custom-scroll flex-1 space-y-6 overflow-y-auto p-6">
					<div class="space-y-3">
						<h3
							class="flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-400 uppercase"
						>
							<User class="h-4 w-4" /> Informasi Pelanggan
						</h3>
						<div class="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700"
								>
									{$oneTransaksiAdminStore.user_nama.charAt(0)}
								</div>
								<div>
									<p class="text-base font-bold text-zinc-900">
										{$oneTransaksiAdminStore.user_nama}
									</p>
									<p class="text-xs text-zinc-500">ID: {$oneTransaksiAdminStore.user_id}</p>
								</div>
							</div>
						</div>
					</div>

					<div class="space-y-3">
						<h3
							class="flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-400 uppercase"
						>
							<Receipt class="h-4 w-4" /> Pembayaran
						</h3>
						<div
							class="rounded-xl border border-zinc-200 bg-white p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
						>
							<div class="mb-3 flex justify-center">
								<span
									class="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600"
								>
									<ShieldCheck class="h-3.5 w-3.5" /> Pembayaran Valid
								</span>
							</div>
							<p class="mb-4 text-xs text-zinc-500">Bukti transfer tersedia.</p>
							<button
								on:click={() => (showBuktiModal = true)}
								class="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 py-2.5 text-sm font-bold text-indigo-700 transition-all hover:border-indigo-300 hover:bg-indigo-100"
							>
								<Eye class="h-4 w-4" /> Lihat Bukti Transfer
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="relative flex h-full min-w-0 flex-1 flex-col bg-zinc-50/30">
				<div
					class="z-20 flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white/90 px-6 py-4 backdrop-blur"
				>
					<h3 class="flex items-center gap-2 text-base font-bold text-zinc-800">
						<ShoppingBag class="h-5 w-5 text-zinc-400" /> Daftar Barang
					</h3>
					<span
						class="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-600"
					>
						{$oneTransaksiAdminStore.transaksi_detail.length} Item
					</span>
				</div>

				<div class="custom-scroll flex-1 overflow-y-auto p-4 sm:p-6">
					<div class="mx-auto max-w-4xl space-y-3">
						{#each $oneTransaksiAdminStore.transaksi_detail as detail}
							<div
								class="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300"
							>
								<div
									class="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
								>
									<img
										src={`${BASE_URL}/uploads/${detail.produk_gambar}`}
										alt={detail.detail_nama}
										class="h-full w-full object-cover"
									/>
								</div>

								<div class="flex min-w-0 flex-1 flex-col justify-center">
									<h4 class="mb-1 truncate text-base font-bold text-zinc-900">
										{detail.detail_nama}
									</h4>
									<div class="flex items-center gap-2 text-sm text-zinc-500">
										<span class="font-medium text-zinc-700">{detail.detail_stok} x</span>
										<span>{formatRupiah(detail.produk_harga ?? 0)}</span>
									</div>
								</div>

								<div class="flex flex-col justify-center border-l border-zinc-50 pl-4 text-right">
									<p class="mb-0.5 text-[10px] font-bold text-zinc-400 uppercase">Total</p>
									<p class="font-mono text-lg font-bold text-indigo-600">
										{formatRupiah(detail.detail_sub_total)}
									</p>
								</div>
							</div>
						{/each}
						<div class="h-4"></div>
					</div>
				</div>

				<div
					class="z-30 shrink-0 border-t border-zinc-200 bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]"
				>
					<div class="mx-auto flex max-w-4xl items-center justify-end gap-6">
						<div class="text-right">
							<p class="mb-1 text-sm font-semibold tracking-wide text-zinc-400 uppercase">
								Total Pembayaran
							</p>
							<div class="flex items-baseline justify-end gap-1">
								<span class="font-sans text-3xl font-bold tracking-tight text-indigo-600">
									{formatRupiah($oneTransaksiAdminStore.transaksi_grand_total)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex h-full w-full items-center justify-center bg-zinc-50">
				<p class="font-medium text-zinc-400">Data tidak ditemukan</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.custom-scroll::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	.custom-scroll::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scroll::-webkit-scrollbar-thumb {
		background-color: #e4e4e7;
		border-radius: 20px;
	}
	.custom-scroll::-webkit-scrollbar-thumb:hover {
		background-color: #a1a1aa;
	}
</style>

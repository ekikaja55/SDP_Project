<!-- src/routes/cart/+page.svelte -->
 <!-- untuk handling transaksi dari cart -->
<script lang="ts">
  export let data;
	import { goto } from '$app/navigation';
	import {
		addTransaksi,
		cartStore,
		grandTotalStore,
		loadingTrans,
		messageHandleTrans,
		type TransaksiDTO,
		type TransaksiDetail
	} from '$lib';
	import { onMount } from 'svelte';
	import TransactionModal from '../../lib/components/TransactionModal.svelte';
	import { page } from '$app/state';
	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

	let metodePembayaran = '';
	let transaksiImg: File | null = null;
	let loadingImage = false;

	onMount(() => {
		console.log('page cart fn OnMount() -> masuk');
	});

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			loadingImage = true;
			const file = target.files[0];
			transaksiImg = file;
			console.log('File transaksi_img dipilih:', file.name);

			await new Promise((resolve) => setTimeout(resolve, 1000));
			loadingImage = false;
		}
	}

	function handleMetodeChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		metodePembayaran = target.value;
		console.log('Metode pembayaran dipilih:', metodePembayaran);
	}

	async function handleCheckout() {
		console.log('Checkout:', $cartStore);
		console.log('Metode pembayaran:', metodePembayaran);
		console.log('File transaksi_img:', transaksiImg);

		const temp: TransaksiDetail[] = $cartStore.map((item) => {
			return {
				detail_nama: item.produk_nama ?? 'test dummy',
				detail_stok: item.qty?.toString() ?? '0',
				detail_sub_total: item.produk_total?.toString() ?? '0'
			};
		});

		const data: TransaksiDTO = {
			transaksi_img: transaksiImg ?? 'gamasuk_gambar',
			transaksi_grand_total: $grandTotalStore.toLocaleString(),
			transaksi_detail: [...temp]
		};

		console.log('array temp setelah diolah', temp);
		console.log('array final', data);
		await addTransaksi(data);
	}

	function handleBack() {
		goto('catalog');
	}

	function updateQty(id: string, qty: number) {
		cartStore.setQty(id, qty);
	}
</script>

<section class="min-h-screen bg-zinc-100 p-8 flex items-start justify-center">
	{#if $messageHandleTrans && $messageHandleTrans.type === "success"}
		<TransactionModal
			message={$messageHandleTrans.message}
			type={$messageHandleTrans.type}
			onClose={() => messageHandleTrans.set(null)}
		/>
	{/if}

	<div class="w-full max-w-5xl rounded-2xl bg-white shadow-lg p-8">
		<div class="mb-6 flex justify-between items-center">
			<button
				on:click={handleBack}
				class="flex items-center gap-2 rounded-lg bg-zinc-200 px-5 py-2 font-medium text-zinc-700 transition hover:bg-zinc-300"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
				Kembali
			</button>

			<h1 class="text-2xl font-semibold text-zinc-800 flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-zinc-800">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18l-2 18H5L3 3zm3 3h12m-6 0v12" />
				</svg>
				Keranjang Belanja
			</h1>
		</div>

		{#if $cartStore.length === 0}
			<div class="py-16 text-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mx-auto mb-4 h-12 w-12 text-zinc-400">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18M5 6h14l1.5 9h-17L5 6zm1 12h12m-8 3a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
				</svg>
				<p class="text-zinc-500">Keranjang kamu masih kosong.</p>
			</div>
		{:else}
			<!-- daftar item -->
			<div class="divide-y divide-zinc-200">
				{#each $cartStore as item}
					<div class="flex items-center justify-between py-5">
						<div class="flex items-center gap-5">
							<img
								src={`${BASE_URL}/uploads/${item.produk_gambar}`}
								alt={item.produk_nama}
								class="h-20 w-20 rounded-xl border object-cover shadow-sm"
							/>
							<div>
								<h2 class="font-semibold text-zinc-800">{item.produk_nama}</h2>
								<p class="text-sm text-zinc-500">Rp {item.produk_harga.toLocaleString()}</p>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<button
								on:click={() => cartStore.remove(item.id)}
								class="rounded-lg bg-zinc-200 px-3 py-1 hover:bg-zinc-300"
							>
								−
							</button>

							<input
								type="text"
								class="w-14 rounded-lg border text-center text-sm"
								bind:value={item.qty}
								on:change={(e) => updateQty(item.id, 1)}
							/>

							<button
								on:click={() => cartStore.add(item)}
								class="rounded-lg bg-zinc-200 px-3 py-1 hover:bg-zinc-300"
							>
								+
							</button>

							<span class="w-28 text-right font-semibold text-zinc-700">
								Rp {(item.produk_total ?? 0).toLocaleString()}
							</span>
						</div>
					</div>
				{/each}
			</div>

			<hr class="my-8 border-zinc-200" />

			<!-- total -->
			<div class="flex items-center justify-between mb-8">
				<h2 class="text-lg font-semibold text-zinc-800">Total</h2>
				<p class="text-2xl font-bold text-emerald-600">Rp {$grandTotalStore}</p>
			</div>

			<!-- metode pembayaran -->
			<div class="mb-6">
				<label class="mb-2 block font-semibold text-zinc-700">Metode Pembayaran</label>
				<select
					class="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-sm shadow-sm focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none"
					on:change={handleMetodeChange}
					bind:value={metodePembayaran}
				>
					<option value="">-- Pilih Metode Pembayaran --</option>
					<option value="qris">QRIS</option>
					<option value="bri">Transfer BRI</option>
					<option value="bca">Transfer BCA</option>
				</select>

				{#if metodePembayaran === 'qris'}
					<div class="mt-4 text-center">
						<img src="/images/qris.svg" alt="QRIS" class="mx-auto w-60 rounded-lg border shadow-sm" />
						<p class="mt-2 text-sm text-zinc-600">Scan QRIS untuk pembayaran</p>
					</div>
				{:else if metodePembayaran === 'bri'}
					<div class="mt-4 text-center">
						<p class="font-semibold text-zinc-800">BRI: 1234 5678 9012 3456</p>
						<p class="text-sm text-zinc-500">a.n. Kanti Kosasih</p>
					</div>
				{:else if metodePembayaran === 'bca'}
					<div class="mt-4 text-center">
						<p class="font-semibold text-zinc-800">BCA: 9876 5432 1098 7654</p>
						<p class="text-sm text-zinc-500">a.n. Kanti Kosasih</p>
					</div>
				{/if}
			</div>

			<!-- upload bukti -->
			<div class="mb-6">
				<label class="mb-2 block font-semibold text-zinc-700">Upload Bukti Transaksi</label>
				<input
					type="file"
					accept="image/*"
					on:change={handleFileChange}
					class="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-sm shadow-sm focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100"
					disabled={loadingImage}
				/>
				{#if loadingImage}
					<p class="mt-2 text-sm text-blue-500 animate-pulse">Sedang memuat gambar...</p>
				{:else if transaksiImg}
					<p class="mt-2 text-sm text-emerald-600">{transaksiImg.name} berhasil dimuat.</p>
				{/if}
			</div>

			<!-- tombol aksi -->
			<div class="flex justify-between">
				<button
					class="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-red-600"
					on:click={() => cartStore.clear()}
				>
					Clear Cart
				</button>

				<button
					on:click={handleCheckout}
					disabled={$loadingTrans}
					class="rounded-xl bg-emerald-600 px-6 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
				>
					{#if $loadingTrans}
						<span>Memproses...</span>
					{:else}
						<span>Checkout</span>
					{/if}
				</button>
			</div>
		{/if}
	</div>
</section>

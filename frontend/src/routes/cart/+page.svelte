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

<div class="min-h-screen bg-gray-100 p-6">
	{#if $messageHandleTrans}
		<TransactionModal
			message={$messageHandleTrans.message}
      user_nama={data.user?.user_nama}
			type={$messageHandleTrans.type}
			onClose={() => messageHandleTrans.set(null)}
		/>
	{/if}

	<div class="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow">
		<div class="mb-6 flex justify-between">
			<button
				on:click={handleBack}
				class="rounded-lg bg-gray-200 px-5 py-2 font-medium hover:bg-gray-300">← Kembali</button
			>
		</div>

		<h1 class="mb-6 text-2xl font-semibold text-gray-800">Keranjang Belanja</h1>

		{#if $cartStore.length === 0}
			<p class="py-10 text-center text-gray-500">Keranjang kamu masih kosong.</p>
		{:else}
			<!-- daftar item -->
			<div class="divide-y">
				{#each $cartStore as item}
					<div class="flex items-center justify-between py-4">
						<div class="flex items-center gap-4">
							<img
								src={`${BASE_URL}/uploads/${item.produk_gambar}`}
								alt={item.produk_nama}
								class="h-20 w-20 rounded-lg border object-cover"
							/>
							<div>
								<h2 class="font-semibold text-gray-800">{item.produk_nama}</h2>
								<p class="text-sm text-gray-500">Rp {item.produk_harga.toLocaleString()}</p>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<button
								on:click={() => cartStore.remove(item.id)}
								class="rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300">-</button>

							<input
								type="text"
								min="1"
								class="w-14 rounded-lg border text-center"
								bind:value={item.qty}
								on:change={(e) => updateQty(item.id, 1)}
							/>

							<button
								on:click={() => cartStore.add(item)}
								class="rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300">+</button>

							<span class="w-28 text-right font-semibold text-gray-700">
								Rp {(item.produk_total ?? 0).toLocaleString()}
							</span>
						</div>
					</div>
				{/each}
			</div>

			<hr class="my-6" />

			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold">Total</h2>
				<p class="text-xl font-bold text-blue-600">
					Rp {$grandTotalStore}
				</p>
			</div>

			<div class="mt-6">
				<label class="mb-2 block font-semibold text-gray-700">Metode Pembayaran</label>
				<select
					class="w-full rounded-lg border p-2"
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
						<img src="/images/qris.svg" alt="QRIS" class="mx-auto w-60 rounded-lg border" />
						<p class="mt-2 text-gray-700">Scan QRIS untuk pembayaran</p>
					</div>
				{:else if metodePembayaran === 'bri'}
					<div class="mt-4 text-center">
						<p class="font-semibold text-gray-700">BRI: 1234 5678 9012 3456</p>
						<p class="text-sm text-gray-500">a.n. Kanti Kosasih</p>
					</div>
				{:else if metodePembayaran === 'bca'}
					<div class="mt-4 text-center">
						<p class="font-semibold text-gray-700">BCA: 9876 5432 1098 7654</p>
						<p class="text-sm text-gray-500">a.n. Kanti Kosasih</p>
					</div>
				{/if}
			</div>

			<div class="mt-6">
				<label class="mb-2 block font-semibold text-gray-700">Upload Bukti Transaksi</label>
				<input
					type="file"
					accept="image/*"
					on:change={handleFileChange}
					class="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:bg-gray-100"
					disabled={loadingImage}
				/>
				{#if loadingImage}
					<p class="mt-2 text-sm text-blue-500 animate-pulse"> Sedang memuat gambar...</p>
				{:else if transaksiImg}
					<p class="mt-2 text-sm text-green-600"> {transaksiImg.name} berhasil dimuat.</p>
				{/if}
			</div>

			<div class="mt-6 flex justify-between">
				<button
					class="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
					on:click={() => cartStore.clear()}
				>
					Clear Cart
				</button>

				<button
					on:click={handleCheckout}
					disabled={$loadingTrans}
					class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-70"
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
</div>

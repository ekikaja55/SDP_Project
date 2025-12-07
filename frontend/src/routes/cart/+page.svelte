<!-- src/routes/cart/+page.ts -->
<script lang="ts">
	export let data;
	import { goto } from '$app/navigation';
	import {
		addTransaksi,
		cartStore,
		grandTotalStore,
		loadingTrans,
		messageHandleCart,
		type TransaksiDTO,
		type TransaksiDetail
	} from '$lib';
	import { fade, slide } from 'svelte/transition';
	import TransactionModal from '../../lib/components/TransactionModal.svelte';
	import Whatsapp from '../../lib/components/Whatsapp.svelte';

	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

	let metodePembayaran = '';
	let transaksiImg: File | null = null;
	let loadingImage = false;

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			loadingImage = true;
			const file = target.files[0];
			transaksiImg = file;
			await new Promise((resolve) => setTimeout(resolve, 1000));
			loadingImage = false;
		}
	}

	function handleMetodeChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		metodePembayaran = target.value;
	}

	async function handleCheckout() {
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

		await addTransaksi(data);
	}

	function handleBack() {
		goto('catalog');
	}

	function updateQty(id: string, value: any) {
		let newQty = parseInt(value);
		if (isNaN(newQty) || newQty < 1) {
			newQty = 1;
		}
		cartStore.setQty(id, newQty);
	}

	function incrementQty(item: any) {
		const currentQty = item.qty || 0;
		cartStore.setQty(item.id, currentQty + 1);
	}

	function decrementQty(item: any) {
		const currentQty = item.qty || 0;
		if (currentQty > 1) {
			cartStore.setQty(item.id, currentQty - 1);
		} else {
			cartStore.remove(item.id);
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

<section class="min-h-screen bg-zinc-50 font-sans text-zinc-800">
	<Whatsapp />

	{#if $messageHandleCart && $messageHandleCart.type === 'success'}
		<TransactionModal
			message={$messageHandleCart.message}
			type={$messageHandleCart.type}
			onClose={() => messageHandleCart.set(null)}
		/>
	{/if}

	<div class="mx-auto max-w-7xl px-6 py-10">
		<div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<h1 class="text-3xl font-bold tracking-tight text-zinc-900">Keranjang Belanja</h1>
			<button
				on:click={handleBack}
				class="group flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-600 shadow-sm ring-1 ring-zinc-200 transition hover:bg-zinc-100 hover:text-zinc-900"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-4 w-4 transition-transform group-hover:-translate-x-1"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
					/>
				</svg>
				Lanjut Belanja
			</button>
		</div>

		{#if $cartStore.length === 0}
			<div
				in:fade
				class="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl bg-white px-4 text-center shadow-sm ring-1 ring-zinc-100"
			>
				<div class="mb-6 rounded-full bg-zinc-50 p-8">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-16 w-16 text-zinc-300"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.074.58.012.868-.057.262-.169.51-.328.729a2.01 2.01 0 01-1.611.796H8.56c-.66 0-1.272-.303-1.666-.826a2.008 2.008 0 01-.322-.767L5.38 10.5h11.376z"
						/>
					</svg>
				</div>
				<h2 class="text-xl font-semibold text-zinc-900">Keranjang kamu kosong</h2>
				<p class="mt-2 text-zinc-500">Sepertinya kamu belum menambahkan apapun.</p>
				<button
					on:click={handleBack}
					class="mt-6 rounded-xl bg-zinc-900 px-8 py-3 font-semibold text-white transition hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20"
				>
					Mulai Belanja
				</button>
			</div>
		{:else}
			<div class="grid gap-8 lg:grid-cols-12" in:fade>
				<div class="flex flex-col gap-4 lg:col-span-8">
					{#each $cartStore as item (item.id)}
						<div
							transition:slide|local
							class="group flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100 transition-all hover:shadow-md md:flex-row md:items-center"
						>
							<div class="shrink-0 overflow-hidden rounded-xl bg-zinc-100">
								<img
									src={`${BASE_URL}/uploads/${item.produk_gambar}`}
									alt={item.produk_nama}
									class="h-24 w-24 object-cover transition duration-500 group-hover:scale-110 md:h-28 md:w-28"
								/>
							</div>

							<div class="flex flex-1 flex-col justify-between gap-4 md:flex-row md:items-center">
								<div class="flex-1">
									<h3 class="text-lg font-semibold text-zinc-900">{item.produk_nama}</h3>
									<p class="text-sm font-bold text-zinc-700">
										Harga Satuan: {formatRupiah(item.produk_harga)}
									</p>
								</div>

								<div class="flex flex-col items-end gap-3 md:flex-row md:items-center md:gap-6">
									<div class="flex items-center rounded-full border border-zinc-200 bg-zinc-50">
										<button
											on:click={() => decrementQty(item)}
											class="px-3 py-2 text-zinc-500 hover:text-zinc-900"
										>
											−
										</button>
										<input
											type="number"
											min="1"
											class="w-20 bg-transparent text-center text-sm font-semibold text-zinc-900 focus:outline-none"
											value={item.qty}
											on:input={(e) => {
												const target = e.target as HTMLInputElement;
												updateQty(item.id, target.value);
											}}
										/>
										<button
											on:click={() => incrementQty(item)}
											class="px-3 py-2 text-zinc-500 hover:text-zinc-900"
										>
											+
										</button>
									</div>

									<div class="text-right">
										<p class="text-xs text-zinc-400">Total</p>
										<p class="font-bold text-emerald-600">{formatRupiah(item.produk_total ?? 0)}</p>
									</div>
								</div>
							</div>
						</div>
					{/each}

					<div class="flex justify-end pt-4">
						<button
							class="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600"
							on:click={() => cartStore.clear()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-4 w-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
								/>
							</svg>
							Hapus Semua Item
						</button>
					</div>
				</div>

				<div class="lg:col-span-4">
					<div
						class="sticky top-24 space-y-6 rounded-3xl bg-white p-6 shadow-lg ring-1 shadow-zinc-200/50 ring-zinc-100"
					>
						<h2 class="text-xl font-bold text-zinc-900">Ringkasan Belanja</h2>

						<div class="space-y-3">
							<div class="flex justify-between text-zinc-500">
								<span>Total Item</span>
								<span>{$cartStore.length} Pcs</span>
							</div>
							<div
								class="flex justify-between border-t border-dashed border-zinc-200 pt-3 text-lg font-bold text-zinc-900"
							>
								<span>Total Harga</span>
								<span class="text-emerald-600">{formatRupiah($grandTotalStore ?? 0)}</span>
							</div>
						</div>

						<div class="space-y-2">
							<label class="block text-sm font-medium text-zinc-700">Metode Pembayaran</label>
							<div class="relative">
								<select
									class="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 transition focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none"
									on:change={handleMetodeChange}
									bind:value={metodePembayaran}
								>
									<option value="">-- Pilih Pembayaran --</option>
									<option value="qris">QRIS (Scan Barcode)</option>
									<option value="bri">Transfer Bank BRI</option>
									<option value="bca">Transfer Bank BCA</option>
								</select>
								<div
									class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/></svg
									>
								</div>
							</div>
						</div>

						{#if metodePembayaran}
							<div
								transition:slide
								class="rounded-xl bg-zinc-50 p-4 text-center ring-1 ring-zinc-200"
							>
								{#if metodePembayaran === 'qris'}
									<img
										src="/images/qris.svg"
										alt="QRIS"
										class="mx-auto mb-2 w-32 rounded-lg mix-blend-multiply"
									/>
									<p class="text-xs text-zinc-500">Scan QRIS di atas</p>
								{:else if metodePembayaran === 'bri'}
									<p class="font-mono text-lg font-bold text-zinc-800">1234 5678 9012 3456</p>
									<p class="text-xs text-zinc-500">BRI a.n. Kanti Kosasih</p>
								{:else if metodePembayaran === 'bca'}
									<p class="font-mono text-lg font-bold text-zinc-800">9876 5432 10</p>
									<p class="text-xs text-zinc-500">BCA a.n. Kanti Kosasih</p>
								{/if}
							</div>
						{/if}

						<div class="space-y-2">
							<label class="block text-sm font-medium text-zinc-700">Bukti Transfer</label>
							<div
								class="relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 transition hover:bg-zinc-100"
							>
								<input
									type="file"
									accept="image/*"
									on:change={handleFileChange}
									class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
									disabled={loadingImage}
								/>
								{#if loadingImage}
									<p class="animate-pulse text-xs text-blue-500">Mengunggah...</p>
								{:else if transaksiImg}
									<div class="flex items-center gap-2 text-emerald-600">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clip-rule="evenodd"
											/>
										</svg>
										<span class="max-w-[150px] truncate text-xs font-medium"
											>{transaksiImg.name}</span
										>
									</div>
								{:else}
									<div class="flex flex-col items-center text-zinc-400">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="mb-1 h-6 w-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
											/>
										</svg>
										<span class="text-xs">Klik untuk upload</span>
									</div>
								{/if}
							</div>
						</div>

						<button
							on:click={handleCheckout}
							disabled={$loadingTrans || !metodePembayaran}
							class="w-full rounded-xl bg-zinc-900 py-4 font-bold text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-[1.02] hover:bg-zinc-800 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:opacity-70"
						>
							{#if $loadingTrans}
								<span class="flex items-center justify-center gap-2">
									<svg
										class="h-5 w-5 animate-spin text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										><circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle><path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path></svg
									>
									Memproses...
								</span>
							{:else}
								Checkout Sekarang
							{/if}
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		cartStore,
		getKatalogProduk,
		loadingGlobal,
		msgCart,
		produkCatalogStore,
		type CartProduk
	} from '$lib';
	import { onMount } from 'svelte';
	import NotificationModal from '../../lib/components/NotificationModal.svelte';
	import { browser } from '$app/environment';
	import Whatsapp from '../../lib/components/Whatsapp.svelte';
	import ProductViewerModal from '../../lib/components/ProductViewerModal.svelte';
	import { fade } from 'svelte/transition';

	import { Search, ShoppingCart, X, Eye, ShoppingBag, Star, Plus, Store } from '@lucide/svelte';

	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;
	let user: string | null;

	let isLoaded = false;

	if (browser) {
		user = localStorage.getItem('token');
	}

	let searchNama: string = '';
	let filterHarga: string = '';
	let filterRating: string = '';

	let selectedProduk: CartProduk | null = null;

	onMount(async () => {
		const dataFetch = refreshCatalog();

		await new Promise((resolve) => setTimeout(resolve, 800));

		isLoaded = true;

		await dataFetch;
	});

	async function refreshCatalog() {
		await getKatalogProduk(searchNama, filterHarga, filterRating);
	}

	function resetFilter() {
		searchNama = '';
		filterHarga = '';
		filterRating = '';
		refreshCatalog();
	}

	function openCart() {
		if (!user) {
			goto('login');
			return;
		}
		goto('cart');
	}

	function addCart(produk: CartProduk) {
		if (!user) {
			goto('login');
			return;
		}
		cartStore.add(produk);
	}

	function openModal(produk: CartProduk) {
		selectedProduk = produk;
	}

	function closeModal() {
		selectedProduk = null;
	}

	const formatRupiah = (number: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(number);
	};
</script>

{#if !isLoaded}
	<div
		out:fade={{ duration: 400 }}
		class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white"
	>
		<div
			class="relative flex h-24 w-24 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-zinc-100"
		>
			<Store class="h-10 w-10 animate-bounce text-zinc-800" strokeWidth={1.5} />

			<span
				class="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-200 opacity-50"
			></span>
		</div>

		<div class="mt-6 flex flex-col items-center gap-2">
			<h1 class="text-xl font-bold tracking-wider text-zinc-900">Katalog</h1>
			<p class="text-xs tracking-widest text-zinc-500 uppercase">Memuat Produk...</p>
		</div>
	</div>
{:else}
	<section class="min-h-screen bg-zinc-50 font-sans text-zinc-800 selection:bg-zinc-200">
		{#if $msgCart}
			<NotificationModal
				message="Berhasil ditambahkan ke keranjang"
				type="success"
				onClose={() => msgCart.set(false)}
			/>
		{/if}

		{#if selectedProduk}
			<ProductViewerModal
				imageUrl={`${BASE_URL}/uploads/${selectedProduk.produk_gambar}`}
				productName={selectedProduk.produk_nama}
				on:close={closeModal}
			/>
		{/if}

		<Whatsapp />

		<div
			class="sticky top-16 z-30 w-full border-b border-zinc-200/80 bg-white/80 px-4 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sm:px-6 lg:px-8"
		>
			<div
				class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between"
			>
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900"
					>
						<ShoppingBag class="h-5 w-5" />
					</div>
					<div>
						<h1 class="text-xl font-bold tracking-tight text-zinc-900">Katalog Produk</h1>
						<p class="text-xs text-zinc-500">Temukan pilihan herbal terbaik</p>
					</div>
				</div>

				<div class="flex flex-1 flex-wrap items-center justify-end gap-3">
					<div class="group relative w-full md:w-64">
						<Search
							class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-800"
						/>
						<input
							type="text"
							bind:value={searchNama}
							placeholder="Cari produk..."
							class="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2.5 pr-4 pl-10 text-sm transition-all placeholder:text-zinc-400 hover:bg-zinc-50 focus:border-zinc-800 focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none"
							on:input={refreshCatalog}
						/>
					</div>

					<div class="flex items-center gap-2">
						<select
							bind:value={filterHarga}
							class="cursor-pointer appearance-none rounded-full border border-zinc-200 bg-white py-2.5 pr-8 pl-4 text-sm text-zinc-700 transition hover:border-zinc-400 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none"
							on:change={refreshCatalog}
						>
							<option value="">Harga</option>
							<option value="termurah">Termurah</option>
							<option value="termahal">Termahal</option>
						</select>

						<select
							bind:value={filterRating}
							class="cursor-pointer appearance-none rounded-full border border-zinc-200 bg-white py-2.5 pr-8 pl-4 text-sm text-zinc-700 transition hover:border-zinc-400 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none"
							on:change={refreshCatalog}
						>
							<option value="">Rating</option>
							<option value="tertinggi">⭐ Tertinggi</option>
							<option value="terendah">⭐ Terendah</option>
						</select>
					</div>

					{#if searchNama || filterHarga || filterRating}
						<button
							transition:fade={{ duration: 150 }}
							class="flex items-center justify-center rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-red-500"
							on:click={resetFilter}
							title="Reset Filter"
						>
							<X class="h-4 w-4" />
						</button>
					{/if}

					<div class="mx-1 hidden h-6 w-px bg-zinc-200 md:block"></div>

					<button
						class="relative flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800 hover:shadow-zinc-900/20 active:scale-95"
						on:click={() => openCart()}
					>
						<ShoppingCart class="h-4 w-4" />
						<span class="hidden sm:inline">Keranjang</span>
						{#if $cartStore.length > 0}
							<span
								class="ml-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-zinc-900"
							>
								{$cartStore.length}
							</span>
						{/if}
					</button>
				</div>
			</div>
		</div>

		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			{#if $loadingGlobal}
				<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{#each Array(10) as _}
						<div
							class="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100"
						>
							<div class="aspect-square w-full animate-pulse rounded-xl bg-zinc-100"></div>
							<div class="space-y-2 px-1">
								<div class="h-4 w-3/4 animate-pulse rounded bg-zinc-100"></div>
								<div class="h-3 w-1/2 animate-pulse rounded bg-zinc-100"></div>
							</div>
							<div class="mt-2 h-9 w-full animate-pulse rounded-lg bg-zinc-100"></div>
						</div>
					{/each}
				</div>
			{:else if $produkCatalogStore && $produkCatalogStore.length > 0}
				<div
					class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
					in:fade={{ duration: 300 }}
				>
					{#each $produkCatalogStore as produk}
						<div
							class="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-zinc-200"
						>
							<div
								class="relative aspect-square w-full cursor-zoom-in overflow-hidden bg-zinc-100"
								on:click={() => openModal(produk)}
							>
								<img
									src={`${BASE_URL}/uploads/${produk.produk_gambar}`}
									alt={produk.produk_nama}
									class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									loading="lazy"
								/>

								<div
									class="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100"
								>
									<div
										class="rounded-full bg-white p-2.5 text-zinc-900 shadow-lg transition-transform duration-300 hover:scale-110"
									>
										<Eye class="h-5 w-5" />
									</div>
								</div>

								<div
									class="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-sm ring-1 ring-zinc-100 backdrop-blur-sm"
								>
									<Star class="h-3 w-3 fill-amber-400 text-amber-400" />
									{produk.produk_avg_rating.toFixed(1)}
								</div>
							</div>

							<div class="flex flex-1 flex-col p-4">
								<h2
									class="mb-1 line-clamp-2 min-h-[2.5rem] cursor-pointer text-sm leading-tight font-bold text-zinc-800 transition-colors hover:text-zinc-600"
									on:click={() => openModal(produk)}
								>
									{produk.produk_nama}
								</h2>

								<div class="mt-auto mb-4 flex items-end justify-between pt-2">
									<div>
										<p class="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
											Harga
										</p>
										<p class="text-base font-bold text-zinc-900">
											{formatRupiah(produk.produk_harga)}
										</p>
									</div>
									<div class="text-right">
										<p class="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
											Stok
										</p>
										<p class="text-xs font-semibold text-zinc-600">
											{produk.produk_stok}
										</p>
									</div>
								</div>

								<button
									class="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-xs font-bold tracking-wide text-white transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/10 active:scale-95 active:bg-zinc-950"
									on:click={() => addCart(produk)}
								>
									<Plus class="h-4 w-4" strokeWidth={2.5} />
									TAMBAH
								</button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex min-h-[50vh] flex-col items-center justify-center text-center">
					<div
						class="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-100 text-zinc-300 ring-1 ring-zinc-200"
					>
						<Search class="h-10 w-10" />
					</div>
					<h3 class="text-lg font-bold text-zinc-900">Produk tidak ditemukan</h3>
					<p class="mt-2 max-w-sm text-sm text-zinc-500">
						Kami tidak dapat menemukan produk dengan kata kunci tersebut. Coba cari kata kunci lain
						atau reset filter.
					</p>

					<button
						on:click={resetFilter}
						class="mt-6 flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
					>
						<X class="h-4 w-4" />
						Reset Filter
					</button>
				</div>
			{/if}
		</div>
	</section>
{/if}

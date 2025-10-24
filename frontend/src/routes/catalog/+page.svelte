<!-- src/routes/catalog/+page.svelte -->
<!-- pages untuk katalog produk -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		cartStore,
		getKatalogProduk,
		loadingGlobal,
		produkCatalogStore,
		type CartProduk
	} from '$lib';
	import { onMount } from 'svelte';
	export let data;
	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

	let searchNama: string = '';
	let filterHarga: string = '';
	let filterRating: string = '';

	$: console.log('length cartStore :', $cartStore.length);

	onMount(() => {
		refreshCatalog();
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
		if (!data.user) {
			goto('login');
			return;
		}

		goto('cart');
	}

	function addCart(produk: CartProduk) {
		if (!data.user) {
			goto('login');
			return;
		}
		cartStore.add(produk);
	}
</script>

<h1 class="my-6 text-center text-2xl font-semibold">Katalog Produk</h1>

<div class="mb-6 flex flex-wrap items-center justify-center gap-3 px-4">
	<input
		type="text"
		bind:value={searchNama}
		placeholder="Cari produk..."
		class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
		on:input={refreshCatalog}
	/>

	<select
		bind:value={filterHarga}
		class="rounded-lg border border-gray-300 px-10 py-2 text-sm"
		on:change={refreshCatalog}
	>
		<option value="">Urutkan Harga</option>
		<option value="termurah">Termurah</option>
		<option value="termahal">Termahal</option>
	</select>

	<select
		bind:value={filterRating}
		class="rounded-lg border border-gray-300 px-10 py-2 text-sm"
		on:change={refreshCatalog}
	>
		<option value="">Urutkan Rating</option>
		<option value="tertinggi">Tertinggi</option>
		<option value="terendah">Terendah</option>
	</select>

	<button
		class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
		on:click={resetFilter}
	>
		Reset Filter
	</button>
	<button
		class="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-300"
		on:click={() => openCart()}
	>
		Lihat Cart : {$cartStore.length}
	</button>
</div>

{#if $loadingGlobal}
	<p class="text-center text-gray-500">Memuat katalog produk...</p>
{:else if $produkCatalogStore}
	<div class="grid grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each $produkCatalogStore as produk}
			<div
				class="transform overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
			>
				<img
					src={`${BASE_URL}/uploads/${produk.produk_gambar}`}
					alt={produk.produk_nama}
					class="h-56 w-full bg-gray-100 object-cover"
				/>

				<div class="flex flex-col gap-2 p-4">
					<h2 class="truncate text-lg font-semibold text-gray-800">{produk.produk_nama}</h2>
					<p class="text-sm text-gray-600">
						Harga: <span class="font-medium text-black">Rp{produk.produk_harga}</span>
					</p>
					<p class="text-sm text-gray-600">
						Stok: <span class="font-semibold text-green-700">{produk.produk_stok}</span>
					</p>
					<p class="text-sm text-yellow-500">⭐ {produk.produk_avg_rating.toFixed(1)}</p>

					<div class="mt-3 flex justify-between gap-3">
						<button
							class="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
							on:click={() => addCart(produk)}
						>
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="text-center text-gray-500">Tidak ada produk yang ditemukan.</p>
{/if}

<!-- src/routes/catalog/+page.svelte -->
<!-- pages untuk katalog produk -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		cartStore,
		getKatalogProduk,
		loadingGlobal,
		msgCart,
		produkCatalogStore,
		type CartProduk,

		type UserAuth

	} from '$lib';
	import { onMount } from 'svelte';
	import NotificationModal from '../../lib/components/NotificationModal.svelte';
	import { browser } from '$app/environment';
	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;
	let user:string|null;

  if (browser) {
    user = localStorage.getItem("token")
  }



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
</script>

{#if $msgCart}
	<NotificationModal
		message="Sukses tambah cart"
		type="success"
		onClose={() => msgCart.set(false)}
	/>
{/if}

<section class="flex flex-col min-h-screen items-center justify-start bg-zinc-50 p-8">
	<h1 class="my-8 text-center text-3xl font-semibold tracking-tight text-zinc-800">
		Katalog Produk
	</h1>

	<div class="mb-8 flex flex-wrap items-center justify-center gap-3 px-6">
		<div class="relative">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-zinc-500"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
				/>
			</svg>
			<input
				type="text"
				bind:value={searchNama}
				placeholder="Cari produk..."
				class="rounded-xl border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm text-zinc-700 shadow-sm transition focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
				on:input={refreshCatalog}
			/>
		</div>

		<select
			bind:value={filterHarga}
			class="rounded-xl border border-zinc-300 bg-white px-8 py-2 text-sm text-zinc-700 shadow-sm transition focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
			on:change={refreshCatalog}
		>
			<option value="">Urutkan Harga</option>
			<option value="termurah">Termurah</option>
			<option value="termahal">Termahal</option>
		</select>

		<select
			bind:value={filterRating}
			class="rounded-xl border border-zinc-300 bg-white px-8 py-2 text-sm text-zinc-700 shadow-sm transition focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
			on:change={refreshCatalog}
		>
			<option value="">Urutkan Rating</option>
			<option value="tertinggi">Tertinggi</option>
			<option value="terendah">Terendah</option>
		</select>

		<button
			class="flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-200"
			on:click={resetFilter}
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
					d="M3 3v6h6M21 21v-6h-6M3 21v-6h6M21 3v6h-6"
				/>
			</svg>
			Reset
		</button>

		<button
			class="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
			on:click={() => openCart()}
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
					d="M2.25 3h1.386c.51 0 .955.344 1.087.835l.383 1.437M7.5 14.25h9.75m-9.75 0L5.25 5.25m2.25 9h9.75m0 0l1.5-6.75M6.75 21a.75.75 0 100-1.5.75.75 0 000 1.5zm10.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
				/>
			</svg>
			Cart ({$cartStore.length})
		</button>
	</div>

	{#if $loadingGlobal}
		<p class="text-center text-zinc-500">Memuat katalog produk...</p>
	{:else if $produkCatalogStore}
		<div class="grid grid-cols-2 gap-5 px-6 md:grid-cols-3 lg:grid-cols-4">
			{#each $produkCatalogStore as produk}
				<div
					class="group transform overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 transition hover:-translate-y-1 hover:shadow-md"
				>
					<img
						src={`${BASE_URL}${produk.produk_gambar}`}
						alt={produk.produk_nama}
						class="h-40 w-full bg-zinc-100 object-cover transition group-hover:scale-105"
					/>

					<div class="flex flex-col gap-1 p-4">
						<h2 class="truncate text-base font-semibold text-zinc-800 group-hover:text-zinc-900">
							{produk.produk_nama}
						</h2>
						<p class="text-xs text-zinc-500">
							<span class="font-medium text-zinc-800">Rp{produk.produk_harga}</span>
						</p>
						<div class="flex items-center justify-between text-xs text-zinc-500">
							<span
								>Stok: <span class="font-semibold text-emerald-600">{produk.produk_stok}</span
								></span
							>
							<span class="flex items-center gap-1 text-amber-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
									/>
								</svg>
								{produk.produk_avg_rating.toFixed(1)}
							</span>
						</div>

						<button
							class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800"
							on:click={() => addCart(produk)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-4 w-4"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
							Tambah
						</button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-center text-zinc-500">Tidak ada produk yang ditemukan.</p>
	{/if}
</section>

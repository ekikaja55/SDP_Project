<!-- src/routes/catalog/svelte -->
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

  const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;
  let user: string | null;

  if (browser) {
    user = localStorage.getItem("token");
  }

  let searchNama: string = '';
  let filterHarga: string = '';
  let filterRating: string = '';

  let selectedProduk: CartProduk | null = null;

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

<section class="min-h-screen bg-zinc-50 font-sans text-zinc-800">
  <Whatsapp />

  <div class="sticky top-0 z-100 w-full border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-md transition-all ">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900">Katalog</h1>
      </div>

      <div class="flex flex-1 flex-wrap items-center justify-end gap-3">
        <div class="relative w-full md:w-64">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
          </svg>
          <input
            type="text"
            bind:value={searchNama}
            placeholder="Cari produk..."
            class="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm transition focus:border-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-800"
            on:input={refreshCatalog}
          />
        </div>

        <select
          bind:value={filterHarga}
          class="cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 transition hover:border-zinc-400 focus:border-zinc-800 focus:outline-none"
          on:change={refreshCatalog}
        >
          <option value="">Harga</option>
          <option value="termurah">Termurah</option>
          <option value="termahal">Termahal</option>
        </select>

        <select
          bind:value={filterRating}
          class="cursor-pointer rounded-full border border-zinc-200 bg-white px-7 py-2 text-sm text-zinc-700 transition hover:border-zinc-400 focus:border-zinc-800 focus:outline-none"
          on:change={refreshCatalog}
        >
          <option value="">Rating</option>
          <option value="tertinggi">⭐ Tertinggi</option>
          <option value="terendah">⭐ Terendah</option>
        </select>

        {#if searchNama || filterHarga || filterRating}
          <button
            transition:fade
            class="flex items-center justify-center rounded-full bg-zinc-100 p-2 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900"
            on:click={resetFilter}
            title="Reset Filter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}

        <button
          class="relative ml-2 flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800 hover:scale-105 active:scale-95"
          on:click={() => openCart()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286.074.58.012.868-.057.262-.169.51-.328.729a2.01 2.01 0 01-1.611.796H8.56c-.66 0-1.272-.303-1.666-.826a2.008 2.008 0 01-.322-.767L5.38 10.5h11.376z" />
          </svg>
          <span>Cart</span>
          {#if $cartStore.length > 0}
            <span class="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-zinc-900">
              {$cartStore.length}
            </span>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <div class="mx-auto max-w-7xl p-6">
    {#if $loadingGlobal}
      <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {#each Array(10) as _}
          <div class="animate-pulse rounded-2xl bg-white p-3 shadow-sm ring-1 ring-zinc-100">
            <div class="mb-3 aspect-square w-full rounded-xl bg-zinc-200"></div>
            <div class="h-4 w-3/4 rounded bg-zinc-200"></div>
            <div class="mt-2 h-3 w-1/2 rounded bg-zinc-200"></div>
            <div class="mt-4 h-8 w-full rounded bg-zinc-200"></div>
          </div>
        {/each}
      </div>

    {:else if $produkCatalogStore && $produkCatalogStore.length > 0}
      <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" in:fade={{ duration: 300 }}>
        {#each $produkCatalogStore as produk}
          <div
            class="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-zinc-200"
          >
            <div
              class="relative aspect-square w-full cursor-zoom-in overflow-hidden bg-zinc-100"
              on:click={() => openModal(produk)}
            >
              <img
                src={`${BASE_URL}/uploads/${produk.produk_gambar}`}
                alt={produk.produk_nama}
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              <div class="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                 <div class="rounded-full bg-white/90 p-2 text-zinc-800 shadow-sm backdrop-blur-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                 </div>
              </div>

              <div class="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-bold text-zinc-800 shadow-sm backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3 w-3 text-amber-500">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                </svg>
                {produk.produk_avg_rating.toFixed(1)}
              </div>
            </div>

            <div class="flex flex-col p-4">
              <h2
                class="mb-1 line-clamp-2 min-h-[2.5rem] cursor-pointer text-sm font-semibold leading-tight text-zinc-800 transition hover:text-emerald-600"
                on:click={() => openModal(produk)}
              >
                {produk.produk_nama}
              </h2>

              <div class="mb-4 flex items-end justify-between">
                <p class="text-base font-bold text-emerald-600">
                  {formatRupiah(produk.produk_harga)}
                </p>
                <p class="text-xs text-zinc-700 font-bold">
                  Stok: {produk.produk_stok}
                </p>
              </div>

              <button
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white transition-all hover:bg-zinc-700 active:scale-95 group-hover:shadow-lg group-hover:shadow-zinc-900/20"
                on:click={() => addCart(produk)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Tambah
              </button>
            </div>
          </div>
        {/each}
      </div>

    {:else}
      <div class="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div class="mb-4 rounded-full bg-zinc-100 p-6 text-zinc-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-16 w-16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-zinc-800">Produk tidak ditemukan</h3>
        <p class="text-sm text-zinc-500">Coba ganti kata kunci atau reset filter kamu.</p>
        <button on:click={resetFilter} class="mt-4 text-sm font-medium text-emerald-600 hover:underline">
          Reset Filter
        </button>
      </div>
    {/if}
  </div>
</section>

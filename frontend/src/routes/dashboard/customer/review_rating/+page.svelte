<script lang="ts">
  import {
    addReviewRatingCustomer,
    getReviewRatingCustomer,
    loadingReview,
    messageHandleReview,
    reviewCustStore,
    type ReviewDTO
  } from '$lib';
  import ReviewModal from '$lib/components/ReviewModal.svelte';
  import { onMount } from 'svelte';
  import NotificationModal from '$lib/components/NotificationModal.svelte';
  import { Star, MessageSquare, ShoppingBag } from '@lucide/svelte';
  import Whatsapp from '../../../../lib/components/Whatsapp.svelte';

  const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;
  let showModal = false;
  let selectedProduct = '';

  onMount(async () => {
    await getReviewRatingCustomer();
  });

  function openModal(productName: string) {
    selectedProduct = productName;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedProduct = '';
  }

  async function handleSubmitReview(data: ReviewDTO) {
    await addReviewRatingCustomer(data);
    closeModal();
  }
</script>

<div class="space-y-8 min-h-screen pb-20">

  <div class="flex items-center justify-between border-b border-zinc-200 pb-6">
    <div>
       <h1 class="text-3xl font-bold tracking-tight text-zinc-800">Product Review</h1>
       <p class="mt-1 text-sm text-zinc-500">Berikan penilaian untuk produk yang telah Anda beli.</p>
    </div>
  </div>

  <Whatsapp/>

  {#if $messageHandleReview}
    <NotificationModal
      message={$messageHandleReview.message}
      type={$messageHandleReview.type}
      onClose={() => messageHandleReview.set(null)}
    />
  {/if}

  {#if $loadingReview}
    <div class="flex flex-col items-center justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800"></div>
      <p class="mt-4 text-sm font-medium text-zinc-500">Memuat daftar produk...</p>
    </div>
  {:else if $reviewCustStore && $reviewCustStore.length > 0}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each $reviewCustStore as item}
        <div
          class="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
        >
          <div class="relative aspect-square overflow-hidden bg-zinc-100">
             <img
              src={`${BASE_URL}/uploads/${item.produk_gambar}`}
              alt={item.produk_nama}
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          <div class="flex flex-1 flex-col p-5">
            <h3 class="line-clamp-2 text-base font-bold text-zinc-800" title={item.produk_nama}>
              {item.produk_nama}
            </h3>
            <p class="mt-2 text-xs text-zinc-500 line-clamp-2">
              Bagikan pengalaman Anda menggunakan produk ini kepada pengguna lain.
            </p>

            <div class="mt-5 pt-4 border-t border-zinc-100">
               <button
                on:click={() => openModal(item.produk_nama)}
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-95"
              >
                <MessageSquare class="h-4 w-4" />
                Tulis Ulasan
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <ReviewModal
      bind:visible={showModal}
      productName={selectedProduct}
      onSubmit={(data) => handleSubmitReview(data)}
      onClose={closeModal}
    />
  {:else}
    <div class="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center">
      <div class="mb-4 rounded-full bg-zinc-100 p-4 ring-1 ring-zinc-200">
         <ShoppingBag class="h-8 w-8 text-zinc-400" />
      </div>
      <h3 class="text-lg font-bold text-zinc-800">Belum ada produk untuk diulas</h3>
      <p class="mt-1 max-w-sm text-sm text-zinc-500">
        Anda belum melakukan transaksi atau semua produk sudah Anda ulas.
      </p>
      <a href="/dashboard/customer/history_pemesanan" class="mt-6 font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
        Cek Riwayat Pesanan &rarr;
      </a>
    </div>
  {/if}
</div>

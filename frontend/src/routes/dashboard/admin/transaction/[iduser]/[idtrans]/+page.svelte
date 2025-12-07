<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { getTransById, oneTransaksiAdminStore } from '$lib';
  import { onMount } from 'svelte';

  const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

  $: idUser = $page.params.iduser;
  $: idTrans = $page.params.idtrans;

  $: if (idUser && idTrans) {
    console.log("Fetching for:", idUser, idTrans);
    getTransById(idUser, idTrans);
  }

  function handleBack() {
    goto('/dashboard/admin/transaction');
  }
</script>

<div class="space-y-6">
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
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    Kembali
  </button>

  {#if $oneTransaksiAdminStore}
    <div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4">
        <div class="relative h-64 w-full overflow-hidden rounded-xl bg-zinc-100">
          <img
            src={`${BASE_URL}/uploads/${$oneTransaksiAdminStore.transaksi_img}`}
            alt={$oneTransaksiAdminStore.user_nama}
            class="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        </div>

        <div>
          <h1 class="text-2xl font-bold text-zinc-800">{$oneTransaksiAdminStore.user_nama}</h1>
          <p class="text-zinc-500">ID Transaksi: {$oneTransaksiAdminStore.transaksi_id}</p>

          <code class="mt-2 block rounded bg-zinc-100 p-2 text-xs text-zinc-500">
            Source: {$oneTransaksiAdminStore.transaksi_img}
          </code>
        </div>

        <div class="mt-4">
            <h3 class="font-semibold text-zinc-800 mb-2">Detail Item:</h3>
            {#each $oneTransaksiAdminStore.transaksi_detail as detail}
                <div class="flex items-center gap-4 border-b border-zinc-50 py-2">
                    <img
                        src={`${BASE_URL}/uploads/${detail.produk_gambar}`}
                        alt={detail.detail_nama}
                        class="h-12 w-12 rounded bg-zinc-100 object-cover"
                    />
                    <div>
                        <p class="text-sm font-medium">{detail.detail_nama}</p>
                        <p class="text-xs text-zinc-500">{detail.detail_stok} x Rp {parseInt(detail.detail_sub_total).toLocaleString()}</p>
                    </div>
                </div>
            {/each}
        </div>

      </div>
    </div>
  {:else}
    <div class="flex h-40 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50">
      <div class="flex flex-col items-center gap-2 text-zinc-400">
        <div class="h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"></div>
        <p class="text-sm">Memuat data transaksi...</p>
      </div>
    </div>
  {/if}
</div>

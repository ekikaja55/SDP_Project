<script lang="ts">
  import { getStatusTransaksi, loadingTrans, transaksiStore } from '$lib';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    Truck,
    PackageCheck,
    Clock,
    ChevronRight,
    Loader2,
    MapPin,
    Filter
  } from '@lucide/svelte';
  import Whatsapp from '../../../../lib/components/Whatsapp.svelte';

  let selectedStatus = '';

  const statusOptions = [
    '',
    'Belum Dikonfirmasi',
    'Pesanan Sedang Diproses',
    'Pesanan Sedang Dalam Pengiriman'
  ];

  onMount(() => {
    refreshTransaksi();
  });

  async function refreshTransaksi() {
    await getStatusTransaksi(selectedStatus);
  }

  function getStatusStyles(status: string) {
    switch (status) {
      case 'Belum Dikonfirmasi':
        return {
          border: 'border-l-zinc-400',
          badge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          iconColor: 'text-zinc-500'
        };
      case 'Pesanan Sedang Diproses':
        return {
          border: 'border-l-amber-500',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          iconColor: 'text-amber-600'
        };
      case 'Pesanan Sedang Dalam Pengiriman':
        return {
          border: 'border-l-indigo-500',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          iconColor: 'text-indigo-600'
        };
      default:
        return {
          border: 'border-l-zinc-300',
          badge: 'bg-zinc-50 text-zinc-600',
          iconColor: 'text-zinc-400'
        };
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'Belum Dikonfirmasi': return Clock;
      case 'Pesanan Sedang Diproses': return Loader2; // Ikon loading
      case 'Pesanan Sedang Dalam Pengiriman': return Truck;
      default: return Clock;
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

<div class="space-y-6 min-h-screen pb-20">

  <div class="flex flex-col gap-4 border-b border-zinc-200 pb-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-zinc-800">Ordering Status</h1>
        <p class="mt-1 text-sm text-zinc-500">Lacak proses pesanan yang sedang berjalan.</p>
      </div>
      <div class="hidden sm:block">
        <Whatsapp/>
      </div>
    </div>
    <div class="sm:hidden">
        <Whatsapp/>
    </div>
  </div>

  <div class="relative max-h-[75vh] overflow-y-auto custom-scroll rounded-2xl border border-zinc-200 bg-zinc-50/50 shadow-inner">

    <div class="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur-sm shadow-sm">
      <div class="flex items-center gap-2 text-zinc-600">
        <Filter class="h-4 w-4" />
        <span class="text-sm font-semibold">Filter Status</span>
      </div>

      <select
        bind:value={selectedStatus}
        on:change={refreshTransaksi}
        class="rounded-lg border-zinc-200 bg-zinc-50 py-1.5 pl-3 pr-8 text-sm font-medium text-zinc-700 focus:border-zinc-400 focus:ring-0 cursor-pointer transition hover:bg-zinc-100"
      >
        <option value="">Semua Proses</option>
        {#each statusOptions.slice(1) as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <div class="p-4 space-y-4">
      {#if $loadingTrans}
        <div class="flex flex-col items-center justify-center py-20">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-indigo-600"></div>
          <p class="mt-4 text-sm font-medium text-zinc-500">Memuat status pesanan...</p>
        </div>
      {:else if $transaksiStore && $transaksiStore.length > 0}
        {#each $transaksiStore as item}
          {@const styles = getStatusStyles(item.transaksi_status)}

          <div
            class={`group relative flex flex-col gap-4 rounded-xl border-y border-r border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md ${styles.border} border-l-4`}
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
               <div class="flex items-center gap-3">
                  <div class={`p-2 rounded-full bg-zinc-50 ${styles.iconColor}`}>
                    <svelte:component
                      this={getStatusIcon(item.transaksi_status)}
                      class={`h-5 w-5 ${item.transaksi_status === 'Pesanan Sedang Diproses' ? 'animate-spin' : ''}`}
                    />
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-zinc-800">{item.transaksi_id}</h3>
                    <p class="text-xs text-zinc-500 mt-0.5">
                       Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
               </div>

               <span class={`self-start sm:self-center inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${styles.badge}`}>
                  {item.transaksi_status}
               </span>
            </div>

            <div class="border-t border-zinc-100"></div>

            <div class="flex items-center justify-between">
               <div>
                  <p class="text-xs text-zinc-500 mb-1">Total Pembayaran</p>
                  <p class="text-lg font-bold text-zinc-900 font-mono">
                    {formatRupiah(item.transaksi_grand_total)}
                  </p>
               </div>

               <button
                  on:click={() => goto(`/dashboard/customer/history_pemesanan/${item.transaksi_id}`)}
                  class="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-95"
               >
                  Lihat Detail
                  <ChevronRight class="h-4 w-4" />
               </button>
            </div>

          </div>
        {/each}
      {:else}
        <div class="flex flex-col items-center justify-center py-20 text-center">
          <div class="mb-4 rounded-full bg-zinc-100 p-6">
            <PackageCheck class="h-12 w-12 text-zinc-300" />
          </div>
          <h3 class="text-lg font-bold text-zinc-800">Tidak ada pesanan aktif</h3>
          <p class="mt-1 max-w-xs text-sm text-zinc-500">Semua pesanan Anda mungkin sudah selesai atau belum ada pesanan baru.</p>
          <a href="/" class="mt-6 font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
             Cari Produk Baru &rarr;
          </a>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Custom Scrollbar */
  .custom-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background-color: #d4d4d8;
    border-radius: 20px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #a1a1aa;
  }
</style>

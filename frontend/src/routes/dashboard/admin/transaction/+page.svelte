<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    getTransAdmin,
    loadingTrans,
    transaksiAdminStore,
    getStatusColorTrans
  } from '$lib';
  import { RefreshCcw, FileSpreadsheet, ChevronRight, Receipt } from '@lucide/svelte';

  let selectedStatus = '';

  const statusOptions = [
    'Belum Dikonfirmasi',
    'Pesanan Dibatalkan',
    'Pesanan Sedang Diproses',
    'Pesanan Sedang Dalam Pengiriman',
    'Pesanan Selesai'
  ];

  onMount(() => {
    refreshTransaksi();
  });

  async function refreshTransaksi() {
    await getTransAdmin(selectedStatus);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatRupiah = (number: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(number.replace(/[^0-9.-]+/g,"")));
  };
</script>

<div class="space-y-6">
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
     <div>
      <h1 class="text-3xl font-bold tracking-tight text-zinc-800">Transaction Management</h1>
      <p class="text-sm text-zinc-500">Kelola dan pantau status transaksi customer.</p>
    </div>
    <div class="flex gap-3">
      <button
        on:click={() => goto('laporan_penjualan')}
        class="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
      >
        <FileSpreadsheet class="h-4 w-4" />
        Rekap Penjualan
      </button>
    </div>
  </div>

  <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
    <div class="flex items-center gap-3">
      <label class="text-sm font-medium text-zinc-600">Filter Status:</label>
      <select
        bind:value={selectedStatus}
        on:change={refreshTransaksi}
        class="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer"
      >
        <option value="">Semua Status</option>
        {#each statusOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <button
      on:click={() => {
        selectedStatus = '';
        refreshTransaksi();
      }}
      class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
    >
      <RefreshCcw class="h-3.5 w-3.5" />
      Reset
    </button>
  </div>

  <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
    {#if $loadingTrans}
      <div class="flex justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent"></div>
      </div>
    {:else if $transaksiAdminStore && $transaksiAdminStore.length > 0}
      <div class="max-h-[70vh] overflow-y-auto overflow-x-auto custom-scroll relative">
        <table class="w-full text-left text-sm">
          <thead class="sticky top-0 z-10 bg-zinc-50 text-zinc-500 border-b border-zinc-200 shadow-sm">
            <tr>
              <th class="px-6 py-4 font-medium whitespace-nowrap">ID Transaksi</th>
              <th class="px-6 py-4 font-medium whitespace-nowrap">Tanggal</th>
              <th class="px-6 py-4 font-medium whitespace-nowrap">Customer</th>
              <th class="px-6 py-4 font-medium whitespace-nowrap">Total</th>
              <th class="px-6 py-4 font-medium whitespace-nowrap">Status</th>
              <th class="px-6 py-4 font-medium text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            {#each $transaksiAdminStore as item}
              <tr class="transition hover:bg-zinc-50/50 group">

                <td class="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap">
                  <span class="font-mono">{item.transaksi_id}</span>
                </td>

                <td class="px-6 py-4 text-zinc-600 whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-zinc-800">{item.user_nama}</div>
                  <div class="text-xs text-zinc-400 font-mono">{item.user_id}</div>
                </td>

                <td class="px-6 py-4 font-semibold text-zinc-800 whitespace-nowrap">
                  {formatRupiah(item.transaksi_grand_total)}
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColorTrans(item.transaksi_status)}`}>
                    {item.transaksi_status}
                  </span>
                </td>

                <td class="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    on:click={() => goto(`/dashboard/admin/transaction/${item.user_id}/${item.transaksi_id}`)}
                    class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900"
                  >
                    Detail
                    <ChevronRight class="h-3 w-3" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center py-24 text-center">
        <div class="rounded-full bg-zinc-100 p-6 mb-4">
            <Receipt class="h-10 w-10 text-zinc-300"/>
        </div>
        <h3 class="text-lg font-semibold text-zinc-900">Belum ada transaksi</h3>
        <p class="text-zinc-500 max-w-xs mx-auto mt-1">Transaksi yang masuk akan ditampilkan di sini.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Custom Scrollbar Style */
  .custom-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background-color: #d4d4d8; /* zinc-300 */
    border-radius: 20px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #a1a1aa; /* zinc-400 */
  }
</style>

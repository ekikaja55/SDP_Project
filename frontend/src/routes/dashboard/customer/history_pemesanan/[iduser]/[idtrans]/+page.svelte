<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import {
    getTransById,
    loadingTrans,
    oneTransaksiAdminStore,
  } from '$lib';
  import BuktiModal from '$lib/components/BuktiModal.svelte';

  import {
    ArrowLeft, Check, Clock, Package, Truck,
    CheckCircle2, Receipt, User, X, CreditCard, ShoppingBag, Eye, Copy, ShieldCheck
  } from '@lucide/svelte';

  const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

  let showBuktiModal = false;

  $: idUser = $page.params.iduser;
  $: idTrans = $page.params.idtrans;

  $: if (idUser && idTrans) {
    getTransById(idUser, idTrans);
  }

  // --- STEPPER DATA ---
  const steps = [
    { label: 'Menunggu', fullLabel: 'Belum Dikonfirmasi', icon: Clock },
    { label: 'Diproses', fullLabel: 'Pesanan Sedang Diproses', icon: Package },
    { label: 'Dikirim', fullLabel: 'Pesanan Sedang Dalam Pengiriman', icon: Truck },
    { label: 'Selesai', fullLabel: 'Pesanan Selesai', icon: CheckCircle2 }
  ];

  $: currentStepIndex = steps.findIndex(s => s.fullLabel === $oneTransaksiAdminStore?.transaksi_status);
  $: isCancelled = $oneTransaksiAdminStore?.transaksi_status === 'Pesanan Dibatalkan';

  function handleBack() {
    goto('/dashboard/customer/history_pemesanan');
  }

  const formatRupiah = (val: string | number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
</script>

{#if showBuktiModal && $oneTransaksiAdminStore}
  <BuktiModal
    img={`${BASE_URL}/uploads/${$oneTransaksiAdminStore.transaksi_img}`}
    title="Bukti Pembayaran Anda"
    onClose={() => showBuktiModal = false}
  />
{/if}

<div class="flex h-[calc(100vh-2rem)] flex-col bg-zinc-50 font-sans overflow-hidden">

  <div class="flex-shrink-0 z-30 bg-white shadow-sm border-b border-zinc-200 relative">
    <div class="px-6 py-4 flex items-center justify-between">
       <div class="flex items-center gap-4">
          <button
            on:click={handleBack}
            class="group rounded-full border border-zinc-200 p-2 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-300"
          >
             <ArrowLeft class="h-6 w-6"/>
          </button>
          <div>
             <h1 class="text-xl font-bold text-zinc-900 tracking-tight">Detail Pesanan</h1>
             {#if $oneTransaksiAdminStore}
                <button
                  on:click={() => copyToClipboard($oneTransaksiAdminStore.transaksi_id)}
                  class="flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-indigo-600 transition-colors cursor-pointer group"
                >
                   <span>#{$oneTransaksiAdminStore.transaksi_id}</span>
                   <Copy class="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
             {/if}
          </div>
       </div>

       <div>
          {#if isCancelled}
            <span class="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-600 border border-rose-100">
               <X class="h-4 w-4"/> Dibatalkan
            </span>
          {:else if $oneTransaksiAdminStore}
             <div class="flex flex-col items-end">
                <span class="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                   <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                   </span>
                   <span>{$oneTransaksiAdminStore.transaksi_status}</span>
                </span>
             </div>
          {/if}
       </div>
    </div>

    {#if $oneTransaksiAdminStore && !isCancelled}
        <div class="bg-zinc-50/50 border-t border-zinc-200 px-4 py-4 hidden sm:block">
            <div class="max-w-4xl mx-auto relative">
                <div class="absolute top-4 left-0 w-full h-1 bg-zinc-200 rounded-full -z-0"></div>
                <div class="relative z-10 grid grid-cols-4 w-full">
                    {#each steps as step, i}
                        {@const isCompleted = i < currentStepIndex}
                        {@const isCurrent = i === currentStepIndex}

                        <div class="flex flex-col items-center group cursor-default">
                            <div class={`
                                flex h-9 w-9 items-center justify-center rounded-full border-[3px] transition-all duration-300 bg-white
                                ${isCompleted ? 'border-indigo-600 text-indigo-600' : ''}
                                ${isCurrent ? 'border-indigo-500 text-indigo-600 scale-110 shadow-md ring-2 ring-white' : ''}
                                ${!isCompleted && !isCurrent ? 'border-zinc-300 text-zinc-300' : ''}
                            `}>
                                {#if isCompleted} <Check class="h-4 w-4" strokeWidth={3} />
                                {:else} <svelte:component this={step.icon} class="h-4 w-4" />
                                {/if}
                            </div>
                            <span class={`mt-2 text-xs font-bold text-center ${isCurrent ? 'text-indigo-700' : 'text-zinc-500'}`}>
                                {step.label}
                            </span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}

    {#if $oneTransaksiAdminStore}
      <div class="lg:hidden bg-indigo-50/60 border-t border-b border-indigo-100 px-6 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-full bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                  {$oneTransaksiAdminStore.user_nama.charAt(0)}
              </div>
              <div class="flex flex-col">
                  <span class="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Pembeli</span>
                  <span class="text-sm font-bold text-zinc-900 truncate max-w-[120px]">{$oneTransaksiAdminStore.user_nama}</span>
              </div>
          </div>
          <button
              on:click={() => showBuktiModal = true}
              class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
          >
              <Eye class="h-4 w-4"/> Lihat Bukti
          </button>
      </div>
    {/if}
  </div>

  <div class="flex flex-1 overflow-hidden relative z-10">
    {#if $loadingTrans && !$oneTransaksiAdminStore}
       <div class="w-full flex items-center justify-center h-full">
          <div class="flex flex-col items-center gap-3">
             <div class="h-8 w-8 animate-spin rounded-full border-[3px] border-zinc-200 border-t-indigo-600"></div>
             <span class="text-sm font-medium text-zinc-500">Memuat data...</span>
          </div>
       </div>

    {:else if $oneTransaksiAdminStore}
       <div class="hidden lg:flex w-[350px] flex-shrink-0 border-r border-zinc-200 bg-white flex-col h-full overflow-hidden">
          <div class="flex-1 overflow-y-auto custom-scroll p-6 space-y-6">

             <div class="space-y-3">
                 <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <User class="h-4 w-4"/> Informasi Pelanggan
                 </h3>
                 <div class="rounded-xl border border-zinc-200 p-4 bg-zinc-50/50">
                     <div class="flex items-center gap-3">
                         <div class="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                             {$oneTransaksiAdminStore.user_nama.charAt(0)}
                         </div>
                         <div>
                             <p class="text-base font-bold text-zinc-900">{$oneTransaksiAdminStore.user_nama}</p>
                             <p class="text-xs text-zinc-500">ID: {$oneTransaksiAdminStore.user_id}</p>
                         </div>
                     </div>
                 </div>
             </div>

             <div class="space-y-3">
                 <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Receipt class="h-4 w-4"/> Pembayaran
                 </h3>
                 <div class="rounded-xl border border-zinc-200 p-5 text-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                     <div class="mb-3 flex justify-center">
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
                           <ShieldCheck class="h-3.5 w-3.5"/> Pembayaran Valid
                        </span>
                     </div>
                     <p class="text-xs text-zinc-500 mb-4">
                        Bukti transfer tersedia.
                     </p>
                     <button
                         on:click={() => showBuktiModal = true}
                         class="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                     >
                         <Eye class="h-4 w-4"/> Lihat Bukti Transfer
                     </button>
                 </div>
             </div>
          </div>
       </div>

       <div class="flex-1 flex flex-col bg-zinc-50/30 min-w-0 h-full relative">

          <div class="px-6 py-4 border-b border-zinc-200 bg-white/90 backdrop-blur z-20 flex justify-between items-center shrink-0">
             <h3 class="font-bold text-base text-zinc-800 flex items-center gap-2">
                <ShoppingBag class="h-5 w-5 text-zinc-400"/> Daftar Barang
             </h3>
             <span class="bg-zinc-100 text-zinc-600 border border-zinc-200 px-2.5 py-0.5 rounded-md text-xs font-bold">
                 {$oneTransaksiAdminStore.transaksi_detail.length} Item
             </span>
          </div>

          <div class="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6">
             <div class="space-y-3 max-w-4xl mx-auto">
                 {#each $oneTransaksiAdminStore.transaksi_detail as detail}
                    <div class="flex gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all">
                        <div class="h-20 w-20 shrink-0 rounded-lg bg-zinc-50 border border-zinc-200 overflow-hidden">
                             <img
                                src={`${BASE_URL}/uploads/${detail.produk_gambar}`}
                                alt={detail.detail_nama}
                                class="h-full w-full object-cover"
                             />
                        </div>

                        <div class="flex-1 min-w-0 flex flex-col justify-center">
                             <h4 class="font-bold text-zinc-900 text-base mb-1 truncate">{detail.detail_nama}</h4>
                             <div class="flex items-center gap-2 text-sm text-zinc-500">
                                <span class="font-medium text-zinc-700">{detail.detail_stok} x</span>
                                <span>{formatRupiah(detail.produk_harga ?? 0)}</span>
                             </div>
                        </div>

                        <div class="text-right flex flex-col justify-center pl-4 border-l border-zinc-50">
                             <p class="text-[10px] text-zinc-400 font-bold uppercase mb-0.5">Total</p>
                             <p class="font-bold text-lg text-indigo-600 font-mono">{formatRupiah(detail.detail_sub_total)}</p>
                        </div>
                    </div>
                 {/each}
                 <div class="h-4"></div>
             </div>
          </div>

          <div class="shrink-0 bg-white border-t border-zinc-200 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-30">
             <div class="max-w-4xl mx-auto flex items-center justify-end gap-6">

                <div class="text-right">
                   <p class="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-1">Total Pembayaran</p>
                   <div class="flex items-baseline justify-end gap-1">
                      <span class="text-3xl font-bold text-indigo-600 tracking-tight font-sans">
                         {formatRupiah($oneTransaksiAdminStore.transaksi_grand_total)}
                      </span>
                   </div>
                </div>

             </div>
          </div>

       </div>

    {:else}
       <div class="w-full flex items-center justify-center bg-zinc-50 h-full">
          <p class="text-zinc-400 font-medium">Data tidak ditemukan</p>
       </div>
    {/if}
  </div>
</div>

<style>
  .custom-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background-color: #e4e4e7;
    border-radius: 20px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #a1a1aa;
  }
</style>

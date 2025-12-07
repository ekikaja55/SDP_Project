<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import {
    getTransById,
    loadingTrans,
    messageHandleTrans,
    oneTransaksiAdminStore,
    updateTransaksi,
    type TransaksiUpdateDTO
  } from '$lib';
  import NotificationModal from '$lib/components/NotificationModal.svelte';
  import BuktiModal from '$lib/components/BuktiModal.svelte';

  import {
    ArrowLeft, Save, Check, X, Clock, Package, Truck,
    CheckCircle2, Receipt, User, MapPin,

	Eye

  } from '@lucide/svelte';

  const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

  let statusTrans: string = '';
  let isUpdating = false;
  let showBuktiModal = false;

  $: idUser = $page.params.iduser;
  $: idTrans = $page.params.idtrans;

  $: if (idUser && idTrans) {
    getTransById(idUser, idTrans);
  }

  $: if ($oneTransaksiAdminStore) {
    statusTrans = $oneTransaksiAdminStore.transaksi_status;
  }

  // --- STEPPER DATA ---
  const steps = [
    { label: 'Pending', fullLabel: 'Belum Dikonfirmasi', icon: Clock },
    { label: 'Proses', fullLabel: 'Pesanan Sedang Diproses', icon: Package },
    { label: 'Dikirim', fullLabel: 'Pesanan Sedang Dalam Pengiriman', icon: Truck },
    { label: 'Selesai', fullLabel: 'Pesanan Selesai', icon: CheckCircle2 }
  ];

  $: currentStepIndex = steps.findIndex(s => s.fullLabel === $oneTransaksiAdminStore?.transaksi_status);
  $: isCancelled = $oneTransaksiAdminStore?.transaksi_status === 'Pesanan Dibatalkan';

  function handleBack() {
    goto('/dashboard/admin/transaction');
  }

  async function handleSubmit() {
    if (!$oneTransaksiAdminStore) return;
    isUpdating = true;
    const payload: TransaksiUpdateDTO = {
      transaksi_id: $oneTransaksiAdminStore.transaksi_id,
      transaksi_status: statusTrans
    };
    await updateTransaksi(payload, $oneTransaksiAdminStore.user_nama);
    await getTransById(idUser, idTrans);
    isUpdating = false;
  }

  const formatRupiah = (val: string | number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(val));
  }
</script>

{#if $messageHandleTrans}
  <NotificationModal
    message={$messageHandleTrans.message}
    type={$messageHandleTrans.type}
    onClose={() => messageHandleTrans.set(null)}
  />
{/if}

{#if showBuktiModal && $oneTransaksiAdminStore}
  <BuktiModal
    img={`${BASE_URL}/uploads/${$oneTransaksiAdminStore.transaksi_img}`}
    onClose={() => showBuktiModal = false}
  />
{/if}

<div class="flex h-[calc(100vh-2rem)] flex-col bg-zinc-50/50 overflow-hidden">

  <div class="flex-shrink-0 z-20 border-b border-zinc-200 bg-white shadow-sm relative">
    <div class="flex items-center justify-between px-6 py-4">
       <div class="flex items-center gap-4">
          <button on:click={handleBack} class="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition">
             <ArrowLeft class="h-5 w-5"/>
          </button>
          <div>
             <h1 class="text-xl font-bold text-zinc-800 flex items-center gap-2">
                Detail Transaksi
                {#if $oneTransaksiAdminStore}
                  <span class="rounded bg-zinc-100 px-2 py-0.5 text-sm font-mono font-normal text-zinc-500">#{$oneTransaksiAdminStore.transaksi_id}</span>
                {/if}
             </h1>
          </div>
       </div>

       <div class="flex items-center gap-3">
          {#if isCancelled}
            <span class="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-600 border border-rose-100">
               <X class="h-4 w-4"/> Dibatalkan
            </span>
          {:else if $oneTransaksiAdminStore}
             <span class="text-sm text-zinc-400 mr-2 hidden md:inline">Status Saat Ini:</span>
             <span class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-600 border border-indigo-100">
                {$oneTransaksiAdminStore.transaksi_status}
             </span>
          {/if}
       </div>
    </div>

    {#if $oneTransaksiAdminStore && !isCancelled}
        <div class="bg-zinc-50/80 px-6 py-4 border-t border-zinc-100 backdrop-blur-sm">
            <div class="flex items-center justify-center w-full max-w-4xl mx-auto">
                {#each steps as step, i}
                    {@const isCompleted = i < currentStepIndex}
                    {@const isCurrent = i === currentStepIndex}

                    {#if i !== 0}
                       <div class={`h-1 flex-1 mx-4 rounded-full ${isCompleted ? 'bg-indigo-500' : 'bg-zinc-200'}`}></div>
                    {/if}

                    <div class="flex items-center gap-3">
                        <div class={`
                            flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm
                            ${isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' : ''}
                            ${isCurrent ? 'bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-50 scale-110' : ''}
                            ${!isCompleted && !isCurrent ? 'bg-white border-zinc-300 text-zinc-300' : ''}
                        `}>
                            {#if isCompleted} <Check class="h-5 w-5" strokeWidth={3} />
                            {:else} <svelte:component this={step.icon} class="h-5 w-5" />
                            {/if}
                        </div>
                        <span class={`text-sm font-bold hidden md:block ${isCurrent || isCompleted ? 'text-zinc-800' : 'text-zinc-400'}`}>
                            {step.label}
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
  </div>

  <div class="flex flex-1 overflow-hidden relative z-10">

    {#if $loadingTrans && !$oneTransaksiAdminStore}
       <div class="w-full flex items-center justify-center">
          <div class="flex flex-col items-center">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800 mb-4"></div>
            <span class="text-sm font-medium text-zinc-500 animate-pulse">Memuat detail transaksi...</span>
          </div>
       </div>

    {:else if $oneTransaksiAdminStore}
       <div class="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 border-r border-zinc-200 bg-white overflow-y-auto custom-scroll">
          <div class="p-6 space-y-8">

             <div class="rounded-2xl border border-zinc-200 p-5 shadow-sm bg-zinc-50/50">
                <h3 class="text-sm font-bold uppercase text-zinc-500 mb-4 tracking-wider flex items-center gap-2">
                    ⚡ Aksi Admin
                </h3>
                <div class="space-y-4">
                    <div class="relative">
                        <select
                            bind:value={statusTrans}
                            disabled={isUpdating}
                            class="w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 hover:border-zinc-400 disabled:bg-zinc-100 cursor-pointer pr-10"
                        >
                            <option value="" disabled>Pilih Status Update...</option>
                            <option value="Belum Dikonfirmasi">Belum Dikonfirmasi</option>
                            <option value="Pesanan Sedang Diproses">Pesanan Sedang Diproses</option>
                            <option value="Pesanan Sedang Dalam Pengiriman">Sedang Dalam Pengiriman</option>
                            <option value="Pesanan Selesai">Pesanan Selesai</option>
                            <option disabled>────────────────</option>
                            <option value="Pesanan Dibatalkan" class="text-rose-600 font-bold">⚠️ Batalkan Pesanan</option>
                        </select>
                         <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                         </div>
                    </div>

                    <button
                        on:click={handleSubmit}
                        disabled={isUpdating || statusTrans === $oneTransaksiAdminStore.transaksi_status}
                        class="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white shadow-md transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg disabled:shadow-none"
                    >
                        {#if isUpdating}
                            <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Menyimpan...
                        {:else}
                            <Save class="h-4 w-4" /> Simpan Perubahan
                        {/if}
                    </button>
                </div>
             </div>

             <div class="space-y-6">
                 <div>
                    <h3 class="text-base font-bold text-zinc-800 mb-3 flex items-center gap-2">
                        <User class="h-5 w-5 text-zinc-500"/> Customer
                    </h3>
                    <div class="rounded-2xl border border-zinc-200 p-5 space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500">
                                {$oneTransaksiAdminStore.user_nama.charAt(0)}
                            </div>
                            <div>
                                <p class="text-base font-bold text-zinc-900">{$oneTransaksiAdminStore.user_nama}</p>
                                <p class="text-xs text-zinc-500 font-mono">ID: {$oneTransaksiAdminStore.user_id}</p>
                            </div>
                        </div>
                        <div class="pt-3 border-t border-zinc-100 flex items-center gap-2 text-sm text-zinc-600">
                             <Clock class="h-4 w-4 text-zinc-400"/>
                             {new Date($oneTransaksiAdminStore.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short'})}
                        </div>
                    </div>
                 </div>

                 <div>
                    <h3 class="text-base font-bold text-zinc-800 mb-3 flex items-center gap-2">
                        <Receipt class="h-5 w-5 text-zinc-500"/> Pembayaran
                    </h3>
                    <div class="rounded-2xl border border-zinc-200 p-5 flex items-center justify-between bg-indigo-50/30">
                        <div>
                            <p class="text-sm font-bold text-indigo-900">Bukti Terlampir</p>
                        </div>
                        <button
                            on:click={() => showBuktiModal = true}
                            class="flex items-center gap-2 text-xs bg-white border border-indigo-200 text-indigo-600 px-4 py-2 rounded-xl font-bold hover:bg-indigo-50 transition shadow-sm"
                        >
                            <Eye class="h-4 w-4"/> Lihat Bukti
                        </button>
                    </div>
                 </div>
             </div>

          </div>
       </div>

       <div class="flex-1 flex flex-col bg-zinc-50/30 min-w-0">

          <div class="px-8 py-5 border-b border-zinc-200 bg-white/80 backdrop-blur flex justify-between items-center sticky top-0 z-10">
             <h3 class="font-bold text-xl text-zinc-800 flex items-center gap-2">
                <Package class="h-5 w-5 text-zinc-500"/> Rincian Barang
            </h3>
             <span class="bg-zinc-900 text-zinc-50 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                 {$oneTransaksiAdminStore.transaksi_detail.length} Item
             </span>
          </div>

          <div class="flex-1 overflow-y-auto custom-scroll p-8">
             <div class="space-y-6">
                 {#each $oneTransaksiAdminStore.transaksi_detail as detail}
                    <div class="flex gap-5 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm transition hover:border-zinc-300 hover:shadow-md">
                        <div class="h-20 w-20 shrink-0 rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden p-1">
                             <img
                                src={`${BASE_URL}/uploads/${detail.produk_gambar}`}
                                alt={detail.detail_nama}
                                class="h-full w-full object-cover rounded-lg"
                             />
                        </div>
                        <div class="flex-1 min-w-0 flex flex-col justify-center">
                             <h4 class="font-bold text-zinc-900 text-base truncate mb-1" title={detail.detail_nama}>{detail.detail_nama}</h4>
                             <div class="flex items-center gap-2 text-sm text-zinc-500">
                                <span class="font-medium text-zinc-700">{formatRupiah(detail.produk_harga ?? 0)}</span>
                                <span class="text-zinc-300">•</span>
                                <span class="bg-zinc-100 px-2 py-0.5 rounded text-zinc-600 text-xs font-bold">x{detail.detail_stok}</span>
                             </div>
                        </div>
                        <div class="text-right flex flex-col justify-center pl-4 border-l border-zinc-100">
                             <p class="text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">Subtotal</p>
                             <p class="font-bold text-lg text-indigo-600 font-mono">{formatRupiah(detail.detail_sub_total)}</p>
                        </div>
                    </div>
                 {/each}
             </div>
          </div>

          <div class="p-8 bg-white border-t border-zinc-200 shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.05)] relative z-20">
             <div class="flex flex-col gap-3 max-w-sm ml-auto">
                <div class="flex justify-between text-sm text-zinc-500">
                    <span>Total Harga Barang</span>
                    <span class="font-medium">{formatRupiah($oneTransaksiAdminStore.transaksi_grand_total)}</span>
                </div>
                 <div class="flex justify-between items-center pt-3 border-t border-zinc-100">
                     <span class="font-bold text-lg text-zinc-800">Total Pembayaran</span>
                     <span class="text-3xl font-bold text-indigo-600 font-mono">
                        {formatRupiah($oneTransaksiAdminStore.transaksi_grand_total)}
                     </span>
                 </div>
             </div>
          </div>
       </div>

    {:else}
       <div class="flex-1 flex items-center justify-center text-zinc-400 font-medium">
          Data tidak ditemukan
       </div>
    {/if}
  </div>

</div>

<style>
  /* Custom Scrollbar */
  .custom-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
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

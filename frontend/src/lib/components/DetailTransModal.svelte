<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { X, Calendar, Receipt, Hash } from '@lucide/svelte';
    import type { RawTransaction } from '$lib'; 

    export let data: RawTransaction;
    export let onClose: () => void;
    
    const formatRupiah = (val: string | number) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(Number(val));
    };

    function handleClose() {
        onClose?.();
    }
</script>

<div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
>
    <div 
        class="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
        transition:fade={{ duration: 200 }}
        on:click={handleClose}
    ></div>

    <div
        class="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-900/5"
        in:scale={{ duration: 200, start: 0.95 }}
        out:fade={{ duration: 150 }}
    >
        <div class="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
            <div class="flex items-center gap-2">
                <div class="rounded-lg bg-zinc-100 p-2 text-zinc-600">
                    <Receipt class="h-5 w-5" />
                </div>
                <div>
                    <h2 class="text-lg font-bold text-zinc-900">Detail Transaksi</h2>
                    <p class="text-xs text-zinc-500">Rincian lengkap pesanan</p>
                </div>
            </div>
            
            <button
                on:click={handleClose}
                class="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
                <X class="h-5 w-5" />
            </button>
        </div>

        <div class="max-h-[70vh] overflow-y-auto p-6">
            
            <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                    <div class="mb-1 flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        <Hash class="h-3 w-3" /> ID Transaksi
                    </div>
                    <p class="font-mono text-sm font-semibold text-zinc-700 break-all">{data.transaksi_id}</p>
                </div>

                <div class="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                    <div class="mb-1 flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        <Calendar class="h-3 w-3" /> Tanggal
                    </div>
                    <p class="text-sm font-semibold text-zinc-700">
                        {new Date(data.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                </div>
            </div>

            <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <table class="w-full text-sm">
                    <thead class="bg-zinc-50 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        <tr>
                            <th class="px-4 py-3 text-left">Produk</th>
                            <th class="px-4 py-3 text-center">Qty</th>
                            <th class="px-4 py-3 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-100">
                        {#if data.transaksi_detail && data.transaksi_detail.length > 0}
                            {#each data.transaksi_detail as item}
                                <tr class="group hover:bg-zinc-50/50">
                                    <td class="px-4 py-3 font-medium text-zinc-700">{item.detail_nama}</td>
                                    <td class="px-4 py-3 text-center text-zinc-600">{item.detail_stok}</td>
                                    <td class="px-4 py-3 text-right font-medium text-zinc-900">
                                        {formatRupiah(item.detail_sub_total)}
                                    </td>
                                </tr>
                            {/each}
                        {:else}
                            <tr>
                                <td colspan="3" class="px-4 py-8 text-center text-zinc-400 italic">
                                    Detail produk tidak tersedia.
                                </td>
                            </tr>
                        {/if}
                    </tbody>
                    <tfoot class="bg-zinc-50/80">
                        <tr>
                            <td colspan="2" class="px-4 py-3 text-right text-xs font-bold text-zinc-500 uppercase tracking-wide">
                                Grand Total
                            </td>
                            <td class="px-4 py-3 text-right text-base font-bold text-emerald-600">
                                {formatRupiah(data.transaksi_grand_total)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <div class="mt-6 flex justify-end">
                <div class="flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-bold text-zinc-600">
                    STATUS: <span class="uppercase text-zinc-900">{data.transaksi_status}</span>
                </div>
            </div>

        </div>
    </div>
</div>
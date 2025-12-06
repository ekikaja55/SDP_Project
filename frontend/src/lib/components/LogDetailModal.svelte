<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import type { AnyLog } from "$lib"; // Sesuaikan path type kamu
  import { createEventDispatcher } from "svelte";

  export let show = false;
  export let log: AnyLog | null = null;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }

  // Helper untuk memformat key object agar lebih rapi (opsional)
  // misal: "product_name" -> "Product Name"
  function formatKey(key: string) {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  // Helper untuk memformat value (Date, null, dll)
  function formatValue(val: any) {
    if (val === null || val === undefined) return "-";
    if (typeof val === "boolean") return val ? "Ya" : "Tidak";
    // Cek jika string adalah format tanggal ISO
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
        return new Date(val).toLocaleString("id-ID", { dateStyle: 'medium', timeStyle: 'short'});
    }
    return val;
  }

  function getActionColor(act: string) {
    switch (act) {
      case "INSERT": return "bg-green-100 text-green-800 border-green-200";
      case "UPDATE": return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELETE": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  }
</script>

{#if show && log}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    transition:fade={{ duration: 200 }}
    on:click={close}
    role="dialog"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      transition:fly={{ y: 20, duration: 300 }}
      on:click|stopPropagation
    >
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h3 class="text-xl font-bold text-gray-800">Detail Aktivitas</h3>
          <div class="flex items-center gap-2 mt-1">
             <span class="text-xs font-mono text-gray-500">{log.id}</span>
             <span class={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${getActionColor(log.log_action)}`}>
                {log.log_action}
             </span>
          </div>
        </div>
        <button on:click={close} class="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto bg-gray-50/50 flex-1">

        <div class="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6">
            <div class="flex-1">
                <span class="text-xs font-semibold text-gray-500 uppercase">Aktor</span>
                <p class="font-medium text-gray-900">{log.log_actor}</p>
            </div>
            <div class="flex-1">
                <span class="text-xs font-semibold text-gray-500 uppercase">Modul</span>
                <p class="font-medium text-gray-900">{log.log_type}</p>
            </div>
            <div class="flex-1">
                <span class="text-xs font-semibold text-gray-500 uppercase">Waktu</span>
                <p class="font-medium text-gray-900">{new Date(log.createdAt).toLocaleString('id-ID')}</p>
            </div>
        </div>

        <div class="mb-6">
            <span class="text-xs font-bold text-gray-500 uppercase mb-2 block">Judul Aktivitas</span>
            <div class="p-3 bg-blue-50 text-blue-900 rounded-lg border border-blue-100 text-sm">
                {log.log_title}
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div class="flex flex-col">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                <div class="w-2 h-2 rounded-full bg-red-400"></div>
                <span class="text-sm font-bold text-gray-700 uppercase tracking-wide">Data Sebelumnya</span>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {#if log.log_desc.before}
                    <div class="divide-y divide-gray-100">
                        {#each Object.entries(log.log_desc.before) as [key, value]}
                            <div class="flex flex-col sm:flex-row sm:justify-between p-3 hover:bg-gray-50 transition text-sm">
                                <span class="font-medium text-gray-500 sm:w-1/3 mb-1 sm:mb-0 capitalize">{formatKey(key)}</span>
                                <span class="text-gray-800 font-medium sm:w-2/3 text-left sm:text-right break-words">{formatValue(value)}</span>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="p-8 text-center text-gray-400 italic bg-gray-50">
                        Tidak ada data sebelumnya (Data Baru)
                    </div>
                {/if}
            </div>
          </div>

          <div class="flex flex-col">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                <div class="w-2 h-2 rounded-full bg-green-400"></div>
                <span class="text-sm font-bold text-gray-700 uppercase tracking-wide">Data Sesudah</span>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {#if log.log_desc.after}
                    <div class="divide-y divide-gray-100">
                        {#each Object.entries(log.log_desc.after) as [key, value]}
                            <div class="flex flex-col sm:flex-row sm:justify-between p-3 hover:bg-gray-50 transition text-sm">
                                <span class="font-medium text-gray-500 sm:w-1/3 mb-1 sm:mb-0 capitalize">{formatKey(key)}</span>
                                <span class="text-gray-800 font-medium sm:w-2/3 text-left sm:text-right break-words">{formatValue(value)}</span>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="p-8 text-center text-gray-400 italic bg-gray-50">
                        Data telah dihapus
                    </div>
                {/if}
            </div>
          </div>

        </div>
      </div>

      <div class="p-4 border-t border-gray-100 bg-white flex justify-end">
        <button
          on:click={close}
          class="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-gray-200"
        >
          Tutup Detail
        </button>
      </div>
    </div>
  </div>
{/if}

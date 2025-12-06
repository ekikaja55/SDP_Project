<script lang="ts">
  import { onMount } from "svelte";
  import { getAllLog, loadingLog, logStore, type AnyLog } from "$lib";
  import LogDetailModal from "$lib/components/LogDetailModal.svelte";

  let actor = "";
  let type = "";
  let action = "";
  let startDate = "";
  let endDate = "";

  let showModal = false;
  let selectedLog: AnyLog | null = null;

  onMount(() => {
    fetchLogs();
  });

  function fetchLogs() {
    getAllLog({
      actor: actor || undefined,
      type: type || undefined,
      action: action || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  }

  function resetFilter() {
    actor = "";
    type = "";
    action = "";
    startDate = "";
    endDate = "";
    fetchLogs();
  }

  function openDetail(log: AnyLog) {
    selectedLog = log;
    showModal = true;
  }

  function formatDatePart(dateStr: string, part: 'date' | 'time') {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (part === 'date') return d.toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
    if (part === 'time') return d.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
    return "";
  }

  function getActionBadgeColor(act: string) {
    switch (act) {
      case "INSERT": return "bg-green-100 text-green-700 ring-1 ring-green-600/20";
      case "UPDATE": return "bg-blue-100 text-blue-700 ring-1 ring-blue-600/20";
      case "DELETE": return "bg-red-100 text-red-700 ring-1 ring-red-600/20";
      default: return "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20";
    }
  }

  function getBorderLeftColor(act: string) {
    switch (act) {
      case "INSERT": return "border-l-green-500";
      case "UPDATE": return "border-l-blue-500";
      case "DELETE": return "border-l-red-500";
      default: return "border-l-gray-300";
    }
  }
</script>

<div class="max-w-7xl mx-auto space-y-6 pb-10"> <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Activity Log</h2>
      <p class="text-gray-500 text-sm mt-1">Pantau riwayat aktivitas dan perubahan data sistem.</p>
    </div>

    <button
      on:click={fetchLogs}
      class="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition flex items-center gap-2 group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Refresh
    </button>
  </div>

  <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
            <label for="actor" class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Actor</label>
            <input type="text" id="actor" bind:value={actor} placeholder="Nama user..." class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition" />
        </div>
        <div>
            <label for="type" class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Modul</label>
            <select id="type" bind:value={type} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm">
                <option value="">Semua</option>
                <option value="TODOLIST">Todolist</option>
                <option value="PRODUCT">Produk</option>
                <option value="TRANSACTION">Transaksi</option>
            </select>
        </div>
        <div>
            <label for="action" class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Action</label>
            <select id="action" bind:value={action} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm">
                <option value="">Semua</option>
                <option value="INSERT">INSERT</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
            </select>
        </div>
        <div class="col-span-1 md:col-span-2 lg:col-span-2 flex gap-2">
            <div class="flex-1">
                <label for="startDate" class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Dari</label>
                <input type="date" id="startDate" bind:value={startDate} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none transition" />
            </div>
            <div class="flex-1">
                <label for="endDate" class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Sampai</label>
                <input type="date" id="endDate" bind:value={endDate} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none transition" />
            </div>
        </div>
    </div>
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
         <button on:click={resetFilter} class="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 font-medium transition">Reset</button>
         <button on:click={fetchLogs} class="px-6 py-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg shadow-md transition transform active:scale-95">Terapkan Filter</button>
    </div>
  </div>

  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">

    {#if $loadingLog}
      <div class="p-12 flex flex-col items-center justify-center text-gray-500 min-h-[300px]">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
        <span class="text-sm font-medium">Sedang memuat data...</span>
      </div>
    {:else if $logStore && $logStore.length > 0}
      <div class="overflow-auto max-h-[70vh]">
        <table class="w-full text-left border-collapse">

          <thead class="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm shadow-sm">
            <tr class="border-b border-gray-200 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <th class="px-6 py-4 w-32">Waktu</th> <th class="px-6 py-4">Aktor</th>
              <th class="px-6 py-4">Modul</th>
              <th class="px-6 py-4">Aksi</th>
              <th class="px-6 py-4 w-1/3">Deskripsi</th>
              <th class="px-6 py-4 text-center w-20">Opsi</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            {#each $logStore as log (log.id)}
              <tr class={`
                  group transition duration-150 hover:bg-blue-50/40
                  border-l-4 ${getBorderLeftColor(log.log_action)}
              `}>

                <td class="px-6 py-3 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-700">
                        {formatDatePart(log.createdAt, 'date')}
                    </span>
                    <span class="text-xs text-gray-400 font-mono">
                        {formatDatePart(log.createdAt, 'time')}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-3">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                            {log.log_actor.charAt(0).toUpperCase()}
                        </div>
                        <span class="text-sm font-medium text-gray-900">{log.log_actor}</span>
                    </div>
                </td>

                <td class="px-6 py-3">
                    <span class="text-xs font-semibold text-gray-500 tracking-wide">
                        {log.log_type}
                    </span>
                </td>

                <td class="px-6 py-3">
                  <span class={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${getActionBadgeColor(log.log_action)}`}>
                    {log.log_action}
                  </span>
                </td>

                <td class="px-6 py-3">
                  <p class="text-sm text-gray-600 truncate max-w-xs group-hover:text-gray-900 transition-colors" title={log.log_title}>
                    {log.log_title}
                  </p>
                </td>

                <td class="px-6 py-3 text-center">
                  <button
                    on:click={() => openDetail(log)}
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
                    title="Lihat Detail"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>

              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
          <span>Menampilkan {$logStore.length} data terbaru</span>
          </div>

    {:else}
      <div class="p-16 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">Tidak ada log ditemukan</h3>
        <p class="text-gray-500 text-sm mt-1 max-w-sm mx-auto">Coba ubah filter tanggal atau kata kunci pencarian kamu untuk menemukan data.</p>
        <button on:click={resetFilter} class="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
            Reset Filter
        </button>
      </div>
    {/if}
  </div>
</div>

<LogDetailModal
  show={showModal}
  log={selectedLog}
  on:close={() => showModal = false}
/>

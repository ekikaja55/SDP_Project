<script lang="ts">
  import { customerStore, getUserData, loadingCust, query } from '$lib';
  import {
    RotateCcw,
    Search,
    Filter,
    User,
    ChevronRight,
    ShoppingBag,
    Calendar
  } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  onMount(() => {
    refreshLaporanCust();
  });

  async function refreshLaporanCust() {
    await getUserData(query);
  }

  function handleReset() {
    query.search = '';
    query.sort = '';
    refreshLaporanCust();
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-emerald-100 text-emerald-600',
      'bg-amber-100 text-amber-600',
      'bg-purple-100 text-purple-600',
      'bg-indigo-100 text-indigo-600',
    ];
    return colors[name.length % colors.length];
  };
</script>

<div class="space-y-6 min-h-screen">

  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-zinc-800">Customer Data</h1>
      <p class="text-sm text-zinc-500">Kelola data customer dan riwayat aktivitas mereka.</p>
    </div>
  </div>

  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div class="relative w-full md:max-w-md">
      <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
      <input
        type="text"
        bind:value={query.search}
        on:input={refreshLaporanCust}
        placeholder="Cari nama atau email..."
        class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm transition focus:border-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-800 placeholder:text-zinc-400"
      />
    </div>

    <div class="flex items-center gap-3 w-full md:w-auto">
      <div class="relative w-full md:w-48">
         <select
          bind:value={query.sort}
          on:change={refreshLaporanCust}
          class="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-4 pr-10 text-sm transition focus:border-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-800 cursor-pointer"
        >
          <option value="">Urutkan</option>
          <option value="terbaru">Terdaftar Baru</option>
          <option value="terlama">Terdaftar Lama</option>
        </select>
        <Filter class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      </div>

      <button
        on:click={handleReset}
        class="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
        title="Reset Filter"
      >
        <RotateCcw class="h-4 w-4" />
      </button>
    </div>
  </div>

  <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
    {#if $loadingCust}
      <div class="flex justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-transparent"></div>
      </div>
    {:else if $customerStore && $customerStore.length > 0}
      <div class="max-h-[70vh] overflow-y-auto overflow-x-auto custom-scroll relative">
        <table class="w-full text-left text-sm">
          <thead class="sticky top-0 z-10 bg-zinc-50 text-zinc-600 shadow-sm border-b border-zinc-200">
            <tr>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">Profil Pengguna</th>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">Role</th>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">Tanggal Bergabung</th>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">Total Transaksi</th>
              <th class="px-6 py-4 font-semibold text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            {#each $customerStore as cust}
              <tr class="group transition duration-200 hover:bg-zinc-50">

                <td class="px-6 py-4 align-middle">
                  <div class="flex items-center gap-4">
                    <div class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(cust.user_nama)}`}>
                      {getInitials(cust.user_nama)}
                    </div>
                    <div>
                      <div class="font-bold text-zinc-900 whitespace-nowrap">{cust.user_nama}</div>
                      <div class="text-xs text-zinc-500">{cust.user_email}</div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 align-middle">
                   {#if cust.user_role === 'admin'}
                     <span class="inline-flex items-center rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-white">
                        Admin
                     </span>
                   {:else}
                     <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Customer
                     </span>
                   {/if}
                </td>

                <td class="px-6 py-4 align-middle">
                  <div class="flex items-center gap-2 text-zinc-600 whitespace-nowrap">
                    <Calendar class="h-4 w-4 text-zinc-400"/>
                    {new Date(cust.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </div>
                </td>

                <td class="px-6 py-4 align-middle">
                  <div class="flex items-center gap-2">
                    <ShoppingBag class="h-4 w-4 text-zinc-400"/>
                    <span class={`font-semibold whitespace-nowrap ${cust.total_transaksi > 0 ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {cust.total_transaksi} Transaksi
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4 align-middle text-right">
                  <button
                    on:click={() => goto(`/dashboard/admin/manage_customer/${cust.id}`)}
                    class="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-900 whitespace-nowrap"
                  >
                    Lihat Detail
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
            <User class="h-10 w-10 text-zinc-300"/>
        </div>
        <h3 class="text-lg font-semibold text-zinc-900">Belum ada pelanggan</h3>
        <p class="text-zinc-500 max-w-xs mx-auto mt-1">Data pelanggan akan muncul di sini setelah mereka mendaftar.</p>
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
    background-color: #d4d4d8; /* zinc-300 */
    border-radius: 20px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #a1a1aa; /* zinc-400 */
  }
</style>

<script lang="ts">
  import { type UserAuth } from '$lib';
  import {
    Package,
    ClipboardList,
    Receipt,
    Users,
    History,
    LogOut,
  } from '@lucide/svelte';

  export let onLogout: () => void;
  export let data: UserAuth;

  function firstTwoWords(text: string = "") {
		return text.trim().split(/\s+/).slice(0, 2).join(' ');
	}
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'AD';
</script>

<aside class="sticky top-0 flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-900 text-zinc-300 shadow-xl transition-all">

  <div class="flex items-center justify-between border-b border-zinc-800 px-5 py-6">
    <div class="flex items-center gap-3 overflow-hidden">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-900/20">
        {getInitials(data.user_nama)}
      </div>
      <div class="overflow-hidden">
        <h1 class="truncate text-sm font-bold text-white">Admin Panel</h1>
        <p class="truncate text-xs text-zinc-500" title={data.user_nama}>{firstTwoWords(data.user_nama)}</p>
      </div>
    </div>

    <button
      on:click={onLogout}
      class="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-500"
      title="Keluar / Logout"
    >
      <LogOut class="h-5 w-5" />
    </button>
  </div>

  <nav class="flex-1 mt-6 flex flex-col gap-1 px-4 overflow-y-auto custom-scroll">
    <p class="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">Main Menu</p>

    <a
      href="/dashboard/admin/products"
      class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-800 hover:text-white"
    >
      <Package class="h-5 w-5 text-zinc-500 transition group-hover:text-indigo-400" />
      <span>Products</span>
    </a>

    <a
      href="/dashboard/admin/transaction"
      class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-800 hover:text-white"
    >
      <Receipt class="h-5 w-5 text-zinc-500 transition group-hover:text-emerald-400" />
      <span>Transactions</span>
    </a>

    <a
      href="/dashboard/admin/manage_customer"
      class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-800 hover:text-white"
    >
      <Users class="h-5 w-5 text-zinc-500 transition group-hover:text-blue-400" />
      <span>Customers</span>
    </a>

    <p class="mb-2 mt-4 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">Internal</p>

    <a
      href="/dashboard/admin/todolist"
      class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-800 hover:text-white"
    >
      <ClipboardList class="h-5 w-5 text-zinc-500 transition group-hover:text-amber-400" />
      <span>Daily Task</span>
    </a>

    <a
      href="/dashboard/admin/logs"
      class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-800 hover:text-white"
    >
      <History class="h-5 w-5 text-zinc-500 transition group-hover:text-purple-400" />
      <span>Activity Log</span>
    </a>
  </nav>

</aside>

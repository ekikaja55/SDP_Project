<script lang="ts">
	import type { UserAuth } from '$lib';
	import { History, LogOut, Star, Truck } from '@lucide/svelte';

	export let onLogout: () => void;
	export let data: UserAuth | null;

	function firstTwoWords(text: string = "") {
		return text.trim().split(/\s+/).slice(0, 2).join(' ');
	}
	const getInitials = (name: string | undefined) =>
		name ? name.substring(0, 2).toUpperCase() : 'CS';
</script>

<aside
	class="sticky top-0 flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-900 text-zinc-300 shadow-xl transition-all"
>
	<div class="flex items-center justify-between border-b border-zinc-800 px-5 py-6">
		<div class="flex items-center gap-3 overflow-hidden">
			<div
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-900/20"
			>
				{getInitials(data?.user_nama)}
			</div>
			<div class="overflow-hidden">
				<h1 class="truncate text-sm font-bold text-white">Customer Panel</h1>
				<p class="truncate text-xs text-zinc-500" title={data?.user_nama}>
					{firstTwoWords(data?.user_nama) || 'Guest'}
				</p>
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

	<nav class="custom-scroll mt-6 flex flex-1 flex-col gap-1 overflow-y-auto px-4">
		<p class="mb-2 px-2 text-xs font-semibold tracking-wider text-zinc-600 uppercase">Orders</p>

		<a
			href="/dashboard/customer/status_pemesanan"
			class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-800 hover:text-white"
		>
			<Truck class="h-5 w-5 text-zinc-500 transition group-hover:text-emerald-400" />
			<span>Ordering Status</span>
		</a>

		<a
			href="/dashboard/customer/history_pemesanan"
			class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-800 hover:text-white"
		>
			<History class="h-5 w-5 text-zinc-500 transition group-hover:text-blue-400" />
			<span>History Transactions</span>
		</a>

		<p class="mt-4 mb-2 px-2 text-xs font-semibold tracking-wider text-zinc-600 uppercase">
			Activity
		</p>

		<a
			href="/dashboard/customer/review_rating"
			class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-zinc-800 hover:text-white"
		>
			<Star class="h-5 w-5 text-zinc-500 transition group-hover:text-amber-400" />
			<span>Reviews</span>
		</a>
	</nav>
</aside>

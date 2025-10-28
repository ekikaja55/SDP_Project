<!--src/lib/components/SidebarAdmin.svelte -->
<!-- component untuk sidebar admin -->
<script lang="ts">
	import { type UserAuth } from '$lib';
	export let onLogout: () => void;
	export let data: UserAuth;
</script>

<aside
	class="sticky top-0 flex h-screen w-64 flex-col justify-between border-r border-zinc-800 bg-zinc-950 text-zinc-200 shadow-xl
"
>
	<div>
		<div class="border-b border-zinc-800 px-6 py-5">
			<h1 class="text-xl font-semibold text-zinc-100">Admin Panel</h1>
			<p class="mt-1 text-sm text-zinc-400">Nama: {data.user_nama}</p>
		</div>

		<nav class="mt-5 flex flex-col space-y-1 px-3">
			<a
				href="/dashboard/admin/products"
				class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-zinc-800 hover:text-zinc-100"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-zinc-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M20 13V6a2 2 0 0 0-2-2h-3M4 13V6a2 2 0 0 1 2-2h3m0 16v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5m-8 0h8"
					/>
				</svg>
				<span>Manage Products</span>
			</a>

			<a
				href="/dashboard/admin/todolist"
				class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-zinc-800 hover:text-zinc-100"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-zinc-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
				</svg>
				<span>Manage Todolist</span>
			</a>

			<a
				href="/dashboard/admin/transaction"
				class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-zinc-800 hover:text-zinc-100"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-zinc-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 10h18M3 6h18M3 14h18M3 18h18"
					/>
				</svg>
				<span>Manage Transaction</span>
			</a>

			<a
				href="/dashboard/admin/manage_customer"
				class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-zinc-800 hover:text-zinc-100"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-zinc-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17 20h5v-2a4 4 0 0 0-5-4M9 20H4v-2a4 4 0 0 1 5-4m4-2a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"
					/>
				</svg>
				<span>Customer Data</span>
			</a>

			<a
				href="/dashboard/admin/laporan_review"
				class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-zinc-800 hover:text-zinc-100"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-zinc-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11 5h10M11 9h7M11 13h10M4 5h.01M4 9h.01M4 13h.01M4 17h.01M11 17h10"
					/>
				</svg>
				<span>Review Produk Data</span>
			</a>
      <button
				on:click={onLogout}
				class="flex w-full gap-2 rounded-lg bg-white px-3 py-2 font-medium text-zinc-800 transition hover:bg-zinc-900 hover:text-white mt-5"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"
					/>
				</svg>
				Logout
			</button>
		</nav>
	</div>
</aside>

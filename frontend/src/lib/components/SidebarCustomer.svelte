<!-- src/lib/components/SidebarUser.svelte -->
<!-- component untuk sidebar user -->
<script lang="ts">
	import type { UserAuth } from '$lib';
	export let onLogout: () => void;
	export let data: UserAuth | null;
</script>

<aside
	class="sticky top-0 flex h-screen w-64 flex-col justify-between border-r border-zinc-800 bg-zinc-950 text-zinc-200 shadow-xl"
>
	<div>
		<div class="border-b border-zinc-800 px-6 py-5">
			<h1 class="text-xl font-semibold text-white">Customer Dashboard</h1>
			<p class="mt-1 text-sm text-zinc-400">Nama: {data?.user_nama}</p>
		</div>

		<nav class="mt-5 flex flex-col space-y-1 px-3">
			<a
				href="/dashboard/customer/status_pemesanan"
				class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-zinc-800 "
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
						d="M9 12h6m2 10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10z"
					/>
				</svg>
				<span>Cek Status Pemesanan</span>
			</a>

			<a
				href="/dashboard/customer/history_pemesanan"
				class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-zinc-800 "
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-zinc-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6 1a9 9 0 1 1-9-9" />
				</svg>
				<span>Cek History Pemesanan</span>
			</a>

			<a
				href="/dashboard/customer/review_rating"
				class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-zinc-800 "
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
						d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 0 0 .95.69h4.913c.969 0 1.371 1.24.588 1.81l-3.976 2.89a1 1 0 0 0-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.89a1 1 0 0 0-1.176 0l-3.976 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 0 0-.364-1.118l-3.976-2.89c-.783-.57-.381-1.81.588-1.81h4.913a1 1 0 0 0 .95-.69l1.518-4.674z"
					/>
				</svg>
				<span>Review & Rating Produk</span>
			</a>
			<button
				on:click={onLogout}
				class="mt-5 flex w-full gap-2 rounded-lg bg-white px-3 py-2 font-medium text-zinc-800 transition hover:bg-zinc-900 hover:text-white"
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

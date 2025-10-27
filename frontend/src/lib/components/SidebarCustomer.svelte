<!-- src/lib/components/SidebarUser.svelte -->
<!-- component untuk sidebar user -->
<script lang="ts">
	export let onLogout: () => void;
	export let data;
</script>

<aside class="flex w-64 flex-col justify-between bg-blue-900 text-white">
	<div>
		<div class="border-b border-blue-700 px-6 py-4 text-2xl font-bold">Customer Dashboard</div>
		<nav class="mt-4 flex flex-col space-y-2 px-4">
			<a
				href="/dashboard/customer/status_pemesanan"
				class="rounded-lg px-3 py-2 transition hover:bg-blue-800"
			>
				Cek Status Pemesanan
			</a>
      <a
				href="/dashboard/customer/history_pemesanan"
				class="rounded-lg px-3 py-2 transition hover:bg-blue-800"
			>
				Cek History Pemesanan
			</a>
      <a
				href="/dashboard/customer/review_rating"
				class="rounded-lg px-3 py-2 transition hover:bg-blue-800"
			>
				Review & Rating Produk
			</a>
		</nav>
	</div>

	<button
		on:click={onLogout}
		class="m-4 rounded-lg bg-red-600 py-2 text-white transition hover:bg-red-700"
	>
		Logout
	</button>
</aside>

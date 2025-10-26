<!--src/lib/components/SidebarAdmin.svelte -->
<!-- component untuk sidebar admin -->
<script lang="ts">
	// ini di exports untuk handling logout
	export let onLogout: () => void;
</script>

<aside class="flex w-64 flex-col justify-between bg-gray-900 text-white">
	<div>
		<div class="border-b border-gray-700 px-6 py-4 text-2xl font-bold">Admin Panel</div>
		<nav class="mt-4 flex flex-col space-y-2 px-4">
			<a href="/dashboard/admin" class="rounded-lg px-3 py-2 transition hover:bg-gray-800">
				Home
			</a>
			<a href="/dashboard/admin/products" class="rounded-lg px-3 py-2 transition hover:bg-gray-800">
				Manage Products
			</a>
			<a href="/dashboard/admin/todolist" class="rounded-lg px-3 py-2 transition hover:bg-gray-800">
				Manage Todolist
			</a>
			<a href="/dashboard/admin/transaction" class="rounded-lg px-3 py-2 transition hover:bg-gray-800">
				Manage Transaction
			</a>
      <a href="/dashboard/admin/manage_customer" class="rounded-lg px-3 py-2 transition hover:bg-gray-800">
				Customer Data
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

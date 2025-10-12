<!-- src/lib/components/SidebarUser.svelte -->
<!-- component untuk sidebar user -->
<script lang="ts">
	export let onLogout: () => void;
</script>

<aside class="flex w-64 flex-col justify-between bg-blue-900 text-white">
	<div>
		<div class="border-b border-blue-700 px-6 py-4 text-2xl font-bold">User Panel</div>
		<nav class="mt-4 flex flex-col space-y-2 px-4">
			<a href="/dashboard/user" class="rounded-lg px-3 py-2 transition hover:bg-blue-800"> Home </a>
			<a href="/dashboard/user/settings" class="rounded-lg px-3 py-2 transition hover:bg-blue-800">
				Settings
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

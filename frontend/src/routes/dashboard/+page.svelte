<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
	import { userStore, logout } from '$lib';
	import { onMount } from 'svelte';
	import type { User } from '$lib';

	let currentUser: User | null = null;

	onMount(() => {
		const unsubscribe = userStore.subscribe((u) => (currentUser = u));
		return unsubscribe;
	});
</script>

<div class="p-4">
	<h1 class="text-xl">INI HALAMAN TODO LIST</h1>
	<button on:click={logout} class="mt-3 px-4 py-2 bg-red-600 text-white rounded">
		Logout
	</button>
</div>

<!-- src/routes/dashboard/+layout.ts -->
 <!-- layouting untuk dashboard user / admin -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout, userStore, type User } from '$lib';
	import SidebarAdmin from '$lib/components/SidebarAdmin.svelte';
	import SidebarUser from '$lib/components/SidebarUser.svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let user: User | null = null;

	onMount(() => {
		user = get(userStore);
		if (!user) {
			goto('/login');
		}
	});
</script>

{#if user}
	<div class="flex min-h-screen bg-gray-100">
		<!-- Sidebar berbeda tergantung role -->
		{#if user.user_role === 'admin'}
			<SidebarAdmin onLogout={logout} />
		{:else}
			<SidebarUser onLogout={logout} />
		{/if}

		<main class="flex-1 overflow-y-auto p-6">
			<slot />
		</main>
	</div>
{:else}
	<p class="p-10 text-center text-gray-500">Memuat data pengguna...</p>
{/if}

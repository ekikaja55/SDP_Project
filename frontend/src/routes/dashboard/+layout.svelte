<!-- src/routes/dashboard/+layout.ts -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { jwtDecode } from 'jwt-decode';
	import SidebarAdmin from '$lib/components/SidebarAdmin.svelte';
	import SidebarCustomer from '$lib/components/SidebarCustomer.svelte';
	import { goto } from '$app/navigation';
	import { logout } from '$lib';

	let user = null;

	if (browser) {
		const token = localStorage.getItem("token");
		if (!token) {
			goto('/login');
		} else {
			try {
				user = jwtDecode(token);
			} catch {
				goto('/login');
			}
		}
	}
</script>

<div class="flex min-h-screen m-0 p-0">
	{#if user?.user_role === 'admin'}
		<SidebarAdmin data={user} onLogout={logout} />
	{:else if user}
		<SidebarCustomer data={user} onLogout={logout}/>
	{/if}

	<main class="flex-1 p-6">
		<slot />
	</main>
</div>

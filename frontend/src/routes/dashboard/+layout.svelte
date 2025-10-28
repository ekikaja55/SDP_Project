<!-- src/routes/dashboard/+layout.ts -->
<!-- layouting untuk dashboard user / admin -->
<script lang="ts">
	export let data;
	import { logout} from '$lib';
	import SidebarAdmin from '$lib/components/SidebarAdmin.svelte';
	import SidebarCustomer from '$lib/components/SidebarCustomer.svelte';
</script>

<div class="flex min-h-screen m-0 p-0">
	{#if data.user?.user_role === 'admin'}
		<SidebarAdmin onLogout={logout} data={data.user} />
	{:else}
		<SidebarCustomer onLogout={logout} data={data.user}/>
	{/if}
	<main class="flex-1 p-6">
		<slot />
	</main>
</div>

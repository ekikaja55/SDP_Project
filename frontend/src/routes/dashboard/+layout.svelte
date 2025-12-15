<script lang="ts">
	import { browser } from '$app/environment';
	import { jwtDecode } from 'jwt-decode';
	import SidebarAdmin from '$lib/components/SidebarAdmin.svelte';
	import SidebarCustomer from '$lib/components/SidebarCustomer.svelte';
	import { goto } from '$app/navigation';
	import { logout } from '$lib';

	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	import { LayoutDashboard, Loader2 } from '@lucide/svelte';

	let user: any = null;
	let isAppLoaded = false;

	if (browser) {
		const token = localStorage.getItem('token');
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

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 800));
		isAppLoaded = true;
	});
</script>

{#if !isAppLoaded}
	<div
		out:fade={{ duration: 400 }}
		class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white"
	>
		<div
			class="relative flex h-24 w-24 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-zinc-100"
		>
			<LayoutDashboard class="h-10 w-10 animate-pulse text-zinc-800" strokeWidth={1.5} />
			<span
				class="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-200 opacity-50"
			></span>
		</div>

		<div class="mt-6 flex flex-col items-center gap-2">
			<h1 class="text-xl font-bold tracking-wider text-zinc-900">Dashboard</h1>
			<p class="text-xs tracking-widest text-zinc-500 uppercase">Menyiapkan data...</p>
		</div>
	</div>
{:else}
	<div class="m-0 flex min-h-screen bg-zinc-50 p-0 font-sans selection:bg-zinc-200">
		{#if user?.user_role === 'admin'}
			<SidebarAdmin data={user} onLogout={logout} />
		{:else if user}
			<SidebarCustomer data={user} onLogout={logout} />
		{/if}

		<main class="flex-1 overflow-hidden p-6 transition-all duration-300 ease-in-out">
			{#if $navigating}
				<div
					in:fade={{ duration: 150 }}
					class="flex h-full min-h-[500px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-200 bg-white"
				>
					<Loader2 class="h-10 w-10 animate-spin text-zinc-400" />
					<p class="animate-pulse text-sm font-medium text-zinc-400">Memuat konten...</p>
				</div>
			{:else}
				<div in:fade={{ duration: 300, delay: 50 }} class="h-full">
					<slot />
				</div>
			{/if}
		</main>
	</div>
{/if}

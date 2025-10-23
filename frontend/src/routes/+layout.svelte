<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { logout } from '$lib';
	import '../app.css';

	export let data;

	// langsung reactive statement (tanpa derived)
	$: isDashboard = page.url.pathname.startsWith('/dashboard');
	$: console.log('sekarang di path + ' + page.url.pathname);

	function goHome() {
		window.location.href = '/';
    // goto('')
	}
	function goDashboard() {
		window.location.href = `/dashboard/${data.user?.user_role}`;
	}
	function goCatalog() {
		window.location.href = `/catalog`;
	}
</script>

<div class="flex min-h-screen flex-col bg-gray-50 text-gray-800">
	<nav class="flex justify-between bg-blue-600 p-4 text-white">
		<div class="text-lg font-bold">Kanti’s Store</div>
		<div class="space-x-4">
			<button on:click={goHome} class="hover:underline">Home</button>
			{#if data.user?.user_role === 'customer' || !data.user}
				<button on:click={goCatalog} class="hover:underline">Catalog</button>
			{/if}
			{#if data.user}
				<button on:click={goDashboard} class="hover:underline">Dashboard</button>
				<button on:click={logout} class="hover:underline">Logout</button>
			{:else}
				<a href="/login" class="hover:underline">Login</a>
				<a href="/register" class="hover:underline">Register</a>
			{/if}
		</div>
	</nav>

	<main class="flex-1">
		<slot />
	</main>

	{#if !isDashboard}
		<footer class="mt-auto bg-gray-900 p-4 text-center text-gray-300">
			<p>&copy; {new Date().getFullYear()} Kanti’s Store. All rights reserved.</p>
		</footer>
	{/if}
</div>

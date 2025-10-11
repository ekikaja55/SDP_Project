<!-- src/routes/+layout.svelte -->
<!-- untuk template global navbar dan dashboard -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import '../app.css';

	const isDashboard = derived(page, ($page) => $page.url.pathname.startsWith('/dashboard'));

	function handleLogout() {
		goto('/login');
	}
</script>

{#if $isDashboard}
	<!-- Layout khusus dashboard -->
	<div class="flex min-h-screen bg-gray-100">
		<aside class="flex w-64 flex-col bg-gray-800 p-4 text-white">
			<h2 class="mb-6 text-2xl font-bold">Dashboard</h2>
			<nav class="flex flex-col gap-3">
				<a href="/dashboard" class="rounded px-3 py-2 hover:bg-gray-700">Home</a>
				<a href="/produk" class="rounded px-3 py-2 hover:bg-gray-700">Master Produk</a>
				<a href="/todolist" class="rounded px-3 py-2 hover:bg-gray-700">Master TODO</a>
				<a href="/dashboard/profile" class="rounded px-3 py-2 hover:bg-gray-700">Profile</a>
				<a href="/dashboard/settings" class="rounded px-3 py-2 hover:bg-gray-700">Settings</a>
			</nav>
			<button
				on:click={handleLogout}
				class="mt-auto rounded bg-red-500 py-2 text-white hover:bg-red-600"
			>
				Logout
			</button>
		</aside>

		<main class="flex-1 p-6">
			<slot />
		</main>
	</div>
{:else}
	<!-- Layout umum (navbar + footer) -->
	<div class="flex min-h-screen flex-col">
		<nav class="flex justify-between bg-blue-600 p-4 text-white">
			<div class="text-lg font-bold">SDP Project</div>
			<div class="space-x-4">
				<a href="/" class="hover:underline">Home</a>
				<a href="/login" class="hover:underline">Login</a>
				<a href="/register" class="hover:underline">Register</a>
			</div>
		</nav>

		<main class="flex-1">
			<slot />
		</main>

		<footer class="mt-auto bg-gray-900 p-4 text-center text-gray-300">
			<p>&copy; {new Date().getFullYear()} SDP Project. All rights reserved.</p>
		</footer>
	</div>
{/if}

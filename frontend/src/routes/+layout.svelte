<!-- src/routes/+layout.svelte -->
<!-- untuk template global navbar dan dashboard -->
<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { goto } from '$app/navigation';

	// buat reactive store utk deteksi apakah sedang di dashboard
	const isDashboard = derived(page, ($page) => $page.url.pathname.startsWith('/dashboard'));

	function handleLogout() {
		localStorage.removeItem('token');
		goto('/login');
	}
</script>

{#if $isDashboard}
	<!-- Layout khusus dashboard -->
	<div class="flex min-h-screen bg-gray-100">
		<aside class="w-64 bg-gray-800 text-white flex flex-col p-4">
			<h2 class="text-2xl font-bold mb-6">Dashboard</h2>
			<nav class="flex flex-col gap-3">
				<a href="/dashboard" class="hover:bg-gray-700 px-3 py-2 rounded">Home</a>
				<a href="/dashboard/profile" class="hover:bg-gray-700 px-3 py-2 rounded">Profile</a>
				<a href="/dashboard/settings" class="hover:bg-gray-700 px-3 py-2 rounded">Settings</a>
			</nav>
			<button
				on:click={handleLogout}
				class="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded"
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
	<div class="flex flex-col min-h-screen">
		<nav class="bg-blue-600 text-white p-4 flex justify-between">
			<div class="font-bold text-lg">SDP Project</div>
			<div class="space-x-4">
				<a href="/" class="hover:underline">Home</a>
				<a href="/login" class="hover:underline">Login</a>
				<a href="/register" class="hover:underline">Register</a>
			</div>
		</nav>

		<main class="flex-1">
			<slot />
		</main>

		<footer class="bg-gray-900 text-gray-300 text-center p-4 mt-auto">
			<p>&copy; {new Date().getFullYear()} SDP Project. All rights reserved.</p>
		</footer>
	</div>
{/if}

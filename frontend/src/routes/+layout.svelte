<!-- src/routes/+layout.svelte -->
<!-- untuk template global navbar umum-->
<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	const isDashboard = derived(page, ($page) => $page.url.pathname.startsWith('/dashboard'));
</script>

{#if !$isDashboard}
	<!-- Layout Umum -->
	<div class="flex min-h-screen flex-col bg-gray-50 text-gray-800">
		<nav class="flex justify-between bg-blue-600 p-4 text-white">
			<div class="text-lg font-bold">SDP Project</div>
			<div class="space-x-4">
				<a href="/" class="hover:underline">Home</a>
				<a href="/login" class="hover:underline">Login</a>
				<a href="/register" class="hover:underline">Register</a>
			</div>
		</nav>

		<main class="flex-1 p-6">
			<slot />
		</main>

		<footer class="mt-auto bg-gray-900 p-4 text-center text-gray-300">
			<p>&copy; {new Date().getFullYear()} SDP Project. All rights reserved.</p>
		</footer>
	</div>
{:else}
	<!-- Untuk dashboard layout, biar tidak tumpang tindih -->
	<slot />
{/if}

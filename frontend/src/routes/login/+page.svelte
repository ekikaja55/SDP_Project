<!-- src/routes/login/+page.svelte-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { loading, login, messageHandle, userStore } from '$lib';
	import { svelte } from '@sveltejs/vite-plugin-svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let email = '';
	let password = '';

	onMount(() => {
		const user = get(userStore);
		if (user) {
			// kalau udah login, langsung redirect
			goto('/dashboard');
		}
	});

	async function handleLogin() {
		await login({ user_email: email, user_password: password });

		const message = get(messageHandle);
		const user = get(userStore);

		// kalau login sukses, arahkan ke dashboard sesuai role
		if (message?.type === 'success' && user) {
			if (user.user_role === 'admin') {
				goto('/dashboard/admin');
			} else {
				goto('/dashboard/user');
			}
		}
	}
</script>

<main class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
		<h1 class="mb-6 text-center text-2xl font-semibold">Login</h1>

		<form on:submit|preventDefault={handleLogin}>
			<label class="mb-2 block text-sm font-medium">Email</label>
			<input
				type="email"
				bind:value={email}
				required
				class="mb-4 w-full rounded border p-2"
				placeholder="Masukkan email..."
			/>

			<label class="mb-2 block text-sm font-medium">Password</label>
			<input
				type="password"
				bind:value={password}
				required
				class="mb-4 w-full rounded border p-2"
				placeholder="Masukkan password..."
			/>

			<button
				type="submit"
				class="w-full rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600"
				disabled={$loading}
			>
				{#if $loading}
					<span>Loading...</span>
				{:else}
					<span>Login</span>
				{/if}
			</button>
		</form>

		{#if $messageHandle}
			<p
				class={`mt-4 text-center ${
					$messageHandle.type === 'error' ? 'text-red-500' : 'text-green-500'
				}`}
			>
				{$messageHandle.message}
			</p>
		{/if}
	</div>
</main>

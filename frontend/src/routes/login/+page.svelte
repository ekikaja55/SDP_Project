<!-- src/routes/login/+page.svelte-->
<!-- page untuk login -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { loading, login, messageHandle, userStore, type LoginDTO } from '$lib';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let dataLogin: LoginDTO = {
		user_email: '',
		user_password: ''
	};
	onMount(() => {
		const user = get(userStore);
		if (user) goto(`/dashboard/${user.user_role}`);
	});

	async function handleLogin() {
		await login(dataLogin);

		const message = get(messageHandle);
		const user = get(userStore);

		if (message?.type === 'success' && user) {
			goto(`/dashboard/${user.user_role}`);
		}
	}
</script>

<main class="flex min-h-screen flex-col items-center justify-center">
	<div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
		<h1 class="mb-6 text-center text-2xl font-semibold">Login Akun</h1>

		<form on:submit|preventDefault={handleLogin}>
			<label class="mb-2 block text-sm font-medium">Email</label>
			<input
				type="email"
				bind:value={dataLogin.user_email}
				required
				class="mb-4 w-full rounded border p-2"
				placeholder="Masukkan email..."
			/>

			<label class="mb-2 block text-sm font-medium">Password</label>
			<input
				type="password"
				bind:value={dataLogin.user_password}
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

		<p class="mt-4 text-center text-sm text-gray-600">
			Belum punya akun?
			<a href="/register" class="text-blue-500 hover:underline">Daftar sekarang</a>
		</p>
	</div>
</main>

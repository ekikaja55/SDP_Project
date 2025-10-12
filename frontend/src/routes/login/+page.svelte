<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/stores';
	import type { LoginDTO } from '$lib/types';

	let credentials: LoginDTO = {
		user_email: '',
		user_password: ''
	};
	let error = '';
	let isLoading = false;

	async function handleLogin() {
		isLoading = true;
		error = '';
		try {
			await login(credentials);
			goto('/dashboard');
		} catch (err: any) {
			error =
				err.response?.data?.message || err.message || 'Login gagal, periksa kembali data Anda.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<div class="w-80 rounded-lg bg-white p-8 shadow-md">
		<h1 class="mb-6 text-center text-2xl font-bold">Login</h1>

		{#if error}
			<p class="mb-3 text-center text-sm text-red-500">{error}</p>
		{/if}

		<form on:submit|preventDefault={handleLogin} class="flex flex-col gap-3">
			<input
				type="email"
				bind:value={credentials.user_email}
				placeholder="Email"
				class="w-full rounded border p-2"
				required
			/>
			<input
				type="password"
				bind:value={credentials.user_password}
				placeholder="Password"
				class="w-full rounded border p-2"
				required
			/>
			<button
				type="submit"
				disabled={isLoading}
				class="mt-1 w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:bg-gray-400"
			>
				{isLoading ? 'Memproses...' : 'Masuk'}
			</button>
		</form>

		<p class="mt-4 text-center text-sm">
			Belum punya akun?
			<a href="/register" class="text-blue-600 hover:underline">Daftar</a>
		</p>
	</div>
</div>

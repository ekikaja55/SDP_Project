<script lang="ts">
	import { goto } from '$app/navigation';
	import { register } from '$lib/stores';
	import type { RegisterDTO } from '$lib/types';

	let credentials: RegisterDTO = {
		user_nama: '',
		user_email: '',
		user_password: ''
	};
	let error = '';
	let success = '';
	let isLoading = false;

	async function handleRegister() {
		isLoading = true;
		error = '';
		success = '';
		try {
			await register(credentials);
			success = 'Registrasi berhasil! Mengalihkan...';
			setTimeout(() => goto('/login'), 2000);
		} catch (err: any) {
			error = err.response?.data?.message || err.message || 'Registrasi gagal, mohon coba lagi.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<div class="w-80 rounded-lg bg-white p-8 shadow-md">
		<h1 class="mb-6 text-center text-2xl font-bold">Register</h1>

		{#if error}
			<p class="mb-3 text-center text-sm text-red-500">{error}</p>
		{/if}
		{#if success}
			<p class="mb-3 text-center text-sm text-green-600">{success}</p>
		{/if}

		<form on:submit|preventDefault={handleRegister} class="flex flex-col gap-3">
			<input
				type="text"
				bind:value={credentials.user_nama}
				placeholder="Nama Lengkap"
				class="w-full rounded border p-2"
				required
			/>
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
				class="mt-1 w-full rounded bg-green-600 py-2 text-white transition hover:bg-green-700 disabled:bg-gray-400"
			>
				{isLoading ? 'Memproses...' : 'Daftar'}
			</button>
		</form>

		<p class="mt-4 text-center text-sm">
			Sudah punya akun?
			<a href="/login" class="text-blue-600 hover:underline">Login</a>
		</p>
	</div>
</div>

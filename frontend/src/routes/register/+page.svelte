<!-- src/routes/register/+page.svelte -->
<script lang="ts">
	import { register } from '$lib';
	import { goto } from '$app/navigation';

	let user_nama = '';
	let user_email = '';
	let user_password = '';
	let error = '';
	let success = '';

	async function handleRegister() {
		try {
			await register(user_nama, user_email, user_password);
			success = 'Registrasi berhasil! Silakan login.';
			setTimeout(() => goto('/'), 1500);
		} catch (err: any) {
			error = err.message;
		}
	}
</script>

<div class="min-h-screen flex flex-col justify-center items-center bg-gray-100">
	<div class="bg-white p-8 rounded-lg shadow-md w-80">
		<h1 class="text-2xl font-bold mb-6 text-center">Register</h1>

		{#if error}
			<p class="text-red-500 text-sm mb-3">{error}</p>
		{/if}
		{#if success}
			<p class="text-green-600 text-sm mb-3">{success}</p>
		{/if}

		<input
			type="text"
			bind:value={user_nama}
			placeholder="Nama Lengkap"
			class="w-full mb-3 p-2 border rounded"
		/>
		<input
			type="email"
			bind:value={user_email}
			placeholder="Email"
			class="w-full mb-3 p-2 border rounded"
		/>
		<input
			type="password"
			bind:value={user_password}
			placeholder="Password"
			class="w-full mb-4 p-2 border rounded"
		/>
		<button
			on:click={handleRegister}
			class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
		>
			Daftar
		</button>

		<p class="text-sm text-center mt-4">
			Sudah punya akun?
			<a href="/login" class="text-blue-600 hover:underline">Login</a>
		</p>
	</div>
</div>

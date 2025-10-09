<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { login } from '$lib';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let error = '';

	async function handleLogin() {
		try {
			await login(email, password);
			goto('/dashboard');
		} catch (err: any) {
			error = err.message;
		}
	}
</script>

<div class="min-h-screen flex flex-col justify-center items-center bg-gray-100">
	<div class="bg-white p-8 rounded-lg shadow-md w-80">
		<h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

		{#if error}
			<p class="text-red-500 text-sm mb-3">{error}</p>
		{/if}

		<input
			type="email"
			bind:value={email}
			placeholder="Email"
			class="w-full mb-3 p-2 border rounded"
		/>
		<input
			type="password"
			bind:value={password}
			placeholder="Password"
			class="w-full mb-4 p-2 border rounded"
		/>
		<button
			on:click={handleLogin}
			class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
		>
			Masuk
		</button>

		<p class="text-sm text-center mt-4">
			Belum punya akun?
			<a href="/register" class="text-blue-600 hover:underline">Daftar</a>
		</p>
	</div>
</div>

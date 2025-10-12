<!-- src/routes/register/+page.svelte-->
<!-- page untuk register -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { loading, messageHandle, register, userStore, type RegisterDTO } from '$lib';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let dataRegister: RegisterDTO = {
		user_nama: '',
		user_email: '',
		user_password: '',
		user_confirm_password: ''
	};

	onMount(() => {
		const user = get(userStore);
		if (user) goto(`/dashboard/${user.user_role}`);
	});

	async function handleRegister() {
		await register(dataRegister);
		const message = get(messageHandle);
	}
</script>

<main class="flex min-h-screen flex-col items-center justify-center">
	<div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
		<h1 class="mb-6 text-center text-2xl font-semibold">Register</h1>

		<form on:submit|preventDefault={handleRegister}>
			<label class="mb-2 block text-sm font-medium">Nama</label>
			<input
				type="text"
				bind:value={dataRegister.user_nama}
				required
				class="mb-4 w-full rounded border p-2"
				placeholder="Masukkan nama lengkap..."
			/>

			<label class="mb-2 block text-sm font-medium">Email</label>
			<input
				type="email"
				bind:value={dataRegister.user_email}
				required
				class="mb-4 w-full rounded border p-2"
				placeholder="Masukkan email..."
			/>

			<label class="mb-2 block text-sm font-medium">Password</label>
			<input
				type="password"
				bind:value={dataRegister.user_password}
				required
				class="mb-4 w-full rounded border p-2"
				placeholder="Masukkan password..."
			/>

			<label class="mb-2 block text-sm font-medium">Konfirmasi Password</label>
			<input
				type="password"
				bind:value={dataRegister.user_confirm_password}
				required
				class="mb-4 w-full rounded border p-2"
				placeholder="Ulangi password..."
			/>

			<button
				type="submit"
				class="w-full rounded bg-green-500 p-2 text-white transition hover:bg-green-600"
				disabled={$loading}
			>
				{#if $loading}
					<span>Loading...</span>
				{:else}
					<span>Register</span>
				{/if}
			</button>
		</form>

		<p class="mt-4 text-center text-sm">
			Sudah punya akun?
			<a href="/login" class="text-blue-600 hover:underline">Login di sini</a>
		</p>

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

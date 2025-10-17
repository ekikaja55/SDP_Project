<!-- src/routes/register/+page.svelte-->
<!-- page untuk register -->
<script lang="ts">
	import { loadingUser, messageHandleUser, register, type RegisterDTO } from '$lib';
	let dataRegister: RegisterDTO = {
		user_nama: '',
		user_email: '',
		user_password: '',
		user_confirm_password: ''
	};
</script>

<form
	on:submit|preventDefault={() => {
		register(dataRegister);
	}}
	class="mx-auto mt-16 w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
>
	<h2 class="mb-6 text-center text-2xl font-semibold text-gray-800">Register Akun</h2>

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
		disabled={$loadingUser}
	>
		{#if $loadingUser}
			<span>Loading...</span>
		{:else}
			<span>Register</span>
		{/if}
	</button>

	<p class="mt-4 text-center text-sm">
		Sudah punya akun?
		<a href="/login" class="text-blue-600 hover:underline">Login di sini</a>
	</p>

	{#if $messageHandleUser}
		<p
			class={`mt-4 text-center ${
				$messageHandleUser.type === 'error' ? 'text-red-500' : 'text-green-500'
			}`}
		>
			{$messageHandleUser.message}
		</p>
	{/if}
</form>

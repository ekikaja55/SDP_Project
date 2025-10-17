<!-- src/routes/login/+page.svelte-->
<!-- page untuk login -->
<script lang="ts">
	import { loadingUser, login, messageHandleUser, type LoginDTO } from '$lib';
	let dataLogin: LoginDTO = { user_email: '', user_password: '' };
</script>

<form
	on:submit|preventDefault={() => login(dataLogin)}
	class="mx-auto mt-16 w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
>
	<h2 class="mb-6 text-center text-2xl font-semibold text-gray-800">Login ke Akun</h2>

	<div class="mb-4">
		<label class="mb-2 block text-sm font-medium text-gray-700">Email</label>
		<input
			type="email"
			bind:value={dataLogin.user_email}
			placeholder="Masukkan email kamu"
			class="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			required
		/>
	</div>

	<div class="mb-6">
		<label class="mb-2 block text-sm font-medium text-gray-700">Password</label>
		<input
			type="password"
			bind:value={dataLogin.user_password}
			placeholder="Masukkan password"
			class="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			required
		/>
	</div>

	<button
		type="submit"
		disabled={$loadingUser}
		class="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
	>
		{#if $loadingUser}
			<span>Memproses...</span>
		{:else}
			<span>Login</span>
		{/if}
	</button>

	{#if $messageHandleUser}
		<p
			class="mt-4 text-center text-sm font-medium
			{$messageHandleUser.type === 'error' ? 'text-red-600' : 'text-green-600'}"
		>
			{$messageHandleUser.message}
		</p>
	{/if}
</form>

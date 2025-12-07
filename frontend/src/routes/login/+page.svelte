<!-- src/routes/login/+page.svelte-->
<script lang="ts">
	import { loadingUser, login, messageHandleUser, type LoginDTO } from '$lib';
	import NotificationModal from '../../lib/components/NotificationModal.svelte';
	import Whatsapp from '../../lib/components/Whatsapp.svelte';
	let dataLogin: LoginDTO = { user_email: '', user_password: '' };
</script>

<section class="z-50 flex min-h-screen items-center justify-center bg-zinc-50">
  <Whatsapp/>

	<div class="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">
		<div
			class="relative hidden w-1/2 bg-cover bg-center md:block"
			style="background-image: url('/images/login_art.jpg');"
		>
			<div
				class="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/40 to-transparent"
			></div>
			<div class="absolute bottom-10 left-10 text-white">
				<h2 class="text-3xl font-bold">Selamat Datang Kembali</h2>
				<p class="text-md mt-2 max-w-sm leading-relaxed font-bold text-zinc-100">
					Nikmati kemewahan pengalaman berbelanja digital di Kanti’s Store.
				</p>
			</div>
		</div>

		<div class="w-full p-10 md:w-1/2">
			<div class="mb-8 flex flex-col items-center">
				<div
					class="flex h-15 w-15 items-center justify-center rounded-full bg-zinc-800  text-white shadow-lg"
				>
					<img src="/icons/icon-logo-white.svg" alt="logo" class="h-8 w-8" />
				</div>
				<h1 class="mt-4 text-3xl font-semibold text-zinc-800">Kanti’s Store</h1>
				<p class="text-md mt-1 font-semibold text-zinc-600">
					Masuk untuk melanjutkan pengalaman belanjamu
				</p>
			</div>

			<form on:submit|preventDefault={() => login(dataLogin)} class="space-y-5">
				<div>
					<label class="text-md mb-2 block font-semibold text-zinc-700">Email</label>
					<div class="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="absolute top-2.5 left-3 h-5 w-5 text-zinc-600"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21.75 7.5l-9.75 6-9.75-6m19.5 0v9.75A2.25 2.25 0 0119.5 19.5H4.5a2.25 2.25 0 01-2.25-2.25V7.5"
							/>
						</svg>
						<input
							type="email"
							bind:value={dataLogin.user_email}
							placeholder="name@example.com"
							required
							class="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-10 py-2.5 text-sm text-zinc-700 shadow-sm placeholder:text-zinc-400 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none"
						/>
					</div>
				</div>

				<div>
					<label class="text-md mb-2 block font-semibold text-zinc-700">Password</label>
					<div class="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="absolute top-2.5 left-3 h-5 w-5 text-zinc-600"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5M4.5 10.5h15v9.75H4.5V10.5z"
							/>
						</svg>
						<input
							type="password"
							bind:value={dataLogin.user_password}
							placeholder="••••••"
							required
							class="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-10 py-2.5 text-sm text-zinc-700 shadow-sm placeholder:text-zinc-400 focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 focus:outline-none"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={$loadingUser}
					class="mt-4 w-full rounded-xl bg-zinc-900 py-2.5 font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50"
				>
					{#if $loadingUser}
						<span>Memproses...</span>
					{:else}
						<span>Masuk</span>
					{/if}
				</button>

				{#if $messageHandleUser && $messageHandleUser.type === 'error'}
					<NotificationModal
						message={$messageHandleUser.message}
						type={$messageHandleUser.type}
						onClose={() => messageHandleUser.set(null)}
					/>
				{/if}
			</form>

			<div class="mt-8 text-center text-sm font-semibold text-zinc-700">
				<p>
					Belum punya akun?
					<a
						href="/register"
						class="font-bold text-zinc-900 underline underline-offset-2 hover:text-zinc-950"
					>
						Daftar Sekarang
					</a>
				</p>
			</div>
		</div>
	</div>
</section>

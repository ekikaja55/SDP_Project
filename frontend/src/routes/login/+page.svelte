<!-- src/routes/login/+page.svelte-->
<!-- page untuk login -->
<script lang="ts">
	import { loadingUser, login, messageHandleUser, type LoginDTO } from '$lib';
	import NotificationModal from '../../lib/components/NotificationModal.svelte';
	let dataLogin: LoginDTO = { user_email: '', user_password: '' };
</script>

<section class="z-50 flex min-h-screen items-center justify-center bg-zinc-50">
	<div class="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">
		<!-- KIRI: GAMBAR -->
		<div
			class="relative hidden w-1/2 bg-cover bg-center md:block"
			style="background-image: url('/images/login_art.jpg');"
		>
			<div
				class="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/40 to-transparent"
			></div>
			<div class="absolute bottom-10 left-10 text-white">
				<h2 class="text-3xl font-bold">Selamat Datang Kembali</h2>
				<p class="mt-2 max-w-xs text-sm text-zinc-300">
					Nikmati kemewahan pengalaman berbelanja digital di Kanti’s Store.
				</p>
			</div>
		</div>

		<!-- KANAN: FORM LOGIN -->
		<div class="w-full p-10 md:w-1/2">
			<!-- Logo / Branding -->
			<div class="mb-8 flex flex-col items-center">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 3h18l-1 18H4L3 3zm5 3h8m-4 0v12"
						/>
					</svg>
				</div>
				<h1 class="mt-4 text-2xl font-semibold text-zinc-800">Kanti’s Store</h1>
				<p class="mt-1 text-sm text-zinc-500">Masuk untuk melanjutkan pengalaman belanjamu</p>
			</div>

			<!-- Form -->
			<form on:submit|preventDefault={() => login(dataLogin)} class="space-y-5">
				<div>
					<label class="mb-2 block text-sm font-medium text-zinc-700">Email</label>
					<div class="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="absolute left-3 top-2.5 h-5 w-5 text-zinc-400"
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
							class="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-10 py-2.5 text-sm text-zinc-700 shadow-sm placeholder:text-zinc-400 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800"
						/>
					</div>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-zinc-700">Password</label>
					<div class="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="absolute left-3 top-2.5 h-5 w-5 text-zinc-400"
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
							placeholder="••••••••"
							required
							class="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-10 py-2.5 text-sm text-zinc-700 shadow-sm placeholder:text-zinc-400 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800"
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

			<!-- Footer -->
			<div class="mt-8 text-center text-sm text-zinc-500">
				<p>
					Belum punya akun?
					<a
						href="/register"
						class="font-medium text-zinc-800 underline underline-offset-2 hover:text-zinc-950"
					>
						Daftar Sekarang
					</a>
				</p>
			</div>
		</div>
	</div>
</section>

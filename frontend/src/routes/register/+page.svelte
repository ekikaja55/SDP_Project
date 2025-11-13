<!-- src/routes/register/+page.svelte-->
<!-- page untuk register -->
<script lang="ts">
	import { loadingUser, messageHandleUser, register, type RegisterDTO } from '$lib';
	import NotificationModal from '../../lib/components/NotificationModal.svelte';
	let dataRegister: RegisterDTO = {
		user_nama: '',
		user_email: '',
		user_password: '',
		user_confirm_password: ''
	};

	function handleSubmit() {
		register(dataRegister);
		dataRegister = {
			user_nama: '',
			user_email: '',
			user_password: '',
			user_confirm_password: ''
		};
	}
</script>

<section class="z-50 flex min-h-screen items-center justify-center bg-zinc-50">
	<div class="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-lg">
		<!-- KIRI: GAMBAR -->
		<div
			class="relative hidden w-1/2 bg-cover bg-center md:block"
			style="background-image: url('/images/register_art.jpg');"
		>
			<div
				class="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/40 to-transparent"
			></div>
			<div class="absolute bottom-10 left-10 text-white">
				<h2 class="text-3xl font-bold">Bergabung Sekarang</h2>
				<p class="mt-2 max-w-xs text-sm text-zinc-300">Temukan pengalaman baru di Kanti’s Store.</p>
			</div>
		</div>

		<!-- KANAN: FORM REGISTER -->
		<div class="w-full p-10 md:w-1/2">
			<!-- Branding -->
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
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m9-9H3" />
					</svg>
				</div>
				<h1 class="mt-4 text-2xl font-semibold text-zinc-800">Kanti’s Store</h1>
				<p class="mt-1 text-sm text-zinc-500">Daftar dan rasakan pengalaman eksklusif</p>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="space-y-5">
				<div>
					<label class="mb-2 block text-sm font-medium text-zinc-700">Nama Lengkap</label>
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
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
							/>
						</svg>
						<input
							type="text"
							bind:value={dataRegister.user_nama}
							placeholder="Masukkan nama lengkap..."
							required
							class="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-10 py-2.5 text-sm text-zinc-700 shadow-sm placeholder:text-zinc-400 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800"
						/>
					</div>
				</div>

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
							bind:value={dataRegister.user_email}
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
							bind:value={dataRegister.user_password}
							placeholder="••••••••"
							required
							class="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-10 py-2.5 text-sm text-zinc-700 shadow-sm placeholder:text-zinc-400 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800"
						/>
					</div>
				</div>

				<div>
					<label class="mb-2 block text-sm font-medium text-zinc-700">Konfirmasi Password</label>
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
								d="M12 15.75l3-3m0 0l3 3m-3-3v9.75M4.5 4.5h15v9.75H4.5V4.5z"
							/>
						</svg>
						<input
							type="password"
							bind:value={dataRegister.user_confirm_password}
							placeholder="Ulangi password..."
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
						<span>Daftar</span>
					{/if}
				</button>

				{#if $messageHandleUser}
					{#if $messageHandleUser.type === 'success'}
						<NotificationModal
							message={$messageHandleUser.message}
							type={$messageHandleUser.type}
							onClose={() => messageHandleUser.set(null)}
							isLogin={true}
						/>
					{:else}
						<NotificationModal
							message={$messageHandleUser.message}
							type={$messageHandleUser.type}
							onClose={() => messageHandleUser.set(null)}
						/>
					{/if}
				{/if}
			</form>

			<!-- Footer -->
			<div class="mt-8 text-center text-sm text-zinc-500">
				<p>
					Sudah punya akun?
					<a
						href="/login"
						class="font-medium text-zinc-800 underline underline-offset-2 hover:text-zinc-950"
					>
						Masuk di sini
					</a>
				</p>
			</div>
		</div>
	</div>
</section>

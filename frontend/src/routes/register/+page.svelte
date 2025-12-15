<script lang="ts">
	import { loadingUser, messageHandleUser, register, type RegisterDTO } from '$lib';
	import NotificationModal from '../../lib/components/NotificationModal.svelte';
	import Whatsapp from '../../lib/components/Whatsapp.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { User, Mail, Lock, Key, UserPlus, Store } from '@lucide/svelte';

	let dataRegister: RegisterDTO = {
		user_nama: '',
		user_email: '',
		user_password: '',
		user_confirm_password: ''
	};

	let isLoaded = false;

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 800));
		isLoaded = true;
	});

	function handleSubmit() {
		register(dataRegister);
		// Jangan clear form langsung jika user salah input,
		// tapi jika sukses biasanya redirect handled by logic register
	}
</script>

{#if !isLoaded}
	<div
		out:fade={{ duration: 400 }}
		class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white"
	>
		<div
			class="relative flex h-24 w-24 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-zinc-100"
		>
			<UserPlus class="ml-1 h-10 w-10 animate-bounce text-zinc-800" strokeWidth={1.5} />
			<span
				class="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-200 opacity-50"
			></span>
		</div>

		<div class="mt-6 flex flex-col items-center gap-2">
			<h1 class="text-xl font-bold tracking-wider text-zinc-900">Bergabung</h1>
			<p class="text-xs tracking-widest text-zinc-500 uppercase">Menyiapkan form pendaftaran...</p>
		</div>
	</div>
{:else}
	<section
		class="relative z-50 flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12"
	>
		<Whatsapp />

		<div
			class="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-100"
		>
			<div
				class="relative hidden w-1/2 bg-cover bg-center md:block"
				style="background-image: url('/images/register_art.jpg');"
			>
				<div class="absolute inset-0 bg-zinc-900/60 backdrop-blur-[2px]"></div>
				<div class="absolute right-10 bottom-12 left-10 text-white">
					<h2 class="text-3xl font-bold tracking-tight">Bergabung Sekarang</h2>
					<p class="mt-4 text-sm leading-relaxed font-medium text-zinc-200 opacity-90">
						Temukan pengalaman baru di Kanti’s Store. Produk herbal alami terbaik hanya sejauh satu
						klik.
					</p>
				</div>
			</div>

			<div class="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
				<div class="mb-8 flex flex-col items-center text-center">
					<div
						class="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
					>
						<Store class="h-7 w-7" />
					</div>
					<h1 class="mt-6 text-2xl font-bold tracking-tight text-zinc-900">Buat Akun Baru</h1>
					<p class="mt-2 text-sm text-zinc-500">Daftar dan rasakan pengalaman eksklusif</p>
				</div>

				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					<div class="space-y-1.5">
						<label class="text-xs font-bold tracking-wide text-zinc-500 uppercase"
							>Nama Lengkap</label
						>
						<div class="group relative">
							<User
								class="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-800"
							/>
							<input
								type="text"
								bind:value={dataRegister.user_nama}
								placeholder="Masukkan nama lengkap..."
								required
								class="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pr-4 pl-11 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-zinc-800 focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none"
							/>
						</div>
					</div>

					<div class="space-y-1.5">
						<label class="text-xs font-bold tracking-wide text-zinc-500 uppercase">Email</label>
						<div class="group relative">
							<Mail
								class="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-800"
							/>
							<input
								type="email"
								bind:value={dataRegister.user_email}
								placeholder="name@example.com"
								required
								class="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pr-4 pl-11 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-zinc-800 focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none"
							/>
						</div>
					</div>

					<div class="space-y-1.5">
						<label class="text-xs font-bold tracking-wide text-zinc-500 uppercase">Password</label>
						<div class="group relative">
							<Lock
								class="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-800"
							/>
							<input
								type="password"
								bind:value={dataRegister.user_password}
								placeholder="Minimal 6 karakter"
								required
								class="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pr-4 pl-11 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-zinc-800 focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none"
							/>
						</div>
					</div>

					<div class="space-y-1.5">
						<label class="text-xs font-bold tracking-wide text-zinc-500 uppercase"
							>Konfirmasi Password</label
						>
						<div class="group relative">
							<Key
								class="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-zinc-800"
							/>
							<input
								type="password"
								bind:value={dataRegister.user_confirm_password}
								placeholder="Ulangi password..."
								required
								class="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pr-4 pl-11 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-zinc-800 focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={$loadingUser}
						class="mt-6 w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800 hover:shadow-zinc-900/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{#if $loadingUser}
							<span class="flex items-center justify-center gap-2">
								<span
									class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
								></span>
								Mendaftarkan...
							</span>
						{:else}
							<span>Daftar Sekarang</span>
						{/if}
					</button>

					{#if $messageHandleUser}
						<NotificationModal
							message={$messageHandleUser.message}
							type={$messageHandleUser.type}
							onClose={() => messageHandleUser.set(null)}
							isLogin={$messageHandleUser.type === 'success'}
						/>
					{/if}
				</form>

				<div class="mt-8 text-center text-sm text-zinc-600">
					<p>
						Sudah punya akun?
						<a
							href="/login"
							class="font-bold text-zinc-900 transition hover:text-zinc-700 hover:underline hover:underline-offset-4"
						>
							Masuk di sini
						</a>
					</p>
				</div>
			</div>
		</div>
	</section>
{/if}

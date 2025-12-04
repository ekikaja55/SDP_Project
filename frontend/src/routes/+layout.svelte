<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { jwtDecode } from 'jwt-decode';
	import { page } from '$app/state';
	import '../app.css';

	import MessageModal from '$lib/components/MessageModal.svelte';
	import { getAllNotif, notifikasiStore, type UserAuth } from '$lib';
	import { onMount } from 'svelte';

	let isOpen = false;
	let user:UserAuth|null = null;

	$: isDashboard = page.url.pathname.startsWith('/dashboard');

	if (browser) {
		const token = localStorage.getItem('token');

		if (token) {
			try {
				user = jwtDecode(token);
			} catch {
				localStorage.removeItem('token');
				user = null;
			}
		}
	}

	function goHome() {
		goto('/');
	}

	function goDashboard() {
		if (!user) return goto('/login');

		const temp = user.user_role === 'admin' ? 'products' : 'status_pemesanan';
		goto(`/dashboard/${user.user_role}/${temp}`);
	}

	function goCatalog() {
		goto('/catalog');
	}

	async function getNotif() {
		await getAllNotif();
	}

	onMount(() => getNotif());
</script>

{#if isOpen}
	<MessageModal onClose={() => (isOpen = false)} />
{/if}

<div class="flex min-h-screen flex-col bg-zinc-50 text-zinc-800">
	<!-- Navbar -->
	<nav
		class={`top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-white/70 px-6 py-4 shadow-sm backdrop-blur-md ${!isDashboard ? 'sticky' : ''}`}
	>
		<div class="flex items-center space-x-2">
			<!-- Logo -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-7 w-7 text-zinc-800"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 3h18l-1 18H4L3 3zm5 3h8m-4 0v12"
				/>
			</svg>
			<span class="text-lg font-semibold tracking-wide text-zinc-900">Kanti’s Store</span>
		</div>

		<div class="flex items-center space-x-6 text-sm font-medium">
			<button
				on:click={goHome}
				class="flex items-center gap-1 text-zinc-700 transition hover:text-zinc-950"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m0 0H5m4 0h4"
					/>
				</svg>
				Home
			</button>

			{#if user?.user_role === 'customer' || !user}
				<button
					on:click={goCatalog}
					class="flex items-center gap-1 text-zinc-700 transition hover:text-zinc-950"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 10h16M4 14h16M4 18h16"
						/>
					</svg>
					Catalog
				</button>
			{/if}

			{#if user}
				<button
					on:click={goDashboard}
					class="flex items-center gap-1 text-zinc-700 transition hover:text-zinc-950"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 10h4v11H3zM17 10h4v11h-4zM10 3h4v18h-4z"
						/>
					</svg>
					Dashboard
				</button>

				{#if user.user_role === 'admin'}
					<!-- Tombol Notifikasi -->
					<button
						on:click={() => (isOpen = !isOpen)}
						class="relative flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-zinc-700"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
						<span>Notifikasi</span>

						{#if $notifikasiStore && $notifikasiStore.length > 0}
							<span
								class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow"
							>
								{$notifikasiStore.length}
							</span>
						{/if}
					</button>
				{/if}
			{:else}
				<a href="/login" class="transition hover:text-zinc-950">Login</a>
				<a href="/register" class="transition hover:text-zinc-950">Register</a>
			{/if}
		</div>
	</nav>

	<!-- Main Content -->
	<main class="flex-1">
		<slot />
	</main>

	<!-- Footer -->
	{#if !isDashboard}
		<footer class="mt-auto border-t border-zinc-800 bg-zinc-950 px-8 py-10 text-zinc-400">
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				<!-- Brand -->
				<div>
					<h2 class="mb-3 text-xl font-semibold tracking-wide text-zinc-100">Kanti’s Store</h2>
					<p class="text-sm leading-relaxed text-zinc-400">
						Tempat terbaik untuk mendapatkan produk berkualitas dengan pelayanan cepat dan
						terpercaya. Kenyamanan belanja Anda adalah prioritas kami.
					</p>
				</div>

				<!-- Navigasi -->
				<div>
					<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-300">Navigasi</h3>
					<ul class="space-y-2 text-sm">
						<li><a href="/" class="transition hover:text-white">Home</a></li>
						<li><a href="/catalog" class="transition hover:text-white">Catalog</a></li>

					</ul>
				</div>

				<!-- Bantuan -->
				<div>
					<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-300">Bantuan</h3>
					<ul class="space-y-2 text-sm">
						<li><a href="#" class="transition hover:text-white">FAQ</a></li>
						<li><a href="#" class="transition hover:text-white">Kebijakan Privasi</a></li>
						<li><a href="#" class="transition hover:text-white">Syarat & Ketentuan</a></li>
						<li><a href="#" class="transition hover:text-white">Hubungi Kami</a></li>
					</ul>
				</div>

				<!-- Sosial Media -->
				<div>
					<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-300">
						Ikuti Kami
					</h3>
					<div class="flex space-x-4">
						<a href="#" class="transition hover:text-white" aria-label="Instagram">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z"
								/>
								<circle cx="12" cy="12" r="3.5" />
							</svg>
						</a>
						<a href="#" class="transition hover:text-white" aria-label="Twitter">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016 3a4.48 4.48 0 00-4.47 4.47c0 .35.04.69.11 1.02A12.94 12.94 0 013 4s-4 9 5 13a13.2 13.2 0 01-8 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
								/>
							</svg>
						</a>
						<a href="#" class="transition hover:text-white" aria-label="Facebook">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M18 2h-3a4 4 0 00-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 011-1h3z"
								/>
							</svg>
						</a>
						<a href="#" class="transition hover:text-white" aria-label="YouTube">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M10 15l5.19-3L10 9v6zm9.75-9.25A3.75 3.75 0 0123 9.5v5a3.75 3.75 0 01-3.25 3.75c-2.85.32-5.71.32-8.5 0A3.75 3.75 0 018 14.5v-5a3.75 3.75 0 013.25-3.75c2.79-.32 5.65-.32 8.5 0z"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>

			<div class="mt-10 border-t border-zinc-800 pt-4 text-center text-xs text-zinc-500">
				<p>&copy; {new Date().getFullYear()} Kanti’s Store — All Rights Reserved.</p>
			</div>
		</footer>
	{/if}
</div>

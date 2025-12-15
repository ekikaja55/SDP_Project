<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { jwtDecode } from 'jwt-decode';
	import '../app.css';

	import {
		Home,
		Store,
		LayoutDashboard,
		Bell,
		LogIn,
		UserPlus,
		Facebook,
		Twitter,
		Instagram,
		Youtube,
		LogOut
	} from '@lucide/svelte';

	import {
		getAllNotif,
		getAllNotifCust,
		totalNotifStoreAdmin,
		totalNotifStoreCust,
		type UserAuth
	} from '$lib';
	import MessageModal from '$lib/components/MessageModal.svelte';
	import { onMount } from 'svelte';

	let isOpen = false;
	let user: UserAuth | null = null;
	let isAuthLoading = true;

	$: isDashboard = page.url.pathname.startsWith('/dashboard');

	$: activeNotifCount = user?.user_role === 'admin' ? $totalNotifStoreAdmin : $totalNotifStoreCust;

	onMount(async () => {
		isAuthLoading = true;

		if (browser) {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					user = jwtDecode(token);
					if (user?.user_role === 'admin') {
						await getAllNotif();
					} else if (user?.user_role === 'customer') {
						await getAllNotifCust();
					}
				} catch {
					localStorage.removeItem('token');
					user = null;
				}
			}
		}

		setTimeout(() => {
			isAuthLoading = false;
		}, 300);
	});

	function goHome() {
		window.location.href = '/';
		// goto('/');
	}

	function goDashboard() {
		if (!user) return goto('/login');
		const temp = user.user_role === 'admin' ? 'products' : 'status_pemesanan';
		window.location.href = `/dashboard/${user.user_role}/${temp}`;

		// goto(`/dashboard/${user.user_role}/${temp}`);
	}

	function goCatalog() {
		window.location.href = '/catalog';
		// goto('/catalog');
	}
</script>

{#if isOpen}
	<MessageModal onClose={() => (isOpen = false)} role={user?.user_role || 'customer'} />
{/if}

<div class="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-800 selection:bg-zinc-200">
	<nav
		class={`fixed top-0 right-0 left-0 z-40 border-b border-zinc-200/80 transition-all duration-300
        ${!isDashboard ? 'bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60' : 'bg-white'}`}
	>
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
			<div class="flex cursor-pointer items-center gap-3" on:click={goHome}>
				<div
					class="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm"
				>
					<Store class="h-5 w-5" />
				</div>
				<span class="text-lg font-bold tracking-tight text-zinc-900">Kanti’s Store</span>
			</div>

			<div class="flex items-center gap-1 sm:gap-2">
				{#if isAuthLoading}
					<div class="hidden gap-4 sm:flex">
						<div class="h-8 w-20 animate-pulse rounded-md bg-zinc-100"></div>
						<div class="h-8 w-20 animate-pulse rounded-md bg-zinc-100"></div>
					</div>
					<div class="h-9 w-9 animate-pulse rounded-full bg-zinc-100"></div>
				{:else}
					<button
						on:click={goHome}
						class="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 sm:flex"
					>
						<Home class="h-4 w-4" />
						Home
					</button>

					{#if user?.user_role === 'customer' || !user}
						<button
							on:click={goCatalog}
							class="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 sm:flex"
						>
							<Store class="h-4 w-4" />
							Catalog
						</button>
					{/if}

					<div class="mx-2 hidden h-6 w-px bg-zinc-200 sm:block"></div>

					{#if user}
						<button
							on:click={goDashboard}
							class="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 sm:flex"
						>
							<LayoutDashboard class="h-4 w-4" />
							Dashboard
						</button>

						<button
							on:click={() => (isOpen = !isOpen)}
							class="group relative flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50"
						>
							<Bell class="h-4.5 w-4.5 text-zinc-600 group-hover:text-zinc-900" />
							<span class="hidden sm:inline">Notifikasi</span>

							{#if activeNotifCount && activeNotifCount > 0}
								<span
									class="absolute -top-1.5 -right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white"
								>
									{activeNotifCount > 99 ? '99+' : activeNotifCount}
								</span>
							{/if}
						</button>
					{:else}
						<div class="flex items-center gap-2">
							<a
								href="/login"
								class="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900"
							>
								Login
							</a>
							<a
								href="/register"
								class="flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
							>
								Register
							</a>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</nav>

	<div class="h-16"></div>

	<main class="flex-1">
		<slot />
	</main>

	{#if !isDashboard}
		<footer class="mt-auto border-t border-zinc-800 bg-zinc-950 px-6 py-12 text-zinc-400">
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
				<div class="space-y-4">
					<div class="flex items-center gap-2 text-zinc-100">
						<Store class="h-6 w-6" />
						<span class="text-xl font-bold tracking-wide">Kanti’s Store</span>
					</div>
					<p class="max-w-xs text-sm leading-relaxed text-zinc-500">
						Tempat terbaik untuk mendapatkan produk berkualitas dengan pelayanan cepat dan
						terpercaya. Kenyamanan belanja Anda adalah prioritas kami.
					</p>
				</div>

				<div>
					<h3 class="mb-4 text-xs font-bold tracking-wider text-zinc-200 uppercase">Navigasi</h3>
					<ul class="space-y-3 text-sm">
						<li>
							<a href="/" class="flex items-center gap-2 transition-colors hover:text-white"
								><Home class="h-3 w-3" /> Home</a
							>
						</li>
						<li>
							<a href="/catalog" class="flex items-center gap-2 transition-colors hover:text-white"
								><Store class="h-3 w-3" /> Catalog</a
							>
						</li>
						<li>
							<a href="/login" class="flex items-center gap-2 transition-colors hover:text-white"
								><LogIn class="h-3 w-3" /> Login</a
							>
						</li>
						<li>
							<a href="/register" class="flex items-center gap-2 transition-colors hover:text-white"
								><UserPlus class="h-3 w-3" /> Register</a
							>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-4 text-xs font-bold tracking-wider text-zinc-200 uppercase">Ikuti Kami</h3>
					<div class="flex gap-4">
						<a
							href="#"
							class="rounded-full bg-zinc-900 p-2 transition hover:bg-zinc-800 hover:text-white"
							aria-label="Instagram"
						>
							<Instagram class="h-5 w-5" />
						</a>
						<a
							href="#"
							class="rounded-full bg-zinc-900 p-2 transition hover:bg-zinc-800 hover:text-white"
							aria-label="Twitter"
						>
							<Twitter class="h-5 w-5" />
						</a>
						<a
							href="#"
							class="rounded-full bg-zinc-900 p-2 transition hover:bg-zinc-800 hover:text-white"
							aria-label="Facebook"
						>
							<Facebook class="h-5 w-5" />
						</a>
						<a
							href="#"
							class="rounded-full bg-zinc-900 p-2 transition hover:bg-zinc-800 hover:text-white"
							aria-label="YouTube"
						>
							<Youtube class="h-5 w-5" />
						</a>
					</div>
				</div>
			</div>

			<div
				class="mt-12 flex flex-col items-center justify-between border-t border-zinc-900 pt-8 text-xs text-zinc-600 sm:flex-row"
			>
				<p>&copy; {new Date().getFullYear()} Kanti’s Store — All Rights Reserved.</p>
			</div>
		</footer>
	{/if}
</div>

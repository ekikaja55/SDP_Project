<script lang="ts">
	import {
		getAllNotif,
		getAllNotifCust,
		loadingNotif,
		notifikasiStoreAdmin,
		notifikasiStoreCust,
		updateAllNotif,
		updateNotifById
	} from '$lib';

	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';

	import { Bell, X, CheckCheck, Clock, ShoppingBag, Eye, Check } from '@lucide/svelte';

	export let onClose: () => void;
	export let role: string = "admin";

	let visible = true;

	$: activeNotifikasi = role === 'admin' ? $notifikasiStoreAdmin : $notifikasiStoreCust;
	// $: activeNotifikasi =  $notifikasiStoreCust;

	onMount(() => {
		refreshNotif();
	});

	async function refreshNotif() {
		if (role === 'customer') {
			await getAllNotifCust();
		} else {
			await getAllNotif();
		}
	}

	function handleClose() {
		visible = false;
		setTimeout(() => onClose?.(), 200);
	}

	async function handleMarkAsRead(id: string) {
		await updateNotifById(id, role);
		refreshNotif();
	}

	async function handleMarkAllAsRead() {
		await updateAllNotif(role);
		refreshNotif();
	}

	function handleDetail(transaksiId: String, idUser: String) {
		const url =
			role === 'admin'
				? `/dashboard/admin/transaction/${idUser}/${transaksiId}`
				: `/dashboard/customer/status_pemesanan/${idUser}/${transaksiId}`;

		handleClose();
		goto(url);
	}

	function timeAgo(dateString: string): string {
		const now = new Date();
		const past = new Date(dateString);
		const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

		if (diff < 60) return 'Baru saja';
		if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
		if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
		if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
		return `${Math.floor(diff / 2592000)} bulan lalu`;
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-[2px] transition-opacity"
		on:click={handleClose}
		transition:fade={{ duration: 150 }}
	></div>

	<div
		in:fly={{ y: 15, duration: 300 }}
		out:fade={{ duration: 200 }}
		class="fixed top-20 right-4 z-50 w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl ring-1 ring-black/5"
	>
		<div class="flex items-center justify-between border-b border-zinc-100 bg-white px-5 py-4">
			<div class="flex items-center gap-2.5">
				<div class="relative">
					<Bell class="h-5 w-5 text-zinc-700" />
					{#if activeNotifikasi && activeNotifikasi.some((n) => n.notifikasi_isread === 'false')}
						<span class="absolute -top-0.5 -right-0.5 flex h-2 w-2">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"
							></span>
							<span class="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
						</span>
					{/if}
				</div>
				<h2 class="text-sm font-bold tracking-tight text-zinc-800">Notifikasi</h2>
			</div>

			<div class="flex items-center gap-1">
				<button
					class="group flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
					on:click={handleMarkAllAsRead}
					title="Tandai semua sudah dibaca"
				>
					<CheckCheck class="h-3.5 w-3.5" />
					<span class="hidden sm:inline">Tandai Baca</span>
				</button>
				<button
					class="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
					on:click={handleClose}
				>
					<X class="h-4 w-4" />
				</button>
			</div>
		</div>

		<div
			class="scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent max-h-[28rem] overflow-y-auto bg-zinc-50/50"
		>
			{#if $loadingNotif}
				<div class="flex flex-col items-center justify-center space-y-3 py-12">
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"
					></div>
					<span class="text-xs text-zinc-400">Memuat notifikasi...</span>
				</div>
			{:else if activeNotifikasi && activeNotifikasi.length > 0}
				<div class="flex flex-col">
					{#each activeNotifikasi as notif (notif.id)}
						{@const isUnread = notif.notifikasi_isread === 'false'}

						<div
							class={`relative border-b border-zinc-100 px-5 py-4 transition-colors duration-200 last:border-0 
                            ${isUnread ? 'bg-white hover:bg-zinc-50' : 'bg-zinc-50/50 hover:bg-zinc-100/80'}`}
						>
							{#if isUnread}
								<div class="absolute top-0 left-0 h-full w-1 bg-blue-500"></div>
							{/if}

							<div class="flex gap-4">
								<div
									class={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border 
                                    ${isUnread ? 'border-blue-100 bg-blue-50 text-blue-600' : 'border-zinc-200 bg-white text-zinc-400'}`}
								>
									<ShoppingBag class="h-4.5 w-4.5" />
								</div>

								<div class="flex-1 space-y-1">
									<div class="flex items-start justify-between gap-2">
										<h3
											class={`text-sm ${isUnread ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-600'}`}
										>
											{notif.notifikasi_nama}
										</h3>
										<span
											class="flex items-center gap-1 text-[10px] whitespace-nowrap text-zinc-400"
										>
											<Clock class="h-3 w-3" />
											{timeAgo(notif.createdAt)}
										</span>
									</div>

									<p class="line-clamp-2 text-xs leading-relaxed text-zinc-500">
										{notif.notifikasi_isi}
									</p>

									<div class="mt-3 flex items-center gap-3">
										{#if notif.transaksi_id}
											<button
												on:click={() => handleDetail(notif.transaksi_id, notif.user_id)}
												class="flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 transition-colors hover:bg-zinc-200 hover:text-zinc-900"
											>
												<Eye class="h-3 w-3" />
												Lihat Detail
											</button>
										{/if}

										{#if isUnread}
											<button
												on:click={() => handleMarkAsRead(notif.id)}
												class="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
											>
												<Check class="h-3 w-3" />
												Tandai baca
											</button>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-16 text-zinc-400">
					<div class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
						<Bell class="h-8 w-8 text-zinc-300" />
					</div>
					<p class="text-sm font-medium text-zinc-500">Tidak ada notifikasi baru</p>
					<p class="text-xs text-zinc-400">Semua informasi terbaru akan muncul di sini</p>
				</div>
			{/if}
		</div>

		{#if activeNotifikasi && activeNotifikasi.length > 0}
			<div class="border-t border-zinc-100 bg-zinc-50 px-5 py-2 text-center">
				<span class="text-[10px] text-zinc-400"
					>Menampilkan {activeNotifikasi.length} notifikasi terakhir</span
				>
			</div>
		{/if}
	</div>
{/if}

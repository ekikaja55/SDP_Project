<script lang="ts">
	import { getAllNotif, loadingNotif, notifikasiStore, updateAllNotif, updateNotifById } from '$lib';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let onClose: () => void;
	let visible = true;

	onMount(refreshNotif);

	async function refreshNotif() {
		await getAllNotif();
	}

	function handleClose() {
		visible = false;
		setTimeout(() => onClose?.(), 200);
	}

	async function handleMarkAsRead(id: string) {
		await updateNotifById(id);
	}

	async function handleMarkAllAsRead() {
		await updateAllNotif();
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
	<div class="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" on:click={handleClose}></div>
	<div
		in:fly={{ y: -20, duration: 200 }}
		out:fade={{ duration: 200 }}
		class="fixed right-0 top-25 z-50 w-96 rounded-2xl border border-zinc-200 bg-zinc-50/95 shadow-2xl ring-1 ring-zinc-100/60 overflow-hidden backdrop-blur-sm"
	>
		<div class="flex items-center justify-between border-b border-zinc-200 px-5 py-4 bg-gradient-to-r from-zinc-50 to-white">
			<div class="flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
						d="M15 17h5l-1.405-1.405M19 13V9a7 7 0 10-14 0v4l-2 2h18l-2-2z" />
				</svg>
				<h2 class="text-sm font-semibold text-zinc-700 tracking-wide">Notifikasi</h2>
			</div>
			<div class="flex items-center gap-3">
				<button
					class="text-xs text-zinc-500 hover:text-zinc-700 font-medium transition"
					on:click={handleMarkAllAsRead}
				>
					Tandai semua
				</button>
				<button
					class="text-zinc-400 hover:text-zinc-600 transition"
					on:click={handleClose}
					aria-label="Close"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
		<div class="max-h-96 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
			{#if $loadingNotif}
				<div class="flex justify-center py-6">
					<div class="h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-600"></div>
				</div>
			{:else if $notifikasiStore && $notifikasiStore.length > 0}
				{#each $notifikasiStore as notif (notif.id)}
					<div
						class={`group relative rounded-xl border p-4 transition-all duration-200 ${
							notif.notifikasi_isread === 'False'
								? 'bg-white border-zinc-200 hover:bg-zinc-100'
								: 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200/70'
						}`}
					>
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<h3 class="font-semibold text-zinc-800 text-sm">{notif.notifikasi_nama}</h3>
								</div>
								<p class="text-xs text-zinc-600 mt-1 leading-snug">{notif.notifikasi_isi}</p>
								<p class="text-[10px] text-zinc-400 mt-2">{timeAgo(notif.createdAt)}</p>
							</div>

							{#if notif.notifikasi_isread === 'False'}
								<button
									class="ml-3 text-[11px] font-medium text-zinc-500 hover:text-zinc-700 underline"
									on:click={() => handleMarkAsRead(notif.id)}
								>
									Baca
								</button>
							{/if}
						</div>
					</div>
				{/each}
			{:else}
				<div class="py-6 flex flex-col items-center text-zinc-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405M19 13V9a7 7 0 10-14 0v4l-2 2h18l-2-2z" />
					</svg>
					<p class="text-sm italic">Belum ada notifikasi baru</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

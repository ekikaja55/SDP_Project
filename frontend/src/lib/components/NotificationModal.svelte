<!-- src/lib/components/notificationModal.svelte -->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	export let message: string = '';
	export let type: 'success' | 'error';
	export let duration: number = 2500;
	export let onClose: () => void; // callback prop modern

	let visible = true;
	let timeout: ReturnType<typeof setTimeout>;

	$: if (visible) {
		clearTimeout(timeout);
		timeout = setTimeout(() => close(), duration);
	}

	function close() {
		clearTimeout(timeout);
		visible = false;
		onClose?.();
	}
</script>

{#if visible}
	<!-- Overlay -->
	<div
		role="button"
		tabindex="0"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 flex cursor-default items-center justify-center bg-black/40"
		on:click={close}
		on:keydown={(e) => e.key === 'Enter' && close()}
		aria-label="Tutup notifikasi"
	>
		<!-- Modal -->
		<div
			in:fly={{ y: 40, duration: 200 }}
			out:fly={{ y: -40, duration: 150 }}
			on:click|stopPropagation
			class="w-[90%] max-w-sm rounded-xl p-6 text-center shadow-lg
				{type === 'success' ? 'bg-green-600' : ''}
				{type === 'error' ? 'bg-red-600' : ''}
				text-white"
		>
			<p class="mb-2 text-lg font-semibold">
				{#if type === 'success'}
					✅ Berhasil
				{:else}
					❌ Gagal
				{/if}
			</p>

			<p>{message}</p>

			<button
				class="mt-4 rounded bg-white/20 px-4 py-1 transition hover:bg-white/30"
				on:click={close}
			>
				Tutup
			</button>
		</div>
	</div>
{/if}

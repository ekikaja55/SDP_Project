<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	export let message: string = '';
	export let type: 'success' | 'error';
	export let onClose: () => void;

	let visible = true;

	function handleClose() {
		visible = false;
		onClose?.();
	}

	function cekColor(): string {
		return type === 'success' ? 'text-emerald-600' : 'text-rose-600';
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="relative w-[90%] max-w-md rounded-2xl bg-zinc-50 shadow-2xl p-6 sm:p-8 border border-zinc-200 text-zinc-800"
			transition:fly={{ y: 10, duration: 200 }}
		>
			<!-- Tombol close -->
			<button
				class="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 transition"
				on:click={handleClose}
				aria-label="Close"
			>
				✕
			</button>

			<div class="flex items-center gap-3 mb-4">
				<div
					class={`h-10 w-10 flex items-center justify-center rounded-full border-2 ${
						type === 'success'
							? 'border-emerald-500 text-emerald-600 bg-emerald-50'
							: 'border-rose-500 text-rose-600 bg-rose-50'
					}`}
				>
					{#if type === 'success'}
						✓
					{:else}
						⚠
					{/if}
				</div>
				<h2 class={`text-xl font-semibold capitalize ${cekColor()}`}>{type}</h2>
			</div>

			<!-- Pesan utama -->
			<p class="text-zinc-700 text-base mb-5 leading-relaxed">{message}</p>
		</div>
	</div>
{/if}

<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	export let onClose: () => void;
	export let img: string;
	let visible = true;

	function close() {
		visible = false;
		onClose?.();
	}
</script>

{#if visible}
	<div
		role="button"
		tabindex="0"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/70 backdrop-blur-sm"
		on:click={close}
		on:keydown={(e) => e.key === 'Enter' && close()}
	>
		<div
			in:fly={{ y: 30, duration: 200 }}
			out:fly={{ y: -30, duration: 150 }}
			on:click|stopPropagation
			class="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-2xl transition-all duration-300"
		>


			<div class="flex flex-col items-center">
				<img
					src={img}
					alt="foto"
					class="w-full max-h-[70vh] object-contain rounded-xl border border-zinc-200 bg-zinc-100"
				/>

				<button
					class="mt-6 rounded-lg border border-zinc-300 bg-zinc-100 px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 transition"
					on:click={close}
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}

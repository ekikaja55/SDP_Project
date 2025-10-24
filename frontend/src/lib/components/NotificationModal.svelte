<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	export let message: string = '';
	export let type: 'success' | 'error';
	// export let duration: number = 2500;
	export let onClose: () => void;

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
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
		on:click={close}
		on:keydown={(e) => e.key === 'Enter' && close()}
	>
		<div
			in:fly={{ y: 30, duration: 200 }}
			out:fly={{ y: -30, duration: 150 }}
			on:click|stopPropagation
			class="w-[90%] max-w-sm rounded-2xl p-6 text-center shadow-xl
        transition-all duration-300
        {type === 'success'
				? 'border border-zinc-300 bg-zinc-200 text-green-800'
				: 'border border-zinc-300 bg-zinc-200 text-red-800'}"
		>
			<p class="mb-3 text-lg font-semibold">
				{type === 'success' ? 'Berhasil' : 'Gagal'}
			</p>

			<p class="text-sm">{message}</p>

			<button
				class="mt-5 rounded-lg border px-5 py-1.5 font-medium transition
				{type === 'success'
					? 'border-green-600 text-green-700 hover:bg-green-600 hover:text-white'
					: 'border-red-600 text-red-700 hover:bg-red-600 hover:text-white'}"
				on:click={close}
			>
				Tutup
			</button>
    </div>
	</div>
{/if}

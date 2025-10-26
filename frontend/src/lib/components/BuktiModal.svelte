<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	// export let duration: number = 2500;
	export let onClose: () => void;
	export let img;
	let visible = true;

	function close() {
		visible = false;
		onClose?.();
	}

	console.log(img);
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
			class="w-[100%] max-w-2xl rounded-2xl border border-zinc-300 bg-zinc-200
        p-6 text-center text-green-800 shadow-xl transition-all duration-300
       "
		>
			<img src={img} alt="foto" class="w-full"/>
			<button
				class="mt-5 rounded-lg border border-red-600 px-5 py-1.5 font-medium text-red-700 transition hover:bg-red-600 hover:text-white"
				on:click={close}
			>
				Tutup
			</button>
		</div>
	</div>
{/if}

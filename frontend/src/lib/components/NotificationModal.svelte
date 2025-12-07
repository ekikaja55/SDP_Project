<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	export let message: string = '';
	export let type: 'success' | 'error';
	export let onClose: () => void;
	export let isLogin: boolean = false;

	let visible = true;

	function handleClose() {
		visible = false;
		onClose?.();
	}

	function redirect() {
		goto('/login');
	}

	function cekColor(): string {
		return type === 'success' ? 'text-emerald-600' : 'text-rose-600';
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center "
		transition:fade={{ duration: 200 }}
	>
		<div
			class="relative w-[90%] max-w-md rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-zinc-800 shadow-2xl sm:p-8"
			transition:fly={{ y: 10, duration: 200 }}
		>
			{#if isLogin}
				<button
					class="absolute right-4 top-4 text-zinc-400 transition hover:text-zinc-600"
					on:click={redirect}
					aria-label="Close"
				>
					✕
				</button>
			{:else}
				<button
					class="absolute right-4 top-4 text-zinc-400 transition hover:text-zinc-600"
					on:click={handleClose}
					aria-label="Close"
				>
					✕
				</button>
			{/if}
			<div class="mb-4 flex items-center gap-3">
				<div
					class={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
						type === 'success'
							? 'border-emerald-500 bg-emerald-50 text-emerald-600'
							: 'border-rose-500 bg-rose-50 text-rose-600'
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
			<p class="mb-5 text-base leading-relaxed text-zinc-700">{message}</p>
		</div>
	</div>
{/if}

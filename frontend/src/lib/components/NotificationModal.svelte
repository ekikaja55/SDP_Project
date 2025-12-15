<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, fly, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	import { CheckCircle2, AlertCircle, X, ArrowRight } from '@lucide/svelte';

	export let message: string = '';
	export let type: 'success' | 'error';
	export let onClose: () => void;
	export let isLogin: boolean = false;

	let visible = true;

	$: config =
		type === 'success'
			? {
					icon: CheckCircle2,
					title: 'Berhasil!',
					color: 'text-emerald-600',
					bgColor: 'bg-emerald-50',
					ringColor: 'ring-emerald-100',
					btnColor: 'bg-emerald-600 hover:bg-emerald-700'
				}
			: {
					icon: AlertCircle,
					title: 'Terjadi Kesalahan',
					color: 'text-rose-600',
					bgColor: 'bg-rose-50',
					ringColor: 'ring-rose-100',
					btnColor: 'bg-rose-600 hover:bg-rose-700'
				};

	function handleClose() {
		visible = false;
		setTimeout(() => onClose?.(), 200);
	}

	function redirect() {
		visible = false;
		goto('/login');
		onClose?.();
	}
</script>

{#if visible}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
		<div
			class="absolute inset-0 bg-zinc-900/40 backdrop-blur-[4px] transition-opacity"
			transition:fade={{ duration: 200 }}
			on:click={isLogin ? redirect : handleClose}
		></div>

		<div
			class="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 sm:p-8"
			in:scale={{ duration: 300, start: 0.95, easing: backOut }}
			out:fade={{ duration: 150 }}
		>
			<button
				class="absolute top-4 right-4 rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
				on:click={isLogin ? redirect : handleClose}
				aria-label="Close"
			>
				<X class="h-5 w-5" />
			</button>

			<div class="flex flex-col items-center text-center">
				<div
					class={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${config.bgColor} ${config.color} ring-8 ${config.ringColor}`}
				>
					<svelte:component this={config.icon} class="h-8 w-8" strokeWidth={2} />
				</div>

				<h2 class="text-xl font-bold tracking-tight text-zinc-900">
					{config.title}
				</h2>

				<p class="mt-2 text-sm leading-relaxed text-zinc-500">
					{message}
				</p>

				<div class="mt-6 w-full">
					{#if isLogin}
						<button
							on:click={redirect}
							class="group flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:-translate-y-0.5 hover:bg-zinc-800"
						>
							Masuk Sekarang
							<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</button>
					{:else}
						<button
							on:click={handleClose}
							class={`w-full rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${config.btnColor}`}
						>
							Mengerti
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

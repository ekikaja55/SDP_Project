<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	import { CheckCircle2, AlertCircle, X, MessageCircle, ArrowRight } from '@lucide/svelte';

	export let onClose: () => void;
	export let message: string = '';
	export let type: 'success' | 'error';
	export let user_nama: string = '';

	let visible = true;

	$: config =
		type === 'success'
			? {
					title: 'Transaksi Berhasil!',
					icon: CheckCircle2,
					color: 'text-emerald-600',
					bgColor: 'bg-emerald-50',
					ringColor: 'ring-emerald-100',
					btnClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
				}
			: {
					title: 'Transaksi Gagal',
					icon: AlertCircle,
					color: 'text-rose-600',
					bgColor: 'bg-rose-50',
					ringColor: 'ring-rose-100',
					btnClass: 'bg-zinc-900 hover:bg-zinc-800'
				};

	function handleClose(): void {
		visible = false;
		setTimeout(() => onClose?.(), 200);
	}

	function generateUrl() {
		const phone = '6285739761999';
		const text = `Hai Admin, saya baru saja melakukan checkout pesanan atas nama *${user_nama}*. Mohon dikonfirmasi ya, terima kasih!`;
		return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
	}
</script>

{#if visible}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
		<div
			class="absolute inset-0 bg-zinc-900/40 backdrop-blur-[4px] transition-opacity"
			transition:fade={{ duration: 200 }}
			on:click={handleClose}
		></div>

		<div
			class="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 sm:p-8"
			in:scale={{ duration: 300, start: 0.95, easing: backOut }}
			out:fade={{ duration: 150 }}
		>
			<button
				class="absolute top-4 right-4 rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
				on:click={handleClose}
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

				<div class="mt-8 w-full space-y-3">
					{#if type === 'success'}
						<div class="space-y-3">
							<p class="text-xs font-medium tracking-wide text-zinc-400 uppercase">
								Langkah Selanjutnya
							</p>

							<a
								href={generateUrl()}
								target="_blank"
								rel="noreferrer"
								class={`group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 ${config.btnClass}`}
							>
								<MessageCircle class="h-5 w-5 fill-white/20" />
								Konfirmasi via WhatsApp
							</a>

							<button
								on:click={handleClose}
								class="w-full rounded-xl py-2.5 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-800"
							>
								Nanti saja
							</button>
						</div>
					{:else}
						<button
							on:click={handleClose}
							class="w-full rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200"
						>
							Tutup
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

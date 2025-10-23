<!-- src/lib/components/CartModal.svelte -->
<script lang="ts">
	import { cartStore } from '$lib';
	import { fade, fly } from 'svelte/transition';

	export let onClose: () => void;
	let visible = true;

	// let totalStore = () => cartStore.getGrandTotal();
	// $: console.log('Grand Total Isi: ', totalStore);
	// $: console.log('Grand Total Type: ', typeof totalStore);

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
		class="fixed inset-0 z-50 flex cursor-default items-center justify-center bg-black/40"
		on:click={close}
		on:keydown={(e) => e.key === 'Enter' && close()}
		aria-label="Tutup notifikasi"
	>
		<div
			in:fly={{ y: 40, duration: 200 }}
			out:fly={{ y: -40, duration: 150 }}
			on:click|stopPropagation
			class="w-full max-w-lg rounded-xl bg-zinc-800 p-6 text-white shadow-lg"
		>
			<h1 class="text-center text-2xl font-bold text-yellow-400">Keranjang Anda</h1>

			<div class="mt-5 max-h-80 overflow-y-auto rounded-md bg-zinc-900 p-3">
				{#if $cartStore.length > 0}
					{#each $cartStore as item (item.id)}
						<div class="mb-3 rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-sm">
							<h1 class="font-semibold">{item.produk_nama}</h1>
							<p>Harga: Rp{item.produk_harga.toLocaleString('id-ID')}</p>
							<p>Qty: {item.qty}</p>
							<p class="text-yellow-400">
								Total: Rp{(item.produk_total || 0).toLocaleString('id-ID')}
							</p>
						</div>
					{/each}

					<div class="mt-4 border-t border-zinc-600 pt-3 text-right text-lg font-bold">
						Total Belanja:
						<!-- <span class="text-green-400">Rp. {cartStore.getGrandTotal()}</span> -->
					</div>
				{:else}
					<p class="py-10 text-center text-gray-400">Keranjang Anda kosong Njir</p>
				{/if}
			</div>

			<div class="mt-5 flex justify-between">
				<button
					class="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
					on:click={() => cartStore.clear()}
				>
					Clear Cart
				</button>

				<button
					class="rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-500"
					on:click={close}
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}

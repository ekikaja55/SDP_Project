<!-- src/routes/cart/+page.svelte -->
<script lang="ts">
	// test ini rico
	import { goto } from '$app/navigation';
	import { cartStore, grandTotalStore } from '$lib';
	import { onMount } from 'svelte';
	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

	onMount(() => {
		console.log('page cart fn OnMount() -> masuk');
	});

	function handleCheckout() {
		console.log('Checkout:', $cartStore);
	}

	function handleBack() {
		console.log('Back button clicked');
		goto('catalog');
	}

	function updateQty(id: string, qty: number) {
		cartStore.setQty(id, qty);
	}
</script>

<div class="min-h-screen bg-gray-100 p-6">
	<div class="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow">
		<div class="mb-6 flex justify-between">
			<button
				on:click={handleBack}
				class="rounded-lg bg-gray-200 px-5 py-2 font-medium hover:bg-gray-300">← Kembali</button
			>
		</div>
		<h1 class="mb-6 text-2xl font-semibold text-gray-800">Keranjang Belanja</h1>

		{#if $cartStore.length === 0}
			<p class="py-10 text-center text-gray-500">Keranjang kamu masih kosong.</p>
		{:else}
			<div class="divide-y">
				{#each $cartStore as item}
					<div class="flex items-center justify-between py-4">
						<div class="flex items-center gap-4">
							<img
								src={`${BASE_URL}/uploads/${item.produk_gambar}`}
								alt={item.produk_nama}
								class="h-20 w-20 rounded-lg border object-cover"
							/>
							<div>
								<h2 class="font-semibold text-gray-800">{item.produk_nama}</h2>
								<p class="text-sm text-gray-500">Rp {item.produk_harga.toLocaleString()}</p>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<button
								on:click={() => cartStore.remove(item.id)}
								class="rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300">-</button
							>

							<input
								type="text"
								min="1"
								class="w-14 rounded-lg border text-center"
								bind:value={item.qty}
								on:change={(e) => updateQty(item.id, 1)}
							/>

							<button
								on:click={() => cartStore.add(item)}
								class="rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300">+</button
							>

							<span class="w-28 text-right font-semibold text-gray-700">
								Rp {(item.produk_total ?? 0).toLocaleString()}
							</span>
						</div>
					</div>
				{/each}
			</div>

			<hr class="my-6" />

			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold">Total</h2>
				<p class="text-xl font-bold text-blue-600">
					Rp {$grandTotalStore}
				</p>
			</div>

			<div class="mt-6 flex justify-between">
				<button
					on:click={handleCheckout}
					class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
					>Checkout</button
				>
				<button
					class="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
					on:click={() => cartStore.clear()}
				>
					Clear Cart
				</button>
			</div>
		{/if}
	</div>
</div>

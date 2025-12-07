import { browser } from '$app/environment';
import type { CartProduk } from '$lib';
import { derived, get, writable, type Writable } from 'svelte/store';

export const msgCart: Writable<boolean> = writable<boolean>(false);

function createCartStore() {
	let initial: CartProduk[] = [];

	if (browser) {
		const stored = localStorage.getItem('cartList');
		initial = stored ? JSON.parse(stored) : [];
	}

	const store = writable<CartProduk[]>(initial);
	store.subscribe((value) => {
		if (browser) {
			localStorage.setItem('cartList', JSON.stringify(value));
		}
	});

	return {
		...store,

		init() {
			if (browser) {
				const stored = localStorage.getItem('cartList');
				if (!stored) {
					localStorage.setItem('cartList', JSON.stringify([]));
					store.set([]);
				}
			}
		},

		add(produk: CartProduk) {
			const current = get(store);
			const exist = current.find((item) => item.id === produk.id);

			let updated: CartProduk[];

			if (exist) {
				updated = current.map((item) =>
					item.id === produk.id
						? {
								...item,
								qty: (item.qty || 1) + 1,
								produk_total: item.produk_harga * ((item.qty || 1) + 1)
							}
						: item
				);
				msgCart.set(true);

			} else {
				const newItem: CartProduk = {
					id: produk.id,
					produk_nama: produk.produk_nama,
					produk_gambar: produk.produk_gambar,
					produk_harga: produk.produk_harga,
					qty: 1,
					produk_total: produk.produk_harga
				};
				updated = [...current, newItem];
				msgCart.set(true);
			}

			store.set(updated);
		},

		remove(id: string) {
			const current = get(store);
			const exist = current.find((item) => item.id === id);
			if (!exist) return;

			let updated: CartProduk[];

			if (exist.qty && exist.qty > 1) {
				updated = current.map((item) =>
					item.id === id
						? {
								...item,
								qty: (item.qty || 1) - 1,
								produk_total: item.produk_harga * ((item.qty || 1) - 1)
							}
						: item
				);
			} else {
				updated = current.filter((item) => item.id !== id);
			}

			store.set(updated);
		},

		setQty(id: string, qtyBaru: number) {
			if (qtyBaru < 1) return;

			const current = get(store);
			const exist = current.find((item) => item.id === id);
			if (!exist) return;

			const updated = current.map((item) =>
				item.id === id
					? {
							...item,
							qty: qtyBaru,
							produk_total: item.produk_harga * qtyBaru
						}
					: item
			);

			store.set(updated);
		},

		clear() {
			store.set([]);
			if (browser) localStorage.setItem('cartList', JSON.stringify([]));
		}
	};
}

export const cartStore = createCartStore();
export const grandTotalStore = derived(cartStore, ($cart) =>
	$cart.reduce((sum, item) => sum + (Number(item.produk_total) ?? 0), 0)
);

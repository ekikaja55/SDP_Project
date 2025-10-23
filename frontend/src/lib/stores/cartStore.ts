import { browser } from '$app/environment';
import type { CartProduk } from '$lib';
import { derived, get, writable } from 'svelte/store';

function createCartStore() {
	let initial: CartProduk[] = [];

	// hanya jalan di browser
	if (browser) {
		const stored = localStorage.getItem('cartList');
		initial = stored ? JSON.parse(stored) : [];
	}

	const store = writable<CartProduk[]>(initial);

	// persist otomatis
	store.subscribe((value) => {
		if (browser) {
			localStorage.setItem('cartList', JSON.stringify(value));
		}
	});

	return {
		...store,

		init() {
			if (browser) {
				console.log('init cart...');
				const stored = localStorage.getItem('cartList');
				if (!stored) {
					localStorage.setItem('cartList', JSON.stringify([]));
					store.set([]);
				}
			}
		},

		add(produk: CartProduk) {
			console.log('add cart:', produk);
			const current = get(store);
			const exist = current.find((item) => item.id === produk.id);

			let updated: CartProduk[];

			if (exist) {
				// Tambahkan qty jika produk sudah ada
				updated = current.map((item) =>
					item.id === produk.id
						? {
								...item,
								qty: (item.qty || 1) + 1,
								produk_total: item.produk_harga * ((item.qty || 1) + 1)
							}
						: item
				);
				console.log('produk sudah ada, qty ditambah');
			} else {
				// Tambahkan produk baru ke cart
				const newItem: CartProduk = {
					id: produk.id,
					produk_nama: produk.produk_nama,
					produk_gambar: produk.produk_gambar,
					produk_harga: produk.produk_harga,
					qty: 1,
					produk_total: produk.produk_harga
				};
				updated = [...current, newItem];
				console.log('produk baru ditambahkan');
			}

			store.set(updated);
			console.log('cart updated:', updated);
		},

		remove(id: string) {
			const current = get(store);
			const exist = current.find((item) => item.id === id);
			if (!exist) return;

			let updated: CartProduk[];

			if (exist.qty && exist.qty > 1) {
				// Kurangi qty jika lebih dari 1
				updated = current.map((item) =>
					item.id === id
						? {
								...item,
								qty: (item.qty || 1) - 1,
								produk_total: item.produk_harga * ((item.qty || 1) - 1)
							}
						: item
				);
				console.log('qty dikurangi');
			} else {
				// Hapus produk jika qty tinggal 1
				updated = current.filter((item) => item.id !== id);
				console.log('produk dihapus dari cart');
			}

			store.set(updated);
			console.log('cart updated:', updated);
		},

		setQty(id: string, qtyBaru: number) {
			if (qtyBaru < 1) return; // biar ga 0 / negatif

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
			console.log(`qty produk ${id} diubah ke ${qtyBaru}`);
		},

		clear() {
			store.set([]);
			if (browser) localStorage.setItem('cartList', JSON.stringify([]));
			console.log('cart cleared');
		},


	};
}

export const cartStore = createCartStore();
export const grandTotalStore = derived(cartStore, ($cart) =>
	$cart.reduce((sum, item) => sum + (Number(item.produk_total) ?? 0), 0)
);

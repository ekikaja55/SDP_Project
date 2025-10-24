<!-- src/routes/dashboard/admin/products/+page.svelte -->
<script lang="ts">
	import {
		addProduk,
		deleteProduk,
		getAllProduk,
		loadingProduk,
		messageHandleProduk,
		produkStore,
		updateProduk,
		type ProdukDTO
	} from '$lib';
	import { onMount } from 'svelte';
	const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;

	let produk: ProdukDTO = {
		produk_nama: '',
		produk_gambar: undefined,
		produk_stok: 0,
		produk_harga: 0
	};
	let editingId: string | null = null;

	let searchNama = '';
	let filterStok = '';

	onMount(async () => {
		await getAllProduk();
	});

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			produk.produk_gambar = target.files[0];
		}
	}

	async function handleSubmit() {
		if (editingId) {
			await updateProduk({ ...produk, id: editingId });
			editingId = null;
		} else {
			await addProduk(produk);
		}
		produk = { produk_nama: '', produk_gambar: undefined, produk_stok: 0, produk_harga: 0 };
	}

	function handleEdit(p: ProdukDTO) {
		produk = {
			id: p.id,
			produk_nama: p.produk_nama,
			produk_stok: p.produk_stok,
			produk_harga: p.produk_harga,
			produk_gambar: p.produk_gambar
		};
		editingId = p.id || null;
	}

	async function handleDelete(id: string) {
		if (confirm('Yakin hapus produk ini?')) {
			await deleteProduk(id);
		}
	}

	async function handleFilter() {
		await getAllProduk(searchNama, filterStok);
	}
</script>

<div class="space-y-8">
	<h1 class="text-2xl font-bold mb-4">MANAGE PRODUK</h1>

	{#if $messageHandleProduk}
		<div
			class={`rounded-lg p-4 text-sm font-medium shadow ${
				$messageHandleProduk.type === 'success'
					? 'border border-green-300 bg-green-100 text-green-700'
					: 'border border-red-300 bg-red-100 text-red-700'
			}`}
		>
			{$messageHandleProduk.message}
		</div>
	{/if}

	<!-- FORM TAMBAH/EDIT PRODUK -->
	<form
		on:submit|preventDefault={handleSubmit}
		class="space-y-4 rounded-lg border bg-gray-50 p-5 shadow-md"
	>
		<h2 class="text-lg font-semibold text-gray-700">
			{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
		</h2>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			<input
				type="text"
				bind:value={produk.produk_nama}
				placeholder="Nama Produk"
				class="rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
				required
			/>
			<input
				type="number"
				bind:value={produk.produk_stok}
				placeholder="Stok"
				class="rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
				min="0"
				required
			/>
			<input
				type="number"
				bind:value={produk.produk_harga}
				placeholder="Harga"
				class="rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
				min="0"
				required
			/>
			<input
				type="file"
				accept="image/*"
				on:change={handleFileChange}
				class="rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
			/>
		</div>

		<div class="flex items-center gap-3">
			<button
				type="submit"
				class="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				disabled={$loadingProduk}
			>
				{#if $loadingProduk}
					<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></span>
				{/if}
				{editingId ? 'Update Produk' : 'Simpan Produk'}
			</button>

			{#if editingId}
				<button
					type="button"
					class="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
					on:click={() => {
						produk = {
							produk_nama: '',
							produk_gambar: undefined,
							produk_stok: 0,
							produk_harga: 0
						};
						editingId = null;
					}}
				>
					Batal
				</button>
			{/if}
		</div>
	</form>

	<!-- FILTER PRODUK -->
	<div class="flex flex-wrap items-center gap-3">
		<input
			type="text"
			bind:value={searchNama}
			placeholder="Cari nama produk..."
			class="rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 sm:w-1/3"
		/>
		<select
			bind:value={filterStok}
			class="rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
		>
			<option value="">Semua Stok</option>
			<option value="ada">Ada</option>
			<option value="habis">Habis</option>
		</select>
		<button
			on:click={handleFilter}
			class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>
			Filter
		</button>
	</div>

	<!-- LIST PRODUK (FULL-WIDTH CARD) -->
	{#if $loadingProduk}
		<div class="flex justify-center py-10">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
		</div>
	{:else if !$produkStore || $produkStore.length === 0}
		<p class="text-gray-500">Tidak ada produk ditemukan.</p>
	{:else}
		<div class="flex flex-col gap-4">
			{#each $produkStore as produk}
				<div
					class="flex flex-col items-center gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg md:flex-row"
				>
					<!-- Gambar Produk -->
					{#if produk.produk_gambar}
						<img
							src={`${BASE_URL}/uploads/${produk.produk_gambar}`}
							alt="gambar produk"
							class="h-40 w-40 rounded-lg object-cover"
						/>
					{:else}
						<div
							class="flex h-40 w-40 items-center justify-center rounded-lg bg-gray-100 text-gray-400"
						>
							Tidak ada gambar
						</div>
					{/if}

					<!-- Info Produk -->
					<div class="flex w-full flex-1 flex-col justify-between">
						<div class="space-y-1">
							<h3 class="text-xl font-semibold text-gray-800">{produk.produk_nama}</h3>
							<p class="text-gray-600">
								Harga:
								<span class="font-medium text-gray-800">
									Rp{produk.produk_harga.toLocaleString('id-ID')}
								</span>
							</p>
							<p class="text-gray-600">
								Stok:
								<span
									class={`rounded px-2 py-0.5 text-sm text-white ${
										produk.produk_stok > 0 ? 'bg-green-500' : 'bg-red-500'
									}`}
								>
									{produk.produk_stok}
								</span>
							</p>
							<p class="text-sm text-gray-500">
								Dibuat:
								{new Date(produk.createdAt).toLocaleString()}
							</p>
							{#if produk.deletedAt}
								<p class="text-sm font-semibold text-red-600">
									Produk Sudah Dihapus Pada :
									{new Date(produk.deletedAt).toLocaleString()}
								</p>
							{/if}
						</div>

						<!-- Tombol Aksi -->
						{#if !produk.deletedAt}
							<div class="mt-4 flex gap-3">
								<button
									on:click={() => handleEdit(produk)}
									class="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
								>
									Edit
								</button>
								<button
									on:click={() => handleDelete(produk.id!)}
									class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
								>
									Hapus
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

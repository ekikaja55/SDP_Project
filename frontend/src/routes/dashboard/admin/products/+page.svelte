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
		produk = { ...p };
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
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
		<h1 class="text-3xl font-bold text-gray-800 tracking-tight">Manajemen Produk</h1>
	</div>

	{#if $messageHandleProduk}
		<div
			class={`rounded-lg p-4 text-sm font-medium shadow transition-all duration-200 ${
				$messageHandleProduk.type === 'success'
					? 'border border-green-300 bg-green-50 text-green-700'
					: 'border border-red-300 bg-red-50 text-red-700'
			}`}
		>
			{$messageHandleProduk.message}
		</div>
	{/if}

	<section class="rounded-xl border border-gray-200 bg-white shadow-md p-6 space-y-4">
		<h2 class="text-lg font-semibold text-gray-800 border-b pb-2">
			{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
		</h2>

		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<input
					type="text"
					bind:value={produk.produk_nama}
					placeholder="Nama Produk"
					class="rounded-lg border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
					required
				/>
				<input
					type="number"
					bind:value={produk.produk_stok}
					placeholder="Stok"
					min="0"
					class="rounded-lg border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
					required
				/>
				<input
					type="number"
					bind:value={produk.produk_harga}
					placeholder="Harga"
					min="0"
					class="rounded-lg border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
					required
				/>
				<input
					type="file"
					accept="image/*"
					on:change={handleFileChange}
					class="rounded-lg border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
				/>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<button
					type="submit"
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
					disabled={$loadingProduk}
				>
					{#if $loadingProduk}
						<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
					{/if}
					{editingId ? 'Update Produk' : 'Simpan Produk'}
				</button>

				{#if editingId}
					<button
						type="button"
						on:click={() => {
							produk = { produk_nama: '', produk_gambar: undefined, produk_stok: 0, produk_harga: 0 };
							editingId = null;
						}}
						class="rounded-lg bg-gray-400 px-5 py-2.5 text-white font-medium hover:bg-gray-500 transition"
					>
						Batal
					</button>
				{/if}
			</div>
		</form>
	</section>

	<section class="rounded-xl border border-gray-200 bg-white shadow-sm p-5 flex flex-wrap gap-3 items-center">
		<input
			type="text"
			bind:value={searchNama}
			placeholder="Cari nama produk..."
			class="rounded-lg border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:w-1/3"
		/>
		<select
			bind:value={filterStok}
			class="rounded-lg border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-50"
		>
			<option value="">Semua Stok</option>
			<option value="ada">Ada</option>
			<option value="habis">Habis</option>
		</select>
		<button
			on:click={handleFilter}
			class="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition"
		>
			Terapkan Filter
		</button>
	</section>

	<section class="space-y-4">
		{#if $loadingProduk}
			<div class="flex justify-center py-10">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			</div>
		{:else if !$produkStore || $produkStore.length === 0}
			<p class="text-gray-500 text-center">Tidak ada produk ditemukan.</p>
		{:else}
			<div class="flex flex-col gap-4">
				{#each $produkStore as p}
					<div
						class="flex flex-col md:flex-row items-center gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg"
					>
						{#if p.produk_gambar}
							<img
								src={`${BASE_URL}/uploads/${p.produk_gambar}`}
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

						<div class="flex flex-1 flex-col justify-between w-full">
							<div class="space-y-1">
								<h3 class="text-xl font-semibold text-gray-800">{p.produk_nama}</h3>
								<p class="text-gray-700">
									Harga:
									<span class="font-medium text-gray-900">
										Rp{p.produk_harga.toLocaleString('id-ID')}
									</span>
								</p>
								<p class="text-gray-700">
									Stok:
									<span
										class={`rounded px-2 py-0.5 text-sm text-white ${
											p.produk_stok > 0 ? 'bg-green-500' : 'bg-red-500'
										}`}
									>
										{p.produk_stok > 0 ? `${p.produk_stok}` : 'Habis'}
									</span>
								</p>
								<p class="text-sm text-gray-500">
									Dibuat: {new Date(p.createdAt).toLocaleString('id-ID')}
								</p>

								{#if p.deletedAt}
									<p class="text-sm font-semibold text-red-600">
										Produk dihapus pada:
										{new Date(p.deletedAt).toLocaleString('id-ID')}
									</p>
								{/if}
							</div>

							{#if !p.deletedAt}
								<div class="mt-4 flex flex-wrap gap-3">
									<button
										on:click={() => handleEdit(p)}
										class="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 transition"
									>
										Edit
									</button>
									<button
										on:click={() => handleDelete(p.id!)}
										class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
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
	</section>
</div>

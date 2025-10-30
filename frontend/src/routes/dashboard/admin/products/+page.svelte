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
	import { CheckCircle, Edit3, Filter, Search, Trash2 } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import NotificationModal from '../../../../lib/components/NotificationModal.svelte';

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
	<!-- Header -->
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-3xl font-bold tracking-tight text-zinc-800">Manage Products</h1>
	</div>

	{#if $messageHandleProduk}
		<NotificationModal
			message={$messageHandleProduk.message}
			type={$messageHandleProduk.type}
			onClose={() => messageHandleProduk.set(null)}
		/>
	{/if}

	<!-- Form Produk -->
	<section class="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-md">
		<h2
			class="flex items-center gap-2 border-b border-zinc-200 pb-2 text-lg font-semibold text-zinc-800"
		>
			<CheckCircle class="h-5 w-5 text-emerald-600" />
			{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
		</h2>

		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<input
					type="text"
					bind:value={produk.produk_nama}
					placeholder="Nama Produk"
					class="rounded-xl border-zinc-300 bg-white p-3 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-100"
					required
				/>
				<input
					type="number"
					bind:value={produk.produk_stok}
					placeholder="Stok"
					min="0"
					class="rounded-xl border-zinc-300 bg-white p-3 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-100"
					required
				/>
				<input
					type="number"
					bind:value={produk.produk_harga}
					placeholder="Harga"
					min="0"
					class="rounded-xl border-zinc-300 bg-white p-3 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-100"
					required
				/>
				<input
					type="file"
					accept="image/*"
					on:change={handleFileChange}
					class="rounded-xl border-zinc-300 bg-white p-3 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-100"
				/>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<button
					type="submit"
					class="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-50"
					disabled={$loadingProduk}
				>
					{#if $loadingProduk}
						<span
							class="h-4 w-4 animate-spin rounded-full border-2 border-zinc-50 border-t-transparent"
						></span>
					{/if}
					{editingId ? 'Update Produk' : 'Simpan Produk'}
				</button>

				{#if editingId}
					<button
						type="button"
						on:click={() => {
							produk = {
								produk_nama: '',
								produk_gambar: undefined,
								produk_stok: 0,
								produk_harga: 0
							};
							editingId = null;
						}}
						class="rounded-xl bg-zinc-300 px-5 py-2.5 font-medium text-zinc-800 transition hover:bg-zinc-400"
					>
						Batal
					</button>
				{/if}
			</div>
		</form>
	</section>

	<!-- Filter -->
	<section
		class="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm"
	>
		<div class="relative flex items-center sm:w-1/3">
			<Search class="absolute left-3 h-5 w-5 text-zinc-400" />
			<input
				type="text"
				bind:value={searchNama}
				placeholder="Cari nama produk..."
				class="w-full rounded-xl border-zinc-300 bg-white p-3 pl-10 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-100"
			/>
		</div>

		<div class="relative">
			<Filter class="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
			<select
				bind:value={filterStok}
				class="rounded-xl border-zinc-300 bg-white p-3 pl-10 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-100"
			>
				<option value="">Semua Stok</option>
				<option value="ada">Ada</option>
				<option value="habis">Habis</option>
			</select>
		</div>

		<button
			on:click={handleFilter}
			class="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 font-medium text-zinc-50 transition hover:bg-zinc-800"
		>
			<Filter class="h-4 w-4" />
			Terapkan Filter
		</button>
	</section>

	<!-- List Produk -->
	<section class="space-y-4">
		{#if $loadingProduk}
			<div class="flex justify-center py-10">
				<div
					class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent"
				></div>
			</div>
		{:else if !$produkStore || $produkStore.length === 0}
			<p class="text-center text-zinc-500">Tidak ada produk ditemukan.</p>
		{:else}
			<div class="flex flex-col gap-4">
				{#each $produkStore as p}
					<div
						class="flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row"
					>
						{#if p.produk_gambar}
							<img
								src={`${BASE_URL}/uploads/${p.produk_gambar}`}
								alt="gambar produk"
								class="h-40 w-40 rounded-xl border border-zinc-200 object-cover"
							/>
						{:else}
							<div
								class="flex h-40 w-40 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-400"
							>
								Tidak ada gambar
							</div>
						{/if}

						<div class="flex w-full flex-1 flex-col justify-between">
							<div class="space-y-1">
								<h3 class="text-xl font-semibold text-zinc-800">{p.produk_nama}</h3>
								<p class="text-zinc-700">
									Harga:
									<span class="font-medium text-zinc-900">
										Rp{p.produk_harga.toLocaleString('id-ID')}
									</span>
								</p>
								<p class="text-zinc-700">
									Stok:
									<span
										class={`rounded px-2 py-0.5 text-sm text-white ${
											p.produk_stok > 0 ? 'bg-emerald-500' : 'bg-rose-500'
										}`}
									>
										{p.produk_stok > 0 ? `${p.produk_stok}` : 'Habis'}
									</span>
								</p>
								<p class="text-sm text-zinc-500">
									Dibuat: {new Date(p.createdAt).toLocaleString('id-ID')}
								</p>

								{#if p.deletedAt}
									<p class="text-sm font-semibold text-rose-600">
										Produk dihapus pada:
										{new Date(p.deletedAt).toLocaleString('id-ID')}
									</p>
								{/if}
							</div>

							{#if !p.deletedAt}
								<div class="mt-4 flex flex-wrap gap-3">
									<button
										on:click={() => {
											handleEdit(p);
											window.scrollTo({ top: 0, behavior: 'smooth' });
										}}
										class="flex items-center gap-2 rounded-xl bg-zinc-200 px-4 py-2 text-zinc-800 transition hover:bg-zinc-300"
									>
										<Edit3 class="h-4 w-4" />
										Edit
									</button>
									<button
										on:click={() => handleDelete(p.id!)}
										class="flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-white transition hover:bg-rose-600"
									>
										<Trash2 class="h-4 w-4" />
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

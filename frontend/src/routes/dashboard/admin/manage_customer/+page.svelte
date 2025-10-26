<!--src/routes/dashboard/admin/manage_customer/+page.svelte -->
<!-- halaman manage customer untuk admin -->
<script lang="ts">
	import { customerStore, getUserData, loadingCust, query } from '$lib';
	import { onMount } from 'svelte';

	onMount(() => {
		refreshLaporanCust();
	});

	async function refreshLaporanCust() {
		await getUserData(query);
	}

	function handleReset() {
		query.search = '';
		query.sort = '';
		refreshLaporanCust();
	}
</script>

<h1 class="mb-6 text-3xl font-bold text-gray-800">CUSTOMER DATA</h1>

<!-- Filter Section -->
<div class="mb-8 rounded-xl bg-white p-6 shadow-sm border border-gray-200">
	<h2 class="mb-4 text-lg font-semibold text-gray-700">Filter & Sorting</h2>
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
		<input
			type="text"
			bind:value={query.search}
			placeholder="Cari nama customer..."
			class="w-full sm:flex-1 rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
		/>

		<select
			bind:value={query.sort}
			class="w-full sm:w-auto rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
		>
			<option value="">Semua Customer</option>
			<option value="terbaru">Terbaru</option>
			<option value="terlama">Terlama</option>
		</select>

		<div class="flex gap-3">
			<button
				on:click={refreshLaporanCust}
				class="rounded-lg bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-700 transition"
			>
				Search
			</button>

			<button
				on:click={handleReset}
				class="rounded-lg bg-red-500 px-5 py-2 text-white font-medium hover:bg-red-600 transition"
			>
				Reset
			</button>
		</div>
	</div>
</div>

<!-- Data Section -->
{#if $loadingCust}
	<div class="flex justify-center py-10">
		<div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
	</div>
{:else if $customerStore && $customerStore.length > 0}
	<div class="space-y-6">
		{#each $customerStore as cust}
			<div
				class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md w-full"
			>
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 class="text-xl font-semibold text-gray-800">{cust.user_nama}</h2>
						<p class="text-sm text-gray-500">ID: {cust.id}</p>
					</div>

					<div class="mt-3 sm:mt-0 text-sm text-gray-600">
						<p>
							<span class="font-medium">Tanggal Daftar:</span>
							{new Date(cust.createdAt).toLocaleDateString('id-ID', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</p>
						<p>
							<span class="font-medium">Total Transaksi:</span>
							<span class="font-semibold text-blue-600">{cust.total_transaksi}</span>
						</p>
					</div>
				</div>

				<hr class="my-4 border-gray-200" />

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
					<p><span class="font-medium">Email:</span> {cust.user_email}</p>
					<p><span class="font-medium">Role:</span> {cust.user_role}</p>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="mt-10 text-center text-gray-500">Tidak ada data customer yang ditemukan.</p>
{/if}

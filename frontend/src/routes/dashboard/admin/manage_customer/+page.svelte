<!-- src/routes/dashboard/admin/manage_customer/+page.svelte -->
<script lang="ts">
	import { customerStore, getUserData, loadingCust, query } from '$lib';
	import { RotateCcw, Search } from 'lucide-svelte';
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

<!-- Header -->
<div class="mb-8 flex items-center gap-3">
	<h1 class="text-3xl font-bold tracking-tight text-zinc-800">Customer Data</h1>
</div>

<!-- Filter Section -->
<div class="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
	<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-800">
		<Search size="20" class="text-zinc-600" /> Filter & Sorting
	</h2>

	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
		<!-- Input Search -->
		<input
			type="text"
			bind:value={query.search}
			placeholder="Cari nama customer..."
			class="w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-zinc-700 transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300 sm:flex-1"
		/>

		<!-- Sorting -->
		<select
			bind:value={query.sort}
			class="w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-zinc-700 transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300 sm:w-50"
		>
			<option value="">Semua </option>
			<option value="terbaru">Terbaru</option>
			<option value="terlama">Terlama</option>
		</select>

		<!-- Actions -->
		<div class="flex gap-3">
			<button
				on:click={refreshLaporanCust}
				class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
			>
				<Search size="16" /> Search
			</button>

			<button
				on:click={handleReset}
				class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
			>
				<RotateCcw size="16" /> Reset
			</button>
		</div>
	</div>
</div>

<!-- Loading -->
{#if $loadingCust}
	<div class="flex justify-center py-10">
		<div
			class="h-10 w-10 animate-spin rounded-full border-4 border-zinc-400 border-t-transparent"
		></div>
	</div>

	<!-- Data Section -->
{:else if $customerStore && $customerStore.length > 0}
	<div class="space-y-6">
		{#each $customerStore as cust}
			<div
				class="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm transition-all hover:shadow-md"
			>
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 class="text-xl font-semibold text-zinc-800">{cust.user_nama}</h2>
						<p class="text-sm text-zinc-500">ID: {cust.id}</p>
					</div>

					<div class="mt-3 text-sm text-zinc-600 sm:mt-0">
						<p>
							<span class="font-medium text-zinc-700">Tanggal Daftar:</span>
							{new Date(cust.createdAt).toLocaleDateString('id-ID', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</p>
						<p>
							<span class="font-medium text-zinc-700">Total Transaksi:</span>
							<span class="font-semibold text-green-600">{cust.total_transaksi}</span>
						</p>
					</div>
				</div>

				<hr class="my-4 border-zinc-200" />

				<div class="grid grid-cols-1 gap-2 text-sm text-zinc-700 sm:grid-cols-2">
					<p><span class="font-medium">Email:</span> {cust.user_email}</p>
					<p><span class="font-medium">Role:</span> {cust.user_role}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- No Data -->
{:else}
	<p class="mt-10 text-center text-zinc-500">Tidak ada data customer yang ditemukan.</p>
{/if}

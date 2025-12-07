<!-- src/routes/+error.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';

	export let error:App.Error;
	export let status: number;

</script>

<svelte:head>
	<title>{status} | Terjadi Kesalahan</title>
</svelte:head>

<div in:fade={{ duration: 300 }}>
	<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
		<div
			class="max-w-lg rounded-2xl bg-white p-10 shadow-lg transition-all duration-300"
		>
			<h1 class="mb-4 text-6xl font-extrabold text-red-600 dark:text-red-400">
				{status}
			</h1>

			{#if status === 404}
				<p class="mb-6 ">Halaman yang kamu cari tidak ditemukan.</p>
			{:else if status === 500}
				<p class="mb-6 ">
					Terjadi kesalahan di server. Silakan coba lagi nanti.
				</p>
			{:else}
				<p class="mb-6 ">
					{error?.message ?? 'Terjadi kesalahan yang tidak diketahui.'}
				</p>
			{/if}

			<a
				href="/"
				class="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 dark:hover:bg-blue-500"
			>
				Kembali ke Beranda
			</a>
		</div>

		<footer class="mt-10 text-sm text-gray-400 dark:text-gray-500">
			© {new Date().getFullYear()} — Kanti's Herbal Store
		</footer>
	</div>
</div>

<!-- src/routes/unauthorized/+page.svelte -->
<script>
  import { fade } from 'svelte/transition';
</script>

<div in:fade class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="text-5xl font-bold text-red-600 mb-4">403</h1>
	<p class="mb-6 text-gray-600">Kamu tidak punya izin untuk mengakses halaman ini.</p>
	<a href="/" class="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700">Kembali</a>
</div>

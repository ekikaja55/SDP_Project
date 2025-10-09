<!-- src/routes/+pages.svelte -->
<!-- untuk LANDING PAGE -->
<script lang="ts">
	// nanti tombol login & register diarahkan ke /login dan /register
</script>

<div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white">
	<h1 class="text-4xl font-bold mb-4 text-gray-800 text-center">
		Selamat Datang di <span class="text-blue-600">Kanti's Store</span>
	</h1>

	<p class="text-gray-600 text-center max-w-md mb-8">
		INI LANDING PAGE
	</p>

	<div class="flex gap-4">
		<a
			href="/login"
			class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
		>
			Masuk
		</a>
		<a
			href="/register"
			class="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
		>
			Daftar
		</a>
	</div>

	<footer class="mt-12 text-sm text-gray-500">
		&copy; {new Date().getFullYear()} ByteSpace. All rights reserved.
	</footer>
</div>

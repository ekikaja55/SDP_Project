<!-- src/routes/+pages.svelte -->
<!-- untuk LANDING PAGE -->
<script lang="ts">
	let products = [
		{
			name: 'SR12 Herbal Habbatussauda',
			desc: 'Minyak Habbatussuada murni, membantu memelihara daya tahan tubuh ',
			price: 'Rp 92.000',
			image: '/images/produk1.png'
		},
		{
			name: 'SR12 Milky Rice Soap',
			desc: 'Bar soap dengan kandungan Ekstrak Pati Beras, Susu dan Minyak kelapa dapat membantu membersihkan kulit dari kotoran dan minyak, melembapkan, menghaluskan dan menyejukan. Kulit menjadi lebih bersih, segar dan tetap sehat.',
			price: 'Rp 23.000',
			image: '/images/produk2.jpg'
		},
		{
			name: 'SR12 Go Milku Original',
			desc: 'SR12 GoMilku merupakan susu kambing etawa dilengkapi nutrisi khusus seperti ikan gabus, daun kelor dan Madu yang bergizi tinggi serta mengandung banyak manfaat untuk kesehatan tubuh.',
			price: 'Rp 131.500',
			image: '/images/produk3.jpg'
		}
	];
</script>

<section class="bg-green-50 text-gray-800">
	<!-- Hero Section -->
	<div class="flex flex-col items-center justify-center px-6 py-20 text-center md:px-16">
		<h1 class="text-4xl font-bold text-green-700 md:text-5xl">Kanti’s Store</h1>
		<p class="mt-4 max-w-2xl text-lg text-gray-600">
			Pusat produk herbal resmi <span class="font-semibold text-green-700">SR12</span> — alami, aman,
			dan berkhasiat untuk kesehatan serta kecantikan Anda.
		</p>
		<a
			href="/catalog"
			class="mt-8 rounded-full bg-green-600 px-6 py-3 text-white shadow-lg transition hover:bg-green-700"
		>
			Belanja Sekarang
		</a>
	</div>

	<!-- Featured Products -->
	<div class="bg-white py-16">
		<h2 class="mb-10 text-center text-3xl font-bold text-green-700">Produk Unggulan</h2>
		<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
			{#each products as p}
				<div
					class="rounded-2xl border border-green-100 bg-white shadow-sm transition hover:scale-105 hover:shadow-lg"
				>
					<img src={p.image} alt={p.name} class="h-56 w-full rounded-t-2xl object-cover" />
					<div class="p-6">
						<h3 class="text-xl font-semibold text-green-700">{p.name}</h3>
						<p class="mt-2 text-sm text-gray-600">{p.desc}</p>
						<p class="mt-4 font-bold text-green-800">{p.price}</p>
						<button
							class="mt-4 w-full rounded-lg bg-green-600 py-2 text-white transition hover:bg-green-700"
						>
							Lihat Detail
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- About Section -->
	<div class="bg-green-100 py-16 text-center">
		<h2 class="text-3xl font-bold text-green-700">Tentang SR12</h2>
		<p class="mx-auto mt-4 max-w-3xl text-gray-700">
			SR12 merupakan brand herbal terpercaya yang menghadirkan produk-produk alami berbasis bahan
			tradisional Indonesia. Setiap produk kami diformulasikan oleh para ahli untuk memberikan
			manfaat nyata bagi kesehatan dan kecantikan Anda.
		</p>
	</div>
</section>

<!-- src/routes/+page.svelte -->
<script>
	import Whatsapp from '$lib/components/Whatsapp.svelte';
import { onMount } from 'svelte';

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-show');
						entry.target.classList.remove('opacity-0');
					}
				});
			},
			{ threshold: 0.2 }
		);

		document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
	});
</script>

<section class="flex min-h-screen flex-col bg-zinc-50 text-zinc-800">
  <Whatsapp/>
	<section id="home" class="reveal flex flex-1 items-center justify-between px-16 py-24 opacity-0">
		<div class="max-w-lg">
			<h2 class="mb-6 text-5xl leading-tight font-bold text-zinc-900">
				Kecantikan Alami, <br />
				<span class="text-zinc-700">Tanpa Sentuhan Kimia</span>
			</h2>
			<p class="mb-10 text-lg leading-relaxed text-zinc-500">
				Temukan rangkaian produk herbal dan kecantikan alami dari bahan terbaik pilihan. Kanti’s
				Store membantu Anda tampil percaya diri dengan sentuhan alami yang murni.
			</p>
			<a
				href="#gallery"
				class="inline-block rounded-full bg-zinc-900 px-8 py-3 font-semibold tracking-wide text-white transition hover:bg-zinc-800"
				>Lihat Produk</a
			>
		</div>

		<div class="relative w-[40%]">
			<img
				src="/images/intro.jpg"
				alt="Produk Herbal"
				class="h-[500px] w-full rounded-2xl object-cover shadow-2xl brightness-95 transition duration-500 hover:brightness-100"
			/>
			<div
				class="absolute -right-6 -bottom-6 rounded-lg border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-700 shadow-md"
			>
				<p>100% Bahan Alami Terpercaya</p>
			</div>
		</div>
	</section>

	<section id="about" class="reveal border-t border-zinc-100 bg-white px-16 py-24 opacity-0">
		<div class="mx-auto max-w-4xl text-center">
			<h3 class="mb-4 text-3xl font-semibold text-zinc-800">Tentang Kanti’s Store</h3>
			<p class="leading-relaxed text-zinc-600">
				Kanti’s Store berdiri dengan visi menghadirkan kecantikan alami yang berkelanjutan. Setiap
				produk kami diformulasikan dari bahan herbal pilihan — seperti lidah buaya, minyak kelapa,
				dan teh hijau — tanpa bahan kimia berbahaya. Perawatan terbaik adalah yang berasal dari
				alam.
			</p>
		</div>
	</section>

	<section id="gallery" class="reveal bg-zinc-50 px-16 py-24 opacity-0">
		<h3 class="mb-10 text-center text-3xl font-semibold text-zinc-800">Produk Unggulan Kami</h3>
		<div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _, i}
				<div
					class="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md"
				>
					<img
						src={`/images/produk${i + 1}.jpg`}
						alt="Produk {i + 1}"
						class="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
					/>
					<div
						class="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/60 opacity-0 transition group-hover:opacity-100"
					>
						<span class="mb-2 text-lg font-semibold text-white">Produk Herbal {i + 1}</span>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section id="benefits" class="reveal border-t border-zinc-100 bg-white px-16 py-24 opacity-0">
		<div class="mx-auto max-w-5xl text-center">
			<h3 class="mb-10 text-3xl font-semibold text-zinc-800">Mengapa Memilih Kami?</h3>

			<div class="grid grid-cols-1 gap-10 text-zinc-700 sm:grid-cols-3">
				<div class="flex flex-col items-center">
					<img src="/icons/icon-leaf.svg" alt="Herbal" class="mb-4 h-16 opacity-80" />
					<h4 class="mb-2 text-lg font-semibold">100% Herbal</h4>
					<p class="text-sm text-zinc-500">
						Diformulasikan dari bahan alami tanpa pengawet dan bahan kimia sintetis.
					</p>
				</div>
				<div class="flex flex-col items-center">
					<img src="/icons/icon-premium.svg" alt="Quality" class="mb-4 h-16 opacity-80" />
					<h4 class="mb-2 text-lg font-semibold">Kualitas Premium</h4>
					<p class="text-sm text-zinc-500">
						Setiap produk melewati uji kualitas agar aman dan efektif untuk semua jenis kulit.
					</p>
				</div>
				<div class="flex flex-col items-center">
					<img src="/icons/icon-price.svg" alt="Natural Beauty" class="mb-4 h-16 opacity-80" />
					<h4 class="mb-2 text-lg font-semibold">Harga Kompetitif</h4>
					<p class="text-sm text-zinc-500">
						Kualitas terbaik dengan harga yang bersaing untuk semua kebutuhan.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section id="testimoni" class="reveal border-t border-zinc-100 bg-zinc-50 px-16 py-24 opacity-0">
		<div class="mx-auto max-w-5xl text-center">
			<h3 class="mb-10 text-3xl font-semibold text-zinc-800">Apa Kata Pelanggan Kami?</h3>

			<div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
				{#each [{ name: 'Ayu Pratiwi', comment: 'Setelah pakai serum herbal dari Kanti, kulitku lebih lembab dan cerah alami!' }, { name: 'Dewi Santika', comment: 'Produk maskernya wangi banget dan hasilnya nyata dari pemakaian pertama.' }, { name: 'Sinta Lestari', comment: 'Suka banget sama konsep natural dan kemasan elegannya. Worth every penny!' }] as testi}
					<div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
						<p class="mb-4 text-zinc-600 italic">“{testi.comment}”</p>
						<h4 class="font-semibold text-zinc-800">— {testi.name}</h4>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section
		id="cta"
		class="reveal border-t border-zinc-100 bg-white px-16 py-24 text-center opacity-0"
	>
		<h3 class="mb-6 text-3xl font-semibold text-zinc-800">Mulai Perawatan Alami Hari Ini</h3>
		<p class="mx-auto mb-8 max-w-2xl text-zinc-600">
			Kecantikan sejati dimulai dari pilihan yang bijak. Gunakan produk herbal alami dari Kanti’s
			Store untuk menjaga kesehatan kulit dan rambutmu tanpa efek samping.
		</p>
		<a
			href="/catalog"
			class="inline-block rounded-full bg-zinc-900 px-8 py-3 font-semibold tracking-wide text-white transition hover:bg-zinc-800"
			>Belanja Sekarang</a
		>
	</section>
</section>

<style>
	@keyframes fadeSlide {
		from {
			opacity: 0;
			transform: translateY(40px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-show {
		animation: fadeSlide 0.8s ease-out forwards;
	}

	/* Transisi lebih halus antar section */
	section {
		transition:
			opacity 0.4s ease-out,
			transform 0.4s ease-out;
	}
</style>

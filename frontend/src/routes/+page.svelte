<script lang="ts">
	import Whatsapp from '$lib/components/Whatsapp.svelte';
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Leaf } from '@lucide/svelte';

	let isLoaded = false;

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 800));

		isLoaded = true;
		await tick();
		setupObserver();
	});

	function setupObserver() {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-show');
						entry.target.classList.remove('opacity-0');
					}
				});
			},
			{ threshold: 0.15 }
		);

		document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
	}
</script>

{#if !isLoaded}
	<div
		out:fade={{ duration: 400 }}
		class="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white"
	>
		<div
			class="relative flex h-24 w-24 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-zinc-100"
		>
			<Leaf class="h-10 w-10 animate-bounce text-zinc-800" strokeWidth={1.5} />

			<span
				class="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-200 opacity-50"
			></span>
		</div>

		<div class="mt-6 flex flex-col items-center gap-2">
			<h1 class="text-xl font-bold tracking-wider text-zinc-900">Kanti’s Store</h1>
			<p class="text-xs tracking-widest text-zinc-500 uppercase">Natural & Pure</p>
		</div>
	</div>
{:else}
	<Whatsapp />

	<section class="flex min-h-screen flex-col bg-zinc-50 text-zinc-800">
		<section
			id="home"
			class="reveal flex flex-col-reverse items-center justify-between px-6 py-12 opacity-0 lg:flex-row lg:px-16 lg:py-24"
		>
			<div class="mt-8 max-w-lg text-center lg:mt-0 lg:text-left">
				<h2 class="mb-6 text-4xl leading-tight font-bold text-zinc-900 lg:text-5xl">
					Kecantikan Alami, <br />
					<span class="text-zinc-500">Tanpa Sentuhan Kimia</span>
				</h2>
				<p class="mb-10 text-lg leading-relaxed text-zinc-500">
					Temukan rangkaian produk herbal dan kecantikan alami dari bahan terbaik pilihan. Kanti’s
					Store membantu Anda tampil percaya diri dengan sentuhan alami yang murni.
				</p>
				<a
					href="#gallery"
					class="inline-block rounded-full bg-zinc-900 px-8 py-3 font-semibold tracking-wide text-white transition hover:-translate-y-1 hover:bg-zinc-700 hover:shadow-lg"
					>Lihat Produk</a
				>
			</div>

			<div class="relative w-full lg:w-[45%]">
				<div class="relative overflow-hidden rounded-2xl shadow-2xl">
					<img
						src="/images/intro.jpg"
						alt="Produk Herbal"
						class="h-[400px] w-full object-cover brightness-95 transition duration-700 hover:scale-105 hover:brightness-100 lg:h-[500px]"
					/>
				</div>
				<div
					class="absolute -right-2 -bottom-4 rounded-xl border border-zinc-100 bg-white/90 p-4 text-sm font-medium text-zinc-700 shadow-xl backdrop-blur-sm lg:-right-6 lg:-bottom-6"
				>
					<div class="flex items-center gap-2">
						<Leaf class="h-4 w-4 text-green-600" />
						<p>100% Bahan Alami</p>
					</div>
				</div>
			</div>
		</section>

		<section
			id="about"
			class="reveal border-t border-zinc-100 bg-white px-6 py-24 opacity-0 lg:px-16"
		>
			<div class="mx-auto max-w-4xl text-center">
				<h3 class="mb-6 text-3xl font-bold text-zinc-800">Tentang Kanti’s Store</h3>
				<p class="text-lg leading-loose text-zinc-500">
					Kanti’s Store berdiri dengan visi menghadirkan kecantikan alami yang berkelanjutan. Setiap
					produk kami diformulasikan dari bahan herbal pilihan — seperti lidah buaya, minyak kelapa,
					dan teh hijau — tanpa bahan kimia berbahaya. Perawatan terbaik adalah yang berasal dari
					alam.
				</p>
			</div>
		</section>

		<section id="gallery" class="reveal bg-zinc-50 px-6 py-24 opacity-0 lg:px-16">
			<div class="mb-12 flex flex-col items-center">
				<span class="mb-2 text-sm font-bold tracking-widest text-zinc-400 uppercase">Katalog</span>
				<h3 class="text-3xl font-bold text-zinc-900">Produk Unggulan Kami</h3>
			</div>

			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each Array(6) as _, i}
					<div
						class="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
					>
						<div class="overflow-hidden">
							<img
								src={`/images/produk${i + 1}.jpg`}
								alt="Produk {i + 1}"
								class="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
							/>
						</div>
						<div class="p-6">
							<h4 class="text-lg font-bold text-zinc-900">Produk Herbal {i + 1}</h4>
							<p class="mt-1 text-sm text-zinc-500">Perawatan kulit intensif</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section
			id="benefits"
			class="reveal border-t border-zinc-100 bg-white px-6 py-24 opacity-0 lg:px-16"
		>
			<div class="mx-auto max-w-6xl">
				<div class="grid grid-cols-1 gap-12 text-zinc-700 sm:grid-cols-3">
					<div
						class="flex flex-col items-center rounded-2xl p-6 text-center transition hover:bg-zinc-50"
					>
						<img src="/icons/icon-leaf.svg" alt="Herbal" class="mb-6 h-12 w-12 opacity-80" />
						<h4 class="mb-3 text-xl font-bold text-zinc-900">100% Herbal</h4>
						<p class="leading-relaxed text-zinc-500">
							Diformulasikan dari bahan alami tanpa pengawet dan bahan kimia sintetis.
						</p>
					</div>
					<div
						class="flex flex-col items-center rounded-2xl p-6 text-center transition hover:bg-zinc-50"
					>
						<img src="/icons/icon-premium.svg" alt="Quality" class="mb-6 h-12 w-12 opacity-80" />
						<h4 class="mb-3 text-xl font-bold text-zinc-900">Kualitas Premium</h4>
						<p class="leading-relaxed text-zinc-500">
							Setiap produk melewati uji kualitas agar aman dan efektif untuk semua jenis kulit.
						</p>
					</div>
					<div
						class="flex flex-col items-center rounded-2xl p-6 text-center transition hover:bg-zinc-50"
					>
						<img
							src="/icons/icon-price.svg"
							alt="Natural Beauty"
							class="mb-6 h-12 w-12 opacity-80"
						/>
						<h4 class="mb-3 text-xl font-bold text-zinc-900">Harga Kompetitif</h4>
						<p class="leading-relaxed text-zinc-500">
							Kualitas terbaik dengan harga yang bersaing untuk semua kebutuhan Anda.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section id="testimoni" class="reveal bg-zinc-50 px-6 py-24 opacity-0 lg:px-16">
			<div class="mb-16 flex flex-col items-center">
				<h3 class="text-center text-3xl font-bold text-zinc-900">Apa Kata Mereka?</h3>
			</div>

			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-3">
				{#each [{ name: 'Ayu Pratiwi', comment: 'Setelah pakai serum herbal dari Kanti, kulitku lebih lembab dan cerah alami!' }, { name: 'Dewi Santika', comment: 'Produk maskernya wangi banget dan hasilnya nyata dari pemakaian pertama.' }, { name: 'Sinta Lestari', comment: 'Suka banget sama konsep natural dan kemasan elegannya. Worth every penny!' }] as testi}
					<div class="relative rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm">
						<div class="absolute -top-4 -left-2 font-serif text-6xl text-zinc-100">“</div>
						<p class="relative z-10 mb-6 leading-relaxed text-zinc-600 italic">"{testi.comment}"</p>
						<div class="flex items-center gap-3">
							<div class="h-10 w-10 rounded-full bg-zinc-200"></div>
							<h4 class="text-sm font-bold text-zinc-900">{testi.name}</h4>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section
			id="cta"
			class="reveal relative overflow-hidden bg-zinc-900 px-6 py-32 text-center opacity-0 lg:px-16"
		>
			<div class="relative z-10 mx-auto max-w-3xl">
				<h3 class="mb-6 text-3xl font-bold text-white lg:text-4xl">
					Mulai Perawatan Alami Hari Ini
				</h3>
				<p class="mb-10 text-lg text-zinc-400">
					Kecantikan sejati dimulai dari pilihan yang bijak. Gunakan produk herbal alami dari
					Kanti’s Store untuk menjaga kesehatan kulit dan rambutmu.
				</p>
				<a
					href="/catalog"
					class="inline-block rounded-full bg-white px-10 py-4 font-bold tracking-wide text-zinc-900 transition hover:bg-zinc-200"
					>Belanja Sekarang</a
				>
			</div>

			<div
				class="absolute top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800 opacity-30 blur-3xl"
			></div>
			<div
				class="absolute right-0 bottom-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-zinc-800 opacity-30 blur-3xl"
			></div>
		</section>
	</section>
{/if}

<style>
	@keyframes fadeSlide {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-show) {
		animation: fadeSlide 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	section {
		will-change: transform, opacity;
	}
</style>

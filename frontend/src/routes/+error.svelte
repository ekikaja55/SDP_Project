<script lang="ts">
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import {
		Home,
		RotateCcw,
		FileQuestion,
		ServerCrash,
		TriangleAlert,
		ArrowLeft
	} from '@lucide/svelte';

	$: status = $page.status;
	$: message = $page.error?.message || 'Terjadi kesalahan yang tidak terduga.';

	let errorContent = {
		title: '',
		desc: '',
		icon: TriangleAlert,
		color: 'text-rose-500 bg-rose-50'
	};

	$: {
		if (status === 404) {
			errorContent = {
				title: 'Halaman Tidak Ditemukan',
				desc: 'Maaf, halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau alamatnya salah ketik.',
				icon: FileQuestion,
				color: 'text-amber-500 bg-amber-50'
			};
		} else if (status === 500) {
			errorContent = {
				title: 'Kesalahan Server Internal',
				desc: 'Maaf, ada masalah di sisi kami. Tim teknis kami sedang berusaha memperbaikinya.',
				icon: ServerCrash,
				color: 'text-rose-600 bg-rose-50'
			};
		} else {
			errorContent = {
				title: 'Terjadi Kesalahan',
				desc: message,
				icon: TriangleAlert,
				color: 'text-zinc-600 bg-zinc-100'
			};
		}
	}

	function goBack() {
		window.history.back();
	}
</script>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12 text-center sm:px-6 lg:px-8"
>
	<div
		in:fly={{ y: 20, duration: 400, delay: 100 }}
		class="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl ring-1 ring-zinc-100"
	>
		<div
			class="mx-auto flex h-24 w-24 items-center justify-center rounded-full {errorContent.color} shadow-sm ring-4 ring-white"
		>
			<svelte:component this={errorContent.icon} class="h-12 w-12" strokeWidth={1.5} />
		</div>

		<div class="space-y-4">
			<h1 class="text-6xl font-black tracking-tighter text-zinc-200">
				{status}
			</h1>

			<h2 class="text-2xl font-bold tracking-tight text-zinc-900">
				{errorContent.title}
			</h2>

			<p class="text-sm leading-relaxed text-zinc-500">
				{errorContent.desc}
			</p>
		</div>

		<div class="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
			<a
				href="/"
				class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-zinc-900/20 active:scale-95 sm:w-auto"
			>
				<Home class="h-4 w-4" />
				Ke Beranda
			</a>

			<button
				on:click={() => window.location.reload()}
				class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 sm:w-auto"
			>
				<RotateCcw class="h-4 w-4" />
				Coba Lagi
			</button>
		</div>

		<div class="mt-6">
			<button
				on:click={goBack}
				class="group inline-flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-600"
			>
				<ArrowLeft class="h-3 w-3 transition-transform group-hover:-translate-x-1" />
				Kembali ke halaman sebelumnya
			</button>
		</div>
	</div>

	<div class="mt-12 text-center text-xs text-zinc-400">
		<p>&copy; {new Date().getFullYear()} Kanti’s Store. All rights reserved.</p>
	</div>
</div>

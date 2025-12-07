<script lang="ts">
	import type { UserAuth } from '../types';

	export let onClose: () => void;
	let visible = true;
	export let message: string = '';
	export let type: 'success' | 'error';
	export let user_nama: string = '';

	function handleClose(): void {
		visible = false;
		onClose?.();
	}

	function cekColor(): string {
		return type === 'success' ? 'text-green-600' : 'text-red-600';
	}

	function generateUrl() {
		const base = 'https://wa.me/6285739761999?text=';
		const pesan = `Hai, saya baru saja melakukan transaksi atas nama *${user_nama}*. Mohon konfirmasi ya.`;
		return base + encodeURIComponent(pesan);
	}
</script>

{#if visible}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
		<div
			class="relative w-[90%] max-w-md rounded-2xl bg-white shadow-2xl p-6 sm:p-8 border border-gray-100"
		>
			<button
				class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
				on:click={handleClose}
				aria-label="Close"
			>
				✕
			</button>

			<div class="flex items-center gap-3 mb-4">
				<div
					class={`h-10 w-10 flex items-center justify-center rounded-full border-2 ${type === 'success'
						? 'border-green-500 text-green-600 bg-green-50'
						: 'border-red-500 text-red-600 bg-red-50'}`}
				>
					{#if type === 'success'}
						✓
					{:else}
						⚠
					{/if}
				</div>
				<h2 class={`text-xl font-semibold capitalize ${cekColor()}`}>{type}</h2>
			</div>
			<p class="text-gray-800 text-base mb-5 leading-relaxed">{message}</p>

			{#if type === 'success'}
				<div class="mt-6 space-y-4">
					<p class="text-gray-700 text-sm font-medium">
						Untuk konfirmasi lebih lanjut, silakan hubungi kami melalui WhatsApp:
					</p>
					<a
						href={generateUrl()}
						target="_blank"
						class="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-white font-medium hover:bg-green-600 transition"
					>
						<span>💬 Hubungi via WhatsApp</span>
					</a>
				</div>
			{/if}
		</div>
	</div>
{/if}

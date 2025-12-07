<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { X, Download, ExternalLink } from '@lucide/svelte';

  export let onClose: () => void;
  export let img: string;
  export let title: string = 'Bukti Pembayaran';

  function close() {
    onClose?.();
  }
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center p-4"
>
  <div
    class="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm transition-opacity"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
    on:click={close}
    role="button"
    tabindex="-1"
  ></div>

  <div
    class="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200"
    in:scale={{ start: 0.95, duration: 200 }}
    out:scale={{ start: 0.95, duration: 150 }}
  >
    <div class="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-white">
      <h3 class="text-lg font-bold text-zinc-800">{title}</h3>
      <button
        on:click={close}
        class="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <div class="flex items-center justify-center bg-zinc-100 p-6">
      <img
        src={img}
        alt="Bukti Transaksi"
        class="max-h-[60vh] w-auto max-w-full rounded-lg border border-zinc-200 object-contain shadow-sm"
      />
    </div>

    <div class="flex justify-end gap-3 border-t border-zinc-100 bg-white px-6 py-4">
      <a
        href={img}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition"
      >
        <ExternalLink class="h-4 w-4" />
        Buka Original
      </a>

      <button
        on:click={close}
        class="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition shadow-lg shadow-zinc-900/10"
      >
        Tutup
      </button>
    </div>
  </div>
</div>

<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let imageUrl: string;
  export let productName: string;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }
</script>

<div
  class="fixed inset-0 z-[60] flex items-center justify-center  p-4 transition-all"
  on:click={close}
  transition:fade={{ duration: 200 }}
>
  <div
    class="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200"
    on:click|stopPropagation
    transition:scale={{ duration: 300, start: 0.95 }}
  >
    <div class="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
      <h3 class="text-lg font-semibold text-zinc-800 truncate pr-4">{productName}</h3>
      <button
        on:click={close}
        class="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="flex items-center justify-center bg-zinc-50 p-2 md:p-8 min-h-[300px] max-h-[60vh] mt-10">
      <img
        src={imageUrl}
        alt={productName}
        class="max-h-100 max-w-100 rounded-lg object-contain shadow-sm"
      />
    </div>

    <div class="bg-white px-6 py-3 text-center text-md text-zinc-900 font-bold">
      Klik di luar area gambar untuk menutup
    </div>
  </div>
</div>

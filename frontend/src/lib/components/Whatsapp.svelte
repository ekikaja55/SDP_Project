<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  let showTooltip = false;

  const phoneNumber = '6285739761999';
  const message = 'Halo, saya butuh bantuan mengenai layanan Anda.';

  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  onMount(() => {
    const timer = setTimeout(() => {
      showTooltip = true;
    }, 2000);

    return () => clearTimeout(timer);
  });

  function closeTooltip() {
    showTooltip = false;
  }
</script>

<div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">

  {#if showTooltip}
    <div
      transition:fly={{ y: 20, duration: 400 }}
      class="relative max-w-xs origin-bottom-right"
    >
      <button
        on:click|stopPropagation={closeTooltip}
        class="absolute -top-2 -left-2 rounded-full bg-zinc-200 p-1 text-zinc-500 hover:bg-zinc-300 shadow-sm"
        aria-label="Tutup pesan"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>

      <div class="rounded-xl rounded-br-none bg-white p-4 shadow-xl border border-zinc-100 text-zinc-800">
        <p class="font-semibold text-sm mb-1">Halo! 👋</p>
        <p class="text-sm text-zinc-600 leading-relaxed">
          Hubungi Admin jika perlu bantuan atau ada pertanyaan.
        </p>
      </div>
    </div>
  {/if}

  <a
    href={waLink}
    target="_blank"
    rel="noopener noreferrer"
    on:click={closeTooltip}
    on:mouseenter={() => showTooltip = true}
    class="group flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 shadow-lg shadow-zinc-800/30 transition-all duration-300 hover:scale-110 hover:bg-zinc-700 hover:shadow-zinc-800/50 active:scale-95"
    aria-label="Chat via WhatsApp"
  >
    <img
      src="/icons/icon-whatsapp.svg"
      alt="WhatsApp"
      class="w-8 h-8 transition-transform duration-300 group-hover:rotate-12"
    />

    <span class="absolute -top-1 -right-1 flex h-4 w-4">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-zinc-800"></span>
    </span>
  </a>

</div>

<script lang="ts">
  import type { ReviewDTO } from '$lib';
  import { fade, fly, scale } from 'svelte/transition';
  import { Star, X, MessageSquareQuote } from '@lucide/svelte';

  export let visible = false;
  export let productName = '';

  export let onSubmit: (review: ReviewDTO) => void;
  export let onClose: () => void;

  let review: ReviewDTO = {
    produk_nama: '',
    review_rating: 0,
    review_isi: ''
  };

  let hoverRating = 0;

  function handleSubmit() {
    if (review.review_rating === 0) {
      alert('Mohon pilih rating bintang terlebih dahulu');
      return;
    }
    onSubmit?.({ ...review, produk_nama: productName });
    handleClose();
  }

  function handleClose() {
    onClose?.();
    // Reset form delay sedikit agar transisi mulus
    setTimeout(() => {
      review = { produk_nama: '', review_rating: 0, review_isi: '' };
      hoverRating = 0;
    }, 300);
  }

  function setRating(rating: number) {
    review.review_rating = rating;
  }
</script>

{#if visible}
  <div
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 150 }}
    class="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4"
    on:click={handleClose}
  >
    <div
      in:scale={{ start: 0.95, duration: 200 }}
      out:scale={{ start: 0.95, duration: 150 }}
      on:click|stopPropagation
      class="flex flex-col w-full max-w-lg max-h-[90vh] rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200"
    >

      <div class="flex items-center justify-between border-b border-zinc-100 px-6 py-4 shrink-0">
        <div>
          <h3 class="text-lg font-bold text-zinc-900">Tulis Ulasan</h3>
          <p class="text-sm text-zinc-500 line-clamp-1">Produk: <span class="font-medium text-zinc-700">{productName}</span></p>
        </div>
        <button
          on:click={handleClose}
          class="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 custom-scroll">

        <div class="mb-6 flex flex-col items-center justify-center space-y-3 py-4 rounded-xl bg-zinc-50 border border-zinc-100/50">
          <span class="text-sm font-semibold text-zinc-500 uppercase tracking-wide">
            {hoverRating || review.review_rating ? (hoverRating || review.review_rating) + ' dari 5 Bintang' : 'Pilih Rating'}
          </span>

          <div class="flex items-center gap-2">
            {#each Array(5) as _, i}
              {@const starValue = i + 1}
              <button
                type="button"
                class="transition-transform hover:scale-110 focus:outline-none"
                on:mouseenter={() => (hoverRating = starValue)}
                on:mouseleave={() => (hoverRating = 0)}
                on:click={() => setRating(starValue)}
              >
                <Star
                  class={`h-8 w-8 transition-colors duration-200 ${
                    starValue <= (hoverRating || review.review_rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-zinc-200 text-zinc-200'
                  }`}
                />
              </button>
            {/each}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-zinc-700">Pengalaman Anda</label>
          <textarea
            bind:value={review.review_isi}
            class="h-40 w-full resize-none rounded-xl border border-zinc-300 bg-white p-4 text-zinc-800 placeholder-zinc-400 shadow-sm transition focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 sm:text-sm"
            placeholder="Ceritakan detail tentang kualitas produk, pengiriman, atau kepuasan Anda..."
          ></textarea>
          <p class="text-sm font-semibold text-zinc-700 text-right">Minimal 10 karakter agar ulasan lebih membantu.</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 shrink-0 rounded-b-2xl">
        <button
          on:click={handleClose}
          class="rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900"
        >
          Batal
        </button>

        <button
          on:click={handleSubmit}
          disabled={!review.review_rating}
          class="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          Kirim Ulasan
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom Scrollbar untuk Modal Body */
  .custom-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background-color: #d4d4d8;
    border-radius: 20px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #a1a1aa;
  }
</style>

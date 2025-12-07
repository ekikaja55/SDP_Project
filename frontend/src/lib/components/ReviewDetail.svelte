<script lang="ts">
  import type { Review } from '$lib';
  import { fade, scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { X, Star, User, MessageSquareQuote } from '@lucide/svelte';

  export let reviewDetail: Review[] = [];

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  // Helper untuk format tanggal
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Helper untuk inisial nama
  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // Hitung Rata-rata Rating dari array review yang ditampilkan
  $: avgRating = reviewDetail.length
    ? (reviewDetail.reduce((acc, curr) => acc + curr.review_rating, 0) / reviewDetail.length).toFixed(1)
    : 0;
</script>

<div
  class="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 transition-all"
  transition:fade={{ duration: 200 }}
  on:click={close}
>
  <div
    class="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200"
    transition:scale={{ duration: 300, start: 0.95 }}
    on:click|stopPropagation
  >

    <div class="flex items-center justify-between border-b border-zinc-100 bg-white px-6 py-5">
      <div>
        <h2 class="flex items-center gap-2 text-xl font-bold text-zinc-900">
          <MessageSquareQuote class="h-6 w-6 text-indigo-600" />
          Ulasan Pembeli
        </h2>
        <p class="mt-1 text-sm text-zinc-500">
          Total <span class="font-semibold text-zinc-900">{reviewDetail.length}</span> ulasan masuk • Rata-rata <span class="font-semibold text-amber-500">⭐ {avgRating}</span>
        </p>
      </div>
      <button
        on:click={close}
        class="rounded-full bg-zinc-100 p-2 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-900"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto bg-zinc-50/50 p-6">
      {#if reviewDetail && reviewDetail.length > 0}
        <div class="space-y-4">
          {#each reviewDetail as review}
            <div class="flex gap-4 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm transition hover:shadow-md">

              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600 ring-1 ring-indigo-100">
                {getInitials(review.review_nama)}
              </div>

              <div class="flex-1">
                <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <h4 class="font-semibold text-zinc-900">{review.review_nama}</h4>
                  <span class="text-xs text-zinc-400">{formatDate(review.createdAt)}</span>
                </div>

                <div class="mb-3 flex items-center gap-0.5">
                  {#each Array(5) as _, i}
                    <Star
                      class={`h-3.5 w-3.5 ${i < review.review_rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'}`}
                    />
                  {/each}
                </div>

                <p class="text-sm leading-relaxed text-zinc-600">
                  "{review.review_isi}"
                </p>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="flex h-full flex-col items-center justify-center py-10 text-center text-zinc-400">
          <MessageSquareQuote class="mb-3 h-12 w-12 opacity-20" />
          <p>Belum ada ulasan data.</p>
        </div>
      {/if}
    </div>

    <div class="border-t border-zinc-100 bg-white px-6 py-4 text-right">
      <button
        on:click={close}
        class="rounded-xl bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        Tutup
      </button>
    </div>

  </div>
</div>

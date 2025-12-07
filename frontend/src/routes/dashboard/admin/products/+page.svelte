<script lang="ts">
  import {
    addProduk,
    deleteProduk,
    getAllProduk,
    loadingProduk,
    messageHandleProduk,
    produkStore,
    updateProduk,
    type ProdukDTO,
    type Review
  } from '$lib';
  import {
    CheckCircle,
    Filter,
    Search,
    Trash2,
    Eye,
    Plus,
    X,
    Pencil,
    Star,
    ImageIcon,
    MessageSquareText
  } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import NotificationModal from '../../../../lib/components/NotificationModal.svelte';
  import ProductViewerModal from '../../../../lib/components/ProductViewerModal.svelte';
  import ReviewDetail from '../../../../lib/components/ReviewDetail.svelte';
  import { slide } from 'svelte/transition';

  const BASE_URL = import.meta.env.VITE_API_URL_UPLOADS;


  let produk: ProdukDTO = {
    produk_nama: '',
    produk_gambar: undefined,
    produk_stok: 0,
    produk_harga: 0
  };

  let editingId: string | null = null;
  let searchNama = '';
  let filterStok = '';
  let isFormOpen = false;

  let viewingImage: { url: string; name: string } | null = null;
  let viewingReviews: Review[] | null = null;

  onMount(async () => {
    await getAllProduk();
  });

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      produk.produk_gambar = target.files[0];
    }
  }

  async function handleSubmit() {
    if (editingId) {
      await updateProduk({ ...produk, id: editingId });
      editingId = null;
    } else {
      await addProduk(produk);
    }
    resetForm();
  }

  function handleEdit(p: ProdukDTO) {
    produk = { ...p };
    editingId = p.id || null;
    isFormOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (confirm('Yakin hapus produk ini?')) {
      await deleteProduk(id, produk.produk_nama || "");
    }
  }

  async function handleFilter() {
    await getAllProduk(searchNama, filterStok);
  }

  function resetForm() {
    produk = { produk_nama: '', produk_gambar: undefined, produk_stok: 0, produk_harga: 0 };
    editingId = null;
    isFormOpen = false;
  }

  function openImageViewer(url: string, name: string) {
    viewingImage = { url, name };
  }
  function closeImageViewer() {
    viewingImage = null;
  }

  function openReviewModal(reviews: Review[]) {
    viewingReviews = reviews;
  }
  function closeReviewModal() {
    viewingReviews = null;
  }

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };
</script>

<div class="space-y-6 relative min-h-screen pb-20">

  {#if viewingImage}
    <ProductViewerModal
      imageUrl={viewingImage.url}
      productName={viewingImage.name}
      on:close={closeImageViewer}
    />
  {/if}

  {#if viewingReviews}
    <ReviewDetail
      reviewDetail={viewingReviews}
      on:close={closeReviewModal}
    />
  {/if}

  {#if $messageHandleProduk}
    <NotificationModal
      message={$messageHandleProduk.message}
      type={$messageHandleProduk.type}
      onClose={() => messageHandleProduk.set(null)}
    />
  {/if}

  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-zinc-800">Product Management</h1>
      <p class="text-sm text-zinc-500">Kelola katalog produk, stok, dan harga.</p>
    </div>

    <button
      on:click={() => {
        if(isFormOpen) {
           resetForm();
        } else {
           isFormOpen = true;
        }
      }}
      class={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium transition-all shadow-sm ${isFormOpen ? 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
    >
      {#if isFormOpen}
        <X class="h-4 w-4" /> Tutup Form
      {:else}
        <Plus class="h-4 w-4" /> Tambah Produk      {/if}
    </button>
  </div>

  {#if isFormOpen}
    <div transition:slide class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg ring-1 ring-zinc-100">
      <div class="mb-6 border-b border-zinc-100 pb-4">
        <h2 class="flex items-center gap-2 text-lg font-bold text-zinc-800">
          {#if editingId}
             <div class="rounded-full bg-amber-100 p-2 text-amber-600"><Pencil class="h-4 w-4"/></div> Edit Produk
          {:else}
             <div class="rounded-full bg-emerald-100 p-2 text-emerald-600"><Plus class="h-4 w-4"/></div> Tambah Produk Baru
          {/if}
        </h2>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div class="space-y-2 col-span-2">
            <label class="text-xs font-bold uppercase tracking-wide text-zinc-500">Nama Produk</label>
            <input
              type="text"
              bind:value={produk.produk_nama}
              placeholder="Contoh: Kemeja Flannel Premium"
              class="w-full rounded-xl border-zinc-300 bg-zinc-50 p-3 text-sm font-medium focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 placeholder:font-normal"
              required
            />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wide text-zinc-500">Harga (Rp)</label>
            <input
              type="number"
              bind:value={produk.produk_harga}
              placeholder="0"
              min="0"
              class="w-full rounded-xl border-zinc-300 bg-zinc-50 p-3 text-sm font-medium focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              required
            />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wide text-zinc-500">Stok Awal</label>
            <input
              type="number"
              bind:value={produk.produk_stok}
              placeholder="0"
              min="0"
              class="w-full rounded-xl border-zinc-300 bg-zinc-50 p-3 text-sm font-medium focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              required
            />
          </div>
           <div class="space-y-2 col-span-2 md:col-span-4">
            <label class="text-xs font-bold uppercase tracking-wide text-zinc-500">Gambar Produk</label>
            <div class="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 transition hover:bg-zinc-100">
               <input
                type="file"
                accept="image/*"
                on:change={handleFileChange}
                class="w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-700 cursor-pointer"
              />
              <p class="mt-2 text-xs text-zinc-400">*Format JPG/PNG. Biarkan kosong jika tidak ingin mengubah gambar saat edit.</p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            on:click={resetForm}
            class="rounded-xl px-6 py-2.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            class="flex items-center gap-2 rounded-xl bg-zinc-900 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
            disabled={$loadingProduk}
          >
            {#if $loadingProduk}
              <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {/if}
            {editingId ? 'Simpan Perubahan' : 'Terbitkan Produk'}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
    <div class="relative w-full md:max-w-md">
      <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
      <input
        type="text"
        bind:value={searchNama}
        placeholder="Cari berdasarkan nama produk..."
        class="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm transition focus:border-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-800"
      />
    </div>

    <div class="flex items-center gap-3 w-full md:w-auto">
      <div class="relative w-full md:w-48">
         <select
          bind:value={filterStok}
          class="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-4 pr-10 text-sm transition focus:border-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-800"
        >
          <option value="">Semua Stok</option>
          <option value="ada">Tersedia</option>
          <option value="habis">Habis</option>
        </select>
        <Filter class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      </div>

      <button
        on:click={handleFilter}
        class="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 transition"
      >
        Terapkan
      </button>
    </div>
  </div>

  <div class="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
    {#if $loadingProduk && !$produkStore}
      <div class="flex justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-transparent"></div>
      </div>
    {:else if !$produkStore || $produkStore.length === 0}
      <div class="flex flex-col items-center justify-center py-24 text-center">
        <div class="rounded-full bg-zinc-100 p-6 mb-4">
            <Search class="h-10 w-10 text-zinc-300"/>
        </div>
        <h3 class="text-lg font-semibold text-zinc-900">Tidak ada produk ditemukan</h3>
        <p class="text-zinc-500 max-w-xs mx-auto mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
        <button on:click={() => {searchNama = ''; filterStok = ''; handleFilter()}} class="mt-4 text-sm font-medium text-emerald-600 hover:underline">
          Reset Filter
        </button>
      </div>
    {:else}
      <div class="max-h-[70vh] overflow-y-auto overflow-x-auto custom-scroll relative">
        <table class="w-full text-left text-sm">
          <thead class="sticky top-0 z-10 bg-zinc-50 border-b border-zinc-200 text-zinc-600 shadow-sm">
            <tr>
              <th class="px-6 py-4 font-semibold w-24 whitespace-nowrap">Gambar</th>
              <th class="px-6 py-4 font-semibold min-w-[200px] whitespace-nowrap">Detail Produk</th>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">Harga Satuan</th>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">Stok</th>
              <th class="px-6 py-4 font-semibold whitespace-nowrap">Terakhir Update</th>
              <th class="px-6 py-4 font-semibold text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            {#each $produkStore as p}
              <tr class="group transition duration-200 hover:bg-zinc-50">

                <td class="px-6 py-5 align-middle">
                    {#if p.produk_gambar}
                    <div
                        class="relative h-16 w-16 shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
                        on:click={() => openImageViewer(`${BASE_URL}/uploads/${p.produk_gambar}`, p.produk_nama)}
                    >
                        <img
                            src={`${BASE_URL}/uploads/${p.produk_gambar}`}
                            alt={p.produk_nama}
                            class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                    </div>
                    {:else}
                    <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
                        <ImageIcon class="h-6 w-6"/>
                    </div>
                    {/if}
                </td>

                <td class="px-6 py-5 align-middle">
                  <div class="text-base font-bold text-zinc-900 whitespace-nowrap">{p.produk_nama}</div>

                  <div class="flex items-center gap-2 mt-1.5">
                     <div class="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        <Star class="h-3 w-3 fill-current"/>
                        {(p.produk_avg_rating || 0).toFixed(1)}
                     </div>
                     {#if p.deletedAt}
                        <span class="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600 whitespace-nowrap">
                          Produk Dihapus
                        </span>
                     {/if}
                  </div>
                </td>

                <td class="px-6 py-5 align-middle">
                  <div class="font-bold text-zinc-800 font-mono text-base whitespace-nowrap">
                    {formatRupiah(p.produk_harga)}
                  </div>
                </td>

                <td class="px-6 py-5 align-middle">
                   {#if p.produk_stok > 10}
                     <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 whitespace-nowrap">
                       <span class="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                       {p.produk_stok} Pcs
                     </span>
                   {:else if p.produk_stok > 0}
                     <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 whitespace-nowrap">
                       <span class="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                       Sisa {p.produk_stok}
                     </span>
                   {:else}
                     <span class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20 whitespace-nowrap">
                        Habis
                     </span>
                   {/if}
                </td>

                <td class="px-6 py-5 align-middle text-zinc-500 text-sm whitespace-nowrap">
                  {new Date(p.updatedAt || p.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </td>

                <td class="px-6 py-5 align-middle text-right whitespace-nowrap">
                  {#if !p.deletedAt}
                    <div class="flex items-center justify-end gap-2">

                      {#if p.produk_review && p.produk_review.length > 0}
                        <button
                          on:click={() => openReviewModal(p.produk_review)}
                          class="rounded-lg border border-zinc-200 bg-white p-2 text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition shadow-sm"
                          title={`Lihat ${p.produk_review.length} Review`}
                        >
                          <MessageSquareText class="h-4 w-4"/>
                        </button>
                      {/if}

                      {#if p.produk_gambar}
                        <button
                          on:click={() => openImageViewer(`${BASE_URL}/uploads/${p.produk_gambar}`, p.produk_nama)}
                          class="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-sm"
                          title="Lihat Gambar"
                        >
                          <Eye class="h-4 w-4"/>
                        </button>
                      {/if}

                      <button
                        on:click={() => handleEdit(p)}
                        class="rounded-lg border border-zinc-200 bg-white p-2 text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition shadow-sm"
                        title="Edit Produk"
                      >
                        <Pencil class="h-4 w-4"/>
                      </button>

                      <button
                        on:click={() => handleDelete(p.id!)}
                        class="rounded-lg border border-zinc-200 bg-white p-2 text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-sm"
                        title="Hapus Produk"
                      >
                        <Trash2 class="h-4 w-4"/>
                      </button>
                    </div>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Custom Scrollbar */
  .custom-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
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

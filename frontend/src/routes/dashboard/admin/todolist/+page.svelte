<script lang="ts">
  import {
    addTodo,
    deleteTodo,
    getAllTodo,
    loadingGlobal,
    loadingTodo,
    messageHandleTodo,
    todoListStore,
    updateTodo,
    updateTodoStatus,
    type TodoListDTO
  } from '$lib';
  import NotificationModal from '$lib/components/NotificationModal.svelte';
  import { onMount } from 'svelte';
  import {
    CheckCircle2,
    Circle,
    Clock,
    Filter,
    Pencil,
    Plus,
    Trash2,
    X
  } from '@lucide/svelte';
  import { fade, slide } from 'svelte/transition';

  let isEditMode = false;
  let filterStatus = '';
  let showForm = false;

  const dataTodolist: TodoListDTO = {
    id: '',
    todolist_desc: '',
    todolist_status: ''
  };

  onMount(async () => {
    await getAllTodo();
  });

  function clearForm() {
    dataTodolist.id = '';
    dataTodolist.todolist_desc = '';
    dataTodolist.todolist_status = '';
    isEditMode = false;
    showForm = false;
  }

  async function handleSubmit() {
    if (isEditMode) await updateTodo(dataTodolist);
    else await addTodo(dataTodolist);

    if(isEditMode) {
        clearForm();
    } else {
        dataTodolist.todolist_desc = '';
    }
  }

  function handleEdit(todo: TodoListDTO) {
    isEditMode = true;
    showForm = true;
    dataTodolist.id = todo.id;
    dataTodolist.todolist_desc = todo.todolist_desc;
    dataTodolist.todolist_status = todo.todolist_status;
    // Scroll ke form input jika sedang edit
    const formElement = document.getElementById('todo-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleStatusUpdate(todo: TodoListDTO) {
    await updateTodoStatus(todo);
  }

  async function handleFilter() {
    await getAllTodo(filterStatus);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'border-emerald-500 bg-emerald-50 text-emerald-700';
      case 'Sedang Dikerjakan': return 'border-blue-500 bg-blue-50 text-blue-700';
      default: return 'border-zinc-300 bg-zinc-50 text-zinc-600';
    }
  };
</script>

<div class="space-y-6 min-h-screen text-zinc-800">

  {#if $messageHandleTodo}
    <NotificationModal
      message={$messageHandleTodo.message}
      type={$messageHandleTodo.type}
      onClose={() => messageHandleTodo.set(null)}
    />
  {/if}

  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4" id="todo-form">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-zinc-800">Daily Task Management</h1>
      <p class="text-sm text-zinc-500">Kelola daftar pekerjaan dan progres harian.</p>
    </div>

    <button
      on:click={() => showForm = !showForm}
      class={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium transition-all shadow-sm ${showForm ? 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
    >
      {#if showForm}
        <X class="h-4 w-4" /> Tutup Form
      {:else}
        <Plus class="h-4 w-4" /> Tambah Task Baru
      {/if}
    </button>
  </div>

  {#if showForm}
    <div transition:slide class="mx-auto w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg ring-1 ring-zinc-100 mb-6">
        <h2 class="mb-4 text-lg font-bold text-zinc-800 flex items-center gap-2">
            {#if isEditMode}
                <Pencil class="h-5 w-5 text-amber-500"/> Edit Task
            {:else}
                <Plus class="h-5 w-5 text-zinc-800"/> Buat Task Baru
            {/if}
        </h2>

        <form on:submit|preventDefault={handleSubmit}>
            <div class="mb-4">
            <textarea
                bind:value={dataTodolist.todolist_desc}
                rows="3"
                placeholder="Apa yang perlu diselesaikan?"
                class="w-full rounded-xl border-zinc-300 bg-zinc-50 p-4 text-zinc-800 placeholder-zinc-400 focus:border-zinc-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-800 transition"
                required
            ></textarea>
            </div>

            <div class="flex items-center justify-end gap-3">
             {#if isEditMode}
                <button
                    type="button"
                    class="rounded-xl px-5 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 transition"
                    on:click={clearForm}
                >
                    Batal
                </button>
             {/if}

            <button
                type="submit"
                disabled={$loadingTodo}
                class="flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2 font-bold text-zinc-50 shadow-md transition hover:bg-zinc-800 hover:shadow-lg disabled:opacity-70"
            >
                {#if $loadingTodo}
                    <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Memproses...
                {:else}
                    {isEditMode ? 'Simpan Perubahan' : 'Simpan Task'}
                {/if}
            </button>
            </div>
        </form>
    </div>
  {/if}

  <div class="max-h-[70vh] overflow-y-auto custom-scroll pr-2 relative rounded-2xl border border-zinc-200 bg-zinc-50/50 shadow-inner">

      <div class="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md px-4 py-3 mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
              <Filter class="h-4 w-4 text-zinc-500" />
              <span class="text-sm font-bold text-zinc-700">Filter</span>
          </div>
          <select
            bind:value={filterStatus}
            on:change={handleFilter}
            class="rounded-lg border-zinc-200 bg-zinc-50 py-1.5 pl-3 pr-8 text-sm font-medium text-zinc-700 focus:ring-zinc-800 cursor-pointer hover:bg-zinc-100 transition"
          >
            <option value="">Semua Task</option>
            <option value="Belum Dikerjakan">Belum Dikerjakan</option>
            <option value="Sedang Dikerjakan">On Progress</option>
            <option value="Selesai">Selesai</option>
          </select>
      </div>

      <div class="px-4 pb-6">
        {#if $loadingGlobal}
          <div class="flex flex-col items-center justify-center py-20 text-zinc-500">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-transparent mb-4"></div>
            <p>Sinkronisasi data...</p>
          </div>
        {:else if ($todoListStore ?? []).length > 0}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" transition:fade>
            {#each $todoListStore ?? [] as todo (todo.id)}
              <div
                class={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${todo.todolist_status === 'Selesai' ? 'opacity-75 hover:opacity-100' : ''}`}
              >
                <div class={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${
                    todo.todolist_status === 'Selesai' ? 'bg-emerald-500' :
                    todo.todolist_status === 'Sedang Dikerjakan' ? 'bg-blue-500' : 'bg-zinc-300'
                }`}></div>

                <div>
                    <div class="flex items-start justify-between mb-3 pt-2">
                        <span class={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${getStatusColor(todo.todolist_status)}`}>
                            {#if todo.todolist_status === 'Selesai'}
                                <CheckCircle2 class="h-3 w-3"/>
                            {:else if todo.todolist_status === 'Sedang Dikerjakan'}
                                <Clock class="h-3 w-3 animate-pulse"/>
                            {:else}
                                <Circle class="h-3 w-3"/>
                            {/if}
                            {todo.todolist_status}
                        </span>

                        <span class="text-[10px] text-zinc-400 font-medium">
                            {new Date(todo.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                        </span>
                    </div>

                    <p class={`mb-6 text-sm leading-relaxed ${todo.todolist_status === 'Selesai' ? 'text-zinc-500 line-through' : 'text-zinc-800'}`}>
                        {todo.todolist_desc}
                    </p>
                </div>

                {#if todo.todolist_status !== 'Selesai'}
                    <div class="flex items-center gap-2 border-t border-zinc-100 pt-4 mt-auto">
                        <button
                            class="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 py-2 text-xs font-bold text-white transition hover:bg-zinc-700"
                            on:click={() => handleStatusUpdate(todo)}
                            title="Update Status ke tahap selanjutnya"
                        >
                            {#if todo.todolist_status === 'Belum Dikerjakan'}
                                Mulai Kerjakan
                            {:else}
                                Tandai Selesai
                            {/if}
                        </button>

                        <button
                            class="flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                            on:click={() => handleEdit(todo)}
                            title="Edit Deskripsi"
                        >
                            <Pencil class="h-4 w-4" />
                        </button>

                        <button
                            class="flex items-center justify-center rounded-lg border border-red-100 bg-red-50 p-2 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                            on:click={() => deleteTodo(todo.id)}
                            title="Hapus Task"
                        >
                            <Trash2 class="h-4 w-4" />
                        </button>
                    </div>
                {:else}
                     <div class="flex items-center justify-between border-t border-zinc-100 pt-4 mt-auto">
                        <span class="text-xs font-medium text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 class="h-4 w-4"/> Selesai
                        </span>
                        <button
                            class="text-xs text-red-400 hover:text-red-600 underline decoration-dotted"
                            on:click={() => deleteTodo(todo.id)}
                        >
                            Hapus History
                        </button>
                     </div>
                {/if}
              </div>
            {/each}
          </div>
        {:else}
          <div class="flex min-h-[30vh] flex-col items-center justify-center text-center">
            <div class="mb-4 rounded-full bg-zinc-200 p-6">
                <CheckCircle2 class="h-10 w-10 text-zinc-400"/>
            </div>
            <h3 class="text-lg font-bold text-zinc-800">Belum ada tugas</h3>
            <p class="mt-1 text-sm text-zinc-500 max-w-xs">Tambahkan rencana pekerjaanmu hari ini agar lebih produktif.</p>
            <button
                on:click={() => showForm = true}
                class="mt-6 text-sm font-bold text-indigo-600 hover:underline"
            >
                Buat Task Baru Sekarang
            </button>
          </div>
        {/if}
      </div>
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

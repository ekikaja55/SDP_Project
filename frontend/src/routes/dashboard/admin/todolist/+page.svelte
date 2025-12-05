<!-- src/routes/dashboard/admin/todolist/+page.svelte -->
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
	// Ikon lucide
	import { CheckSquare, Filter, Pencil, PlusCircle, Trash2 } from '@lucide/svelte';

	let isEditMode = false;
	let filterStatus = '';

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
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function handleSubmit() {
		if (isEditMode) await updateTodo(dataTodolist);
		else await addTodo(dataTodolist);
		clearForm();
	}

	function handleEdit(todo: TodoListDTO) {
		isEditMode = true;
		dataTodolist.id = todo.id;
		dataTodolist.todolist_desc = todo.todolist_desc;
		dataTodolist.todolist_status = todo.todolist_status;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function handleStatusUpdate(todo: TodoListDTO) {
		await updateTodoStatus(todo);
	}

	async function handleFilter() {
		await getAllTodo(filterStatus);
	}
</script>

<div class="space-y-10 text-zinc-800">
	<!-- Header -->
	<div class="flex items-center gap-3">
		<h1 class="text-3xl font-bold tracking-tight text-zinc-800">Manage Todo List</h1>
	</div>

	<!-- FORM -->
	<form
		on:submit|preventDefault={handleSubmit}
		class="mx-auto w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm transition hover:shadow-md"
	>
		<div class="mb-6">
			<label class="mb-2 block text-sm font-semibold text-zinc-600">Deskripsi Todolist</label>
			<textarea
				bind:value={dataTodolist.todolist_desc}
				placeholder="Masukkan rencana todolist kamu..."
				class="w-full rounded-lg border border-zinc-300 bg-white p-3 text-zinc-800 placeholder-zinc-400 transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
				required
			></textarea>
		</div>

		<button
			type="submit"
			disabled={$loadingTodo}
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 py-2 font-semibold text-zinc-50 shadow-sm transition hover:bg-zinc-700 disabled:opacity-50"
		>
			{#if $loadingTodo}
				<span>Memproses...</span>
			{:else if isEditMode}
				<Pencil class="h-4 w-4" /> Update Todolist
			{:else}
				<PlusCircle class="h-4 w-4" /> Tambah Todolist
			{/if}
		</button>

		{#if isEditMode}
			<button
				type="button"
				class="mt-3 w-full rounded-lg bg-zinc-200 py-2 font-semibold text-zinc-700 transition hover:bg-zinc-300"
				on:click={clearForm}
			>
				Batal Edit
			</button>
		{/if}

		{#if $messageHandleTodo}
			<NotificationModal
				message={$messageHandleTodo.message}
				type={$messageHandleTodo.type}
				onClose={() => messageHandleTodo.set(null)}
			/>
		{/if}
	</form>

	<!-- FILTER -->
	<div class="flex items-center gap-3">
		<Filter class="h-5 w-5 text-zinc-500" />
		<select
			bind:value={filterStatus}
			on:change={handleFilter}
			class="rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-zinc-700 transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300"
		>
			<option value="">Semua</option>
			<option value="Selesai">Selesai</option>
			<option value="Belum Dikerjakan">Belum Dikerjakan</option>
			<option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
		</select>
	</div>

	<!-- LIST -->
	<div>
		{#if $loadingGlobal}
			<div class="flex items-center justify-center py-10 text-zinc-600">
				<div
					class="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-transparent"
				></div>
				<p class="ml-3">Memuat data todolist...</p>
			</div>
		{:else if ($todoListStore ?? []).length > 0}
			<h2 class="mb-4 text-xl font-semibold text-zinc-700">Daftar Todolist</h2>
			<ul class="space-y-3">
				{#each $todoListStore ?? [] as todo}
					<li
						class="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
					>
						<div>
							<p class="text-xs text-zinc-400">{new Date(todo.createdAt).toLocaleString()}</p>
							<p class="text-base font-medium text-zinc-800">{todo.todolist_desc}</p>
							<p
								class={`text-sm font-medium ${
									todo.todolist_status === 'Selesai'
										? 'text-green-600'
										: todo.todolist_status === 'Sedang Dikerjakan'
											? 'text-blue-600'
											: 'text-red-600'
								}`}
							>
								Status: {todo.todolist_status}
							</p>
						</div>

						<div class="flex flex-wrap gap-2">
							{#if todo.todolist_status !== 'Selesai'}
								<button
									class="flex items-center gap-1 rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
									on:click={() => handleEdit(todo)}
								>
									<Pencil class="h-4 w-4" /> Edit
								</button>
								<button
									class="flex items-center gap-1 rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200"
									on:click={() => handleStatusUpdate(todo)}
								>
									<CheckSquare class="h-4 w-4" /> Update Status
								</button>
								<button
									class="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-200"
									on:click={() => deleteTodo(todo.id)}
								>
									<Trash2 class="h-4 w-4" /> Delete
								</button>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="mt-10 text-center text-zinc-500">
				<p class="text-lg font-semibold">Belum ada todolist yang kamu buat.</p>
				<p class="mt-1 text-sm text-zinc-400">Yuk tambahkan rencana harian pertamamu!</p>
			</div>
		{/if}
	</div>
</div>

<!-- src/routes/dashboard/admin/todolist/+page.svelte -->
<!-- page handling master todo -->
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
	import { onMount } from 'svelte';
	let isEditMode: boolean = false;

	const dataTodolist: TodoListDTO = {
		id: '',
		todolist_desc: '',
		todolist_status: ''
	};
	let filterStatus: string = '';

	onMount(async () => {
		await getAllTodo();
		console.log('============ data todolist ============', $todoListStore);
	});

	function clearForm() {
		dataTodolist.id = '';
		dataTodolist.todolist_desc = '';
		dataTodolist.todolist_status = '';
		isEditMode = false;
	}

	async function handleSubmit() {
		if (isEditMode) {
			await updateTodo(dataTodolist);
		} else {
			await addTodo(dataTodolist);
		}
		clearForm();
	}

	function handleEdit(todo: TodoListDTO) {
		isEditMode = true;
		dataTodolist.id = todo.id;
		dataTodolist.todolist_desc = todo.todolist_desc;
		dataTodolist.todolist_status = todo.todolist_status;
	}

	async function handleStatusUpdate(todo: TodoListDTO) {
		await updateTodoStatus(todo);
	}

  async function handleFilter() {
		await getAllTodo(filterStatus);
	}
</script>

<div class="p-4">
	<h1 class="mb-4 text-xl font-bold">Halaman MANAGE TODOLIST</h1>

	<form
		on:submit|preventDefault={handleSubmit}
		class="mx-auto mt-5 w-full rounded-lg bg-white p-8 shadow-md"
	>
		<div class="mb-4">
			<label class="mb-2 block text-sm font-medium text-gray-700">Deskripsi Todolist</label>
			<input
				type="text"
				bind:value={dataTodolist.todolist_desc}
				placeholder="Masukkan Rencana Todolist Kamu"
				class="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				required
			/>
		</div>

		<button
			type="submit"
			disabled={$loadingTodo}
			class="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
		>
			{#if $loadingTodo}
				<span>Memproses...</span>
			{:else}
				<span>{isEditMode ? 'Update Todolist' : 'Tambah Todolist'}</span>
			{/if}
		</button>

		{#if isEditMode}
			<button
				type="button"
				class="mt-3 w-full rounded-md bg-gray-400 py-2 font-semibold text-white transition hover:bg-gray-500"
				on:click={clearForm}
			>
				Batal Edit
			</button>
		{/if}

		{#if $messageHandleTodo}
			<p
				class="mt-4 text-center text-sm font-medium
				{$messageHandleTodo.type === 'error' ? 'text-red-600' : 'text-green-600'}"
			>
				{$messageHandleTodo.message}
			</p>
		{/if}
	</form>

	<!-- List Todo -->
	<div class="mb-4 mt-10 flex items-center gap-3">
		<select
			bind:value={filterStatus}
			on:change={handleFilter}
			class="rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
		>
			<option value="">Semua</option>
			<option value="Selesai">Selesai</option>
			<option value="Belum Dikerjakan">Belum Dikerjakan</option>
		</select>


	</div>

	<div class="mt-8">
		{#if $loadingGlobal}
			<div class="flex items-center justify-center py-6">
				<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
				<p class="ml-3 text-gray-600">Memuat data todolist...</p>
			</div>
		{:else if ($todoListStore ?? []).length > 0}
			<h2 class="mb-3 text-lg font-semibold">Daftar Todolist:</h2>
			<ul class="space-y-2">
				{#each $todoListStore ?? [] as todo}
					<li
						class="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition hover:shadow-sm"
					>
						<div>
              <p class="font-sm text-sm text-gray-500">{new Date(todo.createdAt).toLocaleString()}</p>
							<p class="font-medium text-gray-800">{todo.todolist_desc}</p>
							{#if todo.todolist_status !== 'Selesai'}
								<p class="text-sm text-yellow-600">
									Status: {todo.todolist_status}
								</p>
							{/if}
						</div>
						<div class="flex gap-2">
							{#if todo.todolist_status === 'Selesai'}
								<p
									class="text-md font-bold
								{todo.todolist_status === 'Selesai' ? 'text-green-600' : 'text-yellow-600'}"
								>
									Status: {todo.todolist_status}
								</p>
							{:else}
								<button
									class="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
									on:click={() => handleEdit(todo)}
								>
									Edit
								</button>
								<button
									class="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
									on:click={() => handleStatusUpdate(todo)}
								>
									Update Status
								</button>
								<button
									class="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
									on:click={() => deleteTodo(todo.id)}
								>
									Delete
								</button>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="mt-8 text-center text-gray-500">
				<p class="text-lg font-medium">Belum ada todolist yang kamu buat.</p>
				<p class="mt-1 text-sm text-gray-400">Yuk tambahkan rencana harian pertamamu!</p>
			</div>
		{/if}
	</div>
</div>

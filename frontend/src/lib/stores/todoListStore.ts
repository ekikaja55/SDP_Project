// src/lib/stores/todoListStore.ts
// ini handling  function dan reactive state untuk crud todolist

import {
	api,
	errorHandler,
	loadingGlobal,
	messageHandleGlobal,
	type ApiResponse,
	type MessageState,
	type Todolist,
	type TodoListDTO
} from '$lib';
import { writable } from 'svelte/store';

export const todoListStore = writable<Todolist[] | null>(null);
export const todoListSingleStore = writable<Todolist | null>(null);
export const loadingTodo = writable(false);
export const messageHandleTodo = writable<MessageState | null>(null);

// handling get all todo
export async function getAllTodo(status?: string) {
	console.log('status Get all todo , isi status:' + status);

	loadingGlobal.set(true);
	messageHandleGlobal.set(null);
	try {
		const url = status ? `/todolist?status=${encodeURIComponent(status)}` : '/todolist';
		const res = await api.get<ApiResponse<Todolist[]>>(url);
		todoListStore.set(res.data.result);
		messageHandleGlobal.set({
			type: 'success',
			message: res.data.message
		});
	} catch (err) {
		messageHandleGlobal.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loadingGlobal.set(false);
	}
}
// handling add todo
export async function addTodo(data: TodoListDTO) {
	loadingTodo.set(true);
	messageHandleTodo.set(null);
	try {
		const res = await api.post<ApiResponse<TodoListDTO>>('/todolist', data);
		messageHandleTodo.set({
			type: 'success',
			message: res.data.message
		});
		await getAllTodo();
	} catch (err) {
		messageHandleTodo.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loadingTodo.set(false);
	}
}

// handling update todo
export async function updateTodo(data: TodoListDTO) {
	loadingTodo.set(true);
	messageHandleTodo.set(null);
	try {
		const res = await api.put<ApiResponse<TodoListDTO>>(`/todolist/${data.id}`, { ...data });
		messageHandleTodo.set({
			type: 'success',
			message: res.data.message
		});
		await getAllTodo();
	} catch (err) {
		messageHandleTodo.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loadingTodo.set(false);
	}
}

// handling update status todo
export async function updateTodoStatus(data: TodoListDTO) {
	console.log('isi data todolist update status : \n', JSON.stringify(data, null, 2));
	loadingTodo.set(true);
	messageHandleTodo.set(null);
	try {
		const res = await api.put<ApiResponse<TodoListDTO>>(`/todolist/status/${data.id}`, { data });
		messageHandleTodo.set({
			type: 'success',
			message: res.data.message
		});
		await getAllTodo();
	} catch (err) {
		messageHandleTodo.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loadingTodo.set(false);
	}
}
// handling delete todo
export async function deleteTodo(id: string) {
	loadingTodo.set(true);
	messageHandleTodo.set(null);
	try {
		console.log('masuk try update todo, id :', id);

		const res = await api.delete<ApiResponse<string>>(`/todolist/${id}`);
		messageHandleTodo.set({
			type: 'success',
			message: res.data.message
		});
		await getAllTodo();
	} catch (err) {
		messageHandleTodo.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loadingTodo.set(false);
	}
}

// handling refetching setelah insert update delete
async function refetchTodo() {
	try {
		const res = await api.get<ApiResponse<Todolist[]>>('/todolist');
		todoListStore.set(res.data.result);
	} catch (err) {
		console.error(err);
	}
}

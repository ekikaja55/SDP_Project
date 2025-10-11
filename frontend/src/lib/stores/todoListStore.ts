// src/lib/stores/todoListStore.ts
// ini handling  function dan reactive state untuk crud todolist

import {
	api,
	errorHandler,
	type ApiResponse,
	type MessageState,
	type Todolist,
	type TodoListCreateDTO,
	type TodolistUpdateDTO
} from '$lib';
import { writable } from 'svelte/store';

export const todoListStore = writable<Todolist[] | null>(null);
export const todoListSingleStore = writable<Todolist | null>(null);
export const loading = writable<boolean>(false);
export const messageHandle = writable<MessageState | null>(null);

// handling get all todo
export async function getAllTodo() {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.get<ApiResponse<Todolist[]>>('/todolist');
		todoListStore.set(res.data.result);
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
	} catch (err) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
}

// handling get one todo by id
export async function getTodoById(id: string) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.get<ApiResponse<Todolist>>(`/todolist/${id}`);
		todoListSingleStore.set(res.data.result);
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
	} catch (err) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
}

// handling add todo
export async function addTodo(data: TodoListCreateDTO) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.post<ApiResponse<TodoListCreateDTO>>('/todolist', data);
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
		await refetchTodo();
	} catch (err) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
}

// handling update todo
export async function updateTodo(id: string, data: TodolistUpdateDTO) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.put<ApiResponse<TodolistUpdateDTO>>(`/todolist/${id}`, { data });
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
		await refetchTodo();
	} catch (err) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
	}
}

// handling delete todo
export async function deleteTodo(id: string) {
	loading.set(true);
	messageHandle.set(null);
	try {
		const res = await api.delete<ApiResponse<Todolist>>(`/produk/${id}`);
		messageHandle.set({
			type: 'success',
			message: res.data.message
		});
		await refetchTodo();
	} catch (err) {
		messageHandle.set({
			type: 'error',
			message: errorHandler(err)
		});
	} finally {
		loading.set(false);
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

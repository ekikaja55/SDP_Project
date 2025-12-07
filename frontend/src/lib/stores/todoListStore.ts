/**
 * src/lib/stores/todoListStore.ts
 *
 * ini handling  function dan reactive state untuk crud todolist
 */

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
import { writable, type Writable } from 'svelte/store';

export const todoListStore: Writable<Todolist[] | null> = writable<Todolist[] | null>(null);
export const loadingTodo:Writable<boolean> = writable(false);
export const messageHandleTodo: Writable<MessageState | null> = writable<MessageState | null>(null);

export async function getAllTodo(status?: string) {

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

export async function updateTodoStatus(data: TodoListDTO) {
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
export async function deleteTodo(id: string) {
	loadingTodo.set(true);
	messageHandleTodo.set(null);
	try {

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

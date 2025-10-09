// src/lib/types/todolist.ts
// setup type  todolist handling

export interface Todolist {
	id: number;
	todolist_desc: string;
	todolist_status: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

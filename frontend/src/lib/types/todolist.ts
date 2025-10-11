// src/lib/types/todolist.ts
// setup type  todolist handling

// type untuk todolist
export interface Todolist {
	id: number;
	todolist_desc: string;
	todolist_status: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}

/**
 *interface khusus untuk tambah produk
 *DTO itu Data Transfer Object
 *definisi DTO adalah struktur data ringan yang dirancang untuk mentransfer informasi antar proses *atau layer, tanpa menyertakan logika bisnis atau properti yang tidak relevan biasanya untuk *penamaan type CRUD, karena itu aku kasi penamaanya ada penambahan DTO misalnya nanti mau ganti nama *juga gpp
 */
export interface TodoListCreateDTO {
	todolist_desc: string;
	todolist_status: string;
}

// optional: interface untuk update kenapa partial? biar semua fieldnya bisa opsional
export interface TodolistUpdateDTO extends Partial<TodoListCreateDTO> {}

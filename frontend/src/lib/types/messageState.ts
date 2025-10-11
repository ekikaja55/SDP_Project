// src/lib/types/messageState.ts
export interface MessageState {
	type: 'success' | 'error' | 'info';
	message: string;
}

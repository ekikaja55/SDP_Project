// src/lib/stores/loadingHandlingStore.ts
// handling store reactive loading & message global

import { writable } from 'svelte/store';
import type { MessageState } from '../types';

export const loadingGlobal = writable(false);
export const messageHandleGlobal = writable<MessageState | null>(null);

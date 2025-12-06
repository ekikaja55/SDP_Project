//type untuk log
import type { Produk, Todolist, Transaksi } from '$lib';

type LogTypeMap = {
	TODOLIST: Todolist;
	PRODUCT: Produk;
	TRANSACTION: Transaksi;
};

export type LogDetail<T> = {
	before: T | null;
	after: T | null;
};

export type Log<K extends keyof LogTypeMap> = {
	id: string;
	log_actor: string;
	log_type: K;
	log_action: 'INSERT' | 'UPDATE' | 'DELETE';
	log_title: string;
	log_desc: LogDetail<LogTypeMap[K]>;
	createdAt: string;
};

export type AnyLog = Log<'TODOLIST'> | Log<'PRODUCT'> | Log<'TRANSACTION'>;

export interface LogFilter {
	actor?: string;
	type?: string;
	action?: string;
	search?: string;
	startDate?: string;
	endDate?: string;
}

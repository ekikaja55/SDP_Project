// src/lib/types/user.ts

import type { Transaksi } from './transaksi';

export interface User {
	id: string;
	user_nama: string;
	user_email: string;
	user_role: string;
	user_transaksi?: Transaksi[];
	createdAt: string;
	updatedAt: string;
}

export type UserAuth = Omit<User, 'user_password' | 'createdAt' | 'updatedAt'>;

export interface LoginDTO {
	user_email: string;
	user_password: string;
}

export interface RegisterDTO {
	user_nama: string;
	user_email: string;
	user_password: string;
	user_confirm_password: string;
}

export interface Customer {
	id: string;
	user_nama: string;
	user_email: string;
	user_role: string;
	createdAt: string;
	total_transaksi: number;
}

export interface QueryCustomer {
	search: string;
	sort: string;
}

export interface CustomerProfile {
	id: string;
	nama: string;
	email: string;
	role: string;
	joinDate: string;
	lastActive: string | null;
}

export interface CustomerStats {
	lifetimeValue: string;
	totalOrders: number;
	averageOrderValue: string;
	customerTier: 'VIP' | 'Loyal' | 'New' | string;
}

export interface SpendingTrendItem {
	label: string;
	value: string;
}

export interface TopProductItem {
	productName: string;
	qty: number;
}

export interface OrderStatusItem {
	status: string;
	count: number;
}

export interface CustomerCharts {
	spendingTrend: SpendingTrendItem[];
	topProducts: TopProductItem[];
	orderStatusDistribution: OrderStatusItem[];
}

export interface CustomerTransactionHistory {
	id: string;
	date: string;
	status: string;
	total: string;
	itemsCount: number;
}

export interface CustomerDetailData {
	profile: CustomerProfile;
	stats: CustomerStats;
	charts: CustomerCharts;
	transactionHistory: CustomerTransactionHistory[];
}

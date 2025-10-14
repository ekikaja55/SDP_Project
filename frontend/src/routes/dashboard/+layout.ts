// src/routes/dashboard/+layout.svelte
// handling middleware kalo user akses "/dashboard/..."
import { checkAuth, userStore } from '$lib';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';

export async function load() {
	await checkAuth();
	const user = get(userStore);

	if (!user) {
		throw redirect(302, '/login');
	}

	return { user };
}

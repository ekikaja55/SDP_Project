//src/routes/+layout.ts
// handling middleware login global

import type { Load } from '@sveltejs/kit';
import { checkAuth } from '$lib';

export const load: Load = async ({ url }) => {
	const publicRoutes = ['/login', '/register', '/'];
	if (!publicRoutes.includes(url.pathname)) {
		await checkAuth();
	}
	return {};
};

// src/routes/dashboard/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log('============================================');
	console.log('fn load +layout.server.ts dashboard global -> masuk');
	// if (!locals.user) throw redirect(302, '/login');
	return { user: locals.user };
};

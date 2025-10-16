// src/routes/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log('============================================');
	console.log('fn load +layout.server.ts [root layout GLOBAL] -> masuk');

	console.log(
		'fn load +layout.server.ts -> isi locals.user [root layout GLOBAL]\n' +
			JSON.stringify(locals.user, null, 2)
	);
	return { user: locals.user ?? null };
};

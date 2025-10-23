// src/hooks.server.ts
import type { UserAuth } from '$lib';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('\n============ HANDLE START ============');
	console.log('URL:', event.url.pathname);

	const token = event.cookies.get('refreshToken');
	console.log('============ TOKEN CHECK ============');
	console.log('Token ditemukan?', token ? 'YA' : 'TIDAK');

	if (token) {
		try { 
			const user = jwtDecode<UserAuth>(token);
			event.locals.user = user;
			console.log('============ DECODE TOKEN BERHASIL ============');
			console.log('Isi user hasil decode:\n', JSON.stringify(user, null, 2));
		} catch (err) {
			event.locals.user = null;
			console.error('============ ERROR DECODE TOKEN ============');
			console.error(err);
		}
	} else {
		event.locals.user = null;
		console.log('============ TOKEN TIDAK ADA ============');
	}

	const path = event.url.pathname;
	console.log('============ ROUTE CHECK ============');
	console.log('Path sekarang:', path);
	console.log('User aktif:', event.locals.user ? 'YA' : 'TIDAK');
	console.log('Role user:', event.locals.user?.user_role || 'TIDAK ADA');

	// === Auth Logic ===

	// Kalau akses dashboard tanpa login
	if (path.startsWith('/dashboard') && !event.locals.user) {
		console.warn('============ AKSES DITOLAK: Belum login ============');
		console.warn(`Redirect -> /login`);
		return new Response(null, {
			status: 302,
			headers: { location: '/login' }
		});
	}

	// Kalau role user bukan admin tapi akses /dashboard/admin
	if (path.startsWith('/dashboard/admin') && event.locals.user?.user_role !== 'admin') {
		console.warn('============ AKSES DITOLAK: Bukan admin ============');
		console.warn(`Redirect -> /unauthorized`);
    // throw error(403,"kamu tidak memiliki akses ke halaman ini")
		throw redirect(302, '/unauthorized') ;
	}

	// Kalau role user bukan customer tapi akses /dashboard/customer
	if (path.startsWith('/dashboard/customer') && event.locals.user?.user_role !== 'customer') {
		console.warn('============ AKSES DITOLAK: Bukan customer ============');
		console.warn(`Redirect -> /unauthorized`);
		throw redirect(302, '/unauthorized');
	}

	console.log('============ HANDLE SELESAI, LANJUT RESOLVE ============');
	const response = await resolve(event);

	console.log('============ RESPONSE STATUS:', response.status, '============');
	console.log('============ HANDLE END ============');

	return response;
};

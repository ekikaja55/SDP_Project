// // src/hooks.server.ts
// import { redirect, type Handle } from '@sveltejs/kit';
// import { jwtDecode } from 'jwt-decode';
// import type { UserAuth } from './lib';

// // src/hooks.server.ts
// export const handle: Handle = async ({ event, resolve }) => {

//   console.log('\n=========== AUTH HOOK START ===========');
//   console.log('URL:', event.url.pathname);

//   // ---- HEADER CHECK ----
//   const auth = event.request.headers.get('authorization');
//   console.log('Authorization header:', auth ? 'ADA' : 'TIDAK ADA');

//   // ---- TOKEN EXTRACT ----
//   const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
//   console.log('Token ditemukan:', token ? 'YA' : 'TIDAK');

//   // ---- DECODE ----
//   if (token) {
//     try {
//       const user = jwtDecode<UserAuth>(token);
//       event.locals.user = user;

//       console.log('Decode JWT: BERHASIL ✅');
//       console.log('Payload:', JSON.stringify(user, null, 2));
//     } catch (err) {
//       event.locals.user = null;
//       console.error('Decode JWT: GAGAL ❌');
//       console.error(err);
//     }
//   } else {
//     event.locals.user = null;
//     console.warn('Token kosong → user dianggap belum login');
//   }

//   // ---- ROUTE & ROLE CHECK ----
//   const path = event.url.pathname;

//   console.log('Route:', path);
//   console.log('Auth status:', event.locals.user ? 'LOGIN' : 'BELUM LOGIN');
//   console.log('Role:', event.locals.user?.user_role ?? 'TIDAK ADA');

//   // ---- REDIRECT LOGIC ----
//   if (path.startsWith('/dashboard') && !event.locals.user) {
//     console.warn('REDIRECT → /login (belum login)');
//     throw redirect(302, '/login');
//   }

//   if (path.startsWith('/dashboard/admin') && event.locals.user?.user_role !== 'admin') {
//     console.warn('REDIRECT → /unauthorized (bukan admin)');
//     throw redirect(302, '/unauthorized');
//   }

//   if (path.startsWith('/dashboard/customer') && event.locals.user?.user_role !== 'customer') {
//     console.warn('REDIRECT → /unauthorized (bukan customer)');
//     throw redirect(302, '/unauthorized');
//   }

//   // ---- RESOLVE ----
//   const response = await resolve(event);

//   console.log('Response status:', response.status);
//   console.log('=========== AUTH HOOK END ===========\n');

//   return response;
// };

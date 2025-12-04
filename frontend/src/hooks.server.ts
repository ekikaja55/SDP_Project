import { redirect, type Handle } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import type { UserAuth } from './lib';

// src/hooks.server.ts
export const handle: Handle = async ({ event, resolve }) => {

  const auth = event.request.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

  if (token) {
    try {
      const user = jwtDecode<UserAuth>(token);
      event.locals.user = user;
    } catch {
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  const path = event.url.pathname;

  if (path.startsWith('/dashboard') && !event.locals.user) {
    throw redirect(302, '/login');
  }

  if (path.startsWith('/dashboard/admin') && event.locals.user?.user_role !== 'admin') {
    throw redirect(302, '/unauthorized');
  }

  if (path.startsWith('/dashboard/customer') && event.locals.user?.user_role !== 'customer') {
    throw redirect(302, '/unauthorized');
  }

  return resolve(event);
};

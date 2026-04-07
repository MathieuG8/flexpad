import { defineMiddleware } from 'astro:middleware';
import { getSession } from 'auth-astro/server';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  if (path.startsWith('/dashboard/admin')) {
    const session = await getSession(context.request);
    if (!session?.user) {
      const callback = encodeURIComponent(path);
      return context.redirect(`/login?callbackUrl=${callback}`);
    }
    if (session.user.role !== 'admin') {
      return context.redirect('/dashboard');
    }
    return next();
  }
  if (path.startsWith('/dashboard')) {
    const session = await getSession(context.request);
    if (!session?.user) {
      const callback = encodeURIComponent(path);
      return context.redirect(`/login?callbackUrl=${callback}`);
    }
  }
  return next();
});

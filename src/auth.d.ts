import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
  interface Session {
    user: {
      id: string;
      role: 'user' | 'admin';
    } & DefaultSession['user'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string;
  }
}

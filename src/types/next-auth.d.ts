import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'user' | 'admin';
      tier: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: 'user' | 'admin';
    tier: string;
  }
}

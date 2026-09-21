import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from './mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password.');
        }

        await connectToDatabase();

        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select('+password');

        if (!user || !user.password) {
          throw new Error('Invalid email or password. Please try again.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password. Please try again.');
        }

        // Auto-upgrade to admin if email matches
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
        if (adminEmails.includes(user.email.toLowerCase().trim()) && user.role !== 'admin') {
          user.role = 'admin';
          await user.save();
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          tier: user.tier,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    /**
     * Executes when a user signs in.
     * Handles account creation for OAuth providers and auto-upgrades admins.
     */
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectToDatabase();

        let existingUser = await User.findOne({ email: user.email });
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
        const isAdminEmail = adminEmails.includes(user.email?.toLowerCase().trim() || '');

        if (!existingUser) {
          existingUser = await User.create({
            name: user.name || 'Google User',
            email: user.email || '',
            role: isAdminEmail ? 'admin' : 'user',
            tier: 'Terra Club Member',
            // No password for OAuth users
          });
        } else if (isAdminEmail && existingUser.role !== 'admin') {
          existingUser.role = 'admin';
          await existingUser.save();
        }

        // Attach DB id and custom fields to the user object passed to jwt
        user.id = existingUser._id.toString();
        (user as any).role = existingUser.role;
        (user as any).tier = existingUser.tier;

        return true;
      }
      return true;
    },
    
    /**
     * Called whenever a JSON Web Token is created or updated.
     * Maps user attributes to the token payload.
     */
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user';
        token.tier = (user as any).tier || 'Terra Club Member';
      }
      if (trigger === 'update' && session) {
        // [SECURITY FIX] Whitelist allowed fields to prevent privilege escalation (e.g. injecting role: admin)
        if (session.name) token.name = session.name;
        if (session.image) token.image = session.image;
        if (session.email) token.email = session.email;
      }
      return token;
    },
    
    /**
     * Called whenever a session is checked on the client.
     * Exposes specific token data to the client-side session object.
     */
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).tier = token.tier;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Adjust if login page is at a different path
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};

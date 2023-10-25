import { postRequest } from '@/lib/api/calls';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: 'Authorization',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const data = await postRequest({
          url: '/auth/login',
          data: {
            username: credentials?.username,
            password: credentials?.password,
          },
        });

        const userData = {
          _id: data?.data?.user?._id,
          firstName: data?.data?.user?.firstName,
          lastName: data?.data?.user?.lastName,
          email: data?.data?.user?.email,
          createdAt: data?.data?.user?.createdAt,
          token: data?.data?.token,
        } as any;

        if (data) {
          return userData;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
});

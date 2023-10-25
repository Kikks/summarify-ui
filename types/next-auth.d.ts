import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's MongoDB ID. */
      _id: string;
      /** The user's first name. */
      firstName: string;
      /** The user's last name. */
      lastName: string;
      /** The user's email address. */
      email: string;
      /** The date the user was created. */
      createdAt: string;
      /** The user's token*/
      token: string;
    };
  }
}

import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import JWT from 'jsonwebtoken';
import getCollection from '../../../util/mongodb';
import { compare } from 'bcrypt';
import { ObjectId } from 'mongodb';
import sendgrid from '../../../util/sendgrid';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',

      async authorize(credentials) {
        const { email, password } = credentials;

        const emailRegex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,10})+$/g;
        const usernameRegex = /^[A-Za-z0-9][A-Za-z0-9.@_-]{3,30}$/g;
        const passwordRegex =
          /^(?=.*[A-Za-z])(?=.*\d)^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,}$/g;

        //server validation
        if (!(emailRegex.test(email) || usernameRegex.test(email))) {
          throw new Error('invalid email!');
        }
        // if (!passwordRegex.test(password)) {
        //   throw new Error('invalid password!');
        // }

        const usersCollection = await getCollection('users');
        const userEmail = await usersCollection.findOne({
          email: email.trim(),
        });
        const userUsername = await usersCollection.findOne({
          username: email.trim(),
        });

        const existingUser = userEmail || userUsername;

        if (!existingUser) throw new Error('email or username not found');

        const isPassValid = await compare(
          password.trim() + process.env.BCRYPT_SECRET,
          existingUser.password
        );

        if (!isPassValid) throw new Error('invalid password');

        if (existingUser.status !== 'verified')
          throw new Error('your account pending activation');

        const user = {
          email: existingUser.email,
          username: existingUser.username,
          name: existingUser.firstname + ' ' + existingUser.lastname,
          role: existingUser.role || 'user',
          id: existingUser._id.toString(),
          favorite: existingUser.favorite,
          cart: existingUser.cart,
        };

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    async encode({ secret, token }) {
      return JWT.sign(token, secret);
    },
    async decode({ secret, token }) {
      return JWT.verify(token, secret);
    },
  },

  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (!account) return token;

      if (account.type === 'credentials') return user;

      const usersCollection = await getCollection('users');
      const existingUser = await usersCollection.findOne({ email: user.email });

      if (existingUser)
        return {
          ...user,
          role: existingUser.role || 'user',
          username: existingUser.username,
          id: existingUser._id.toString(),
        };

      const username =
        user.name.replaceAll(' ', '') +
        '-' +
        Math.random().toString(32).substring(2);
      const newUser = {
        firstname: user.name.split(' ')[0],
        lastname: user.name.split(' ')[1],
        username,
        email: user.email,
        role: 'user',
        provider: account.type,
      };

      const createdUser = await usersCollection.insertOne(newUser);

      return {
        ...user,
        role: 'user',
        username,
        id: createdUser.insertedId.toString(),
      };
    },
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true;
    // },
    async session({ session, user, token }) {
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};

export default NextAuth(authOptions);

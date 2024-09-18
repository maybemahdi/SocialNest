import { connectDB } from "@/lib/connectDB";
import { generateRandomUsername } from "@/lib/generateUsername";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) {
          return null;
        }
        const db = await connectDB();
        const userCollection = db.collection("users");
        const currentUser = await userCollection.findOne({
          email,
          provider: "credential",
        });
        if (!currentUser) {
          return null;
        }
        if (password !== currentUser.password) {
          console.error("Incorrect password");
          return null; // Return null if password doesn't match
        }
        return currentUser;
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // This callback is triggered when a user is authenticated
      if (user) {
        token.id = user._id; // Add user ID to token
        token.role = user.role || "user"; // Add role to token (default to 'user')
        token.provider = account.provider; // Add provider info
        token.userName = user.userName; // Add username
      }
      return token;
    },
    async session({ session, token }) {
      // Add extra properties to session object from token
      session.user.id = token.id;
      session.user.role = token.role; // Add role to session
      session.user.userName = token.userName; // Add username to session
      session.user.provider = token.provider; // Add provider to session

      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { email } = user;
        try {
          const db = await connectDB();
          const userCollection = db.collection("users");
          const isUserExist = await userCollection.findOne({
            email,
            provider: "google",
          });
          if (!isUserExist) {
            const userName = generateRandomUsername(user?.name);
            await userCollection.insertOne({
              ...user,
              provider: "google",
              userName,
              role: "user",
            });
            return user;
          } else {
            return user;
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      } else {
        return user;
      }
    },
  },
  pages: {
    signIn: "/public/login",
  },
});

export { handler as GET, handler as POST };

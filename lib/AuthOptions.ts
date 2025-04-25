import { User } from "@/models/UserModel";
import bcrypt from "bcryptjs";
import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import ConnectDB from "./ConnectDB";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./Client";
export interface UserType {
  _id: string;
  username: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  profileComplete: boolean;
  createdAt: Date;
}

export const authOptions = {
  // Configure one or more authentication providers
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          type: "email",
          placeholder: "Email Type Here",
          label: "Email",
        },
        password: {
          type: "password",
          placeholder: "Password Here",
          label: "Password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        try {
          if (!email || !password) {
            throw new Error("Please Enter Valid Email Or Password");
          }

          await ConnectDB();

          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("Please Enter Valid Email Id Here");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
          };
        } catch (error) {
          console.log(error);
          throw new Error(`something went go wrong ${error}`);
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60,
  },
  events: {
    async createUser({ user }: any) {
      await ConnectDB();

      // Generate a fallback username if user.name is missing
      const username =
        user.name?.toLowerCase() ||
        user.email?.split("@")[0] || // fallback to email prefix
        `user_${Date.now()}`; // ultimate fallback

      const newUser: Partial<UserType> = {
        username,
        email: user.email!,
        image: user.image,
        role: "user",
        profileComplete: false,
        createdAt: new Date(),
      };
      await User.updateOne({ _id: user.id }, { $set: newUser });
    },
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

import { connectToDB } from "./mongoose";
import User from "./models/user.model";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectToDB();
                const user = await User.findOne({
                    username: credentials?.username,
                }).select("+password");

                if (!user) throw new Error("Username Not Found");
                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!passwordMatch) throw new Error("Incorrect Password");
                
                return { id: user._id, name: user.username }; 
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name; 
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                if (session.user) {
                session.user.id = token.id; 
                session.user.name = token.name; 
                }
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in", // Redirect to sign-up page when clicking on the login button
    }
};

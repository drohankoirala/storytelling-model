import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CLIENT_ID, CLIENT_SECRET, JWT_SECRET, NEXTAUTH_SECRET } from "@/app/components/common";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET
        })
    ],
    events: {

    },
    callbacks: {
        
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 3,
        updateAge: 60 * 60 * 24,
    },
    jwt: {
        secret: JWT_SECRET,
    },
    secret: NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
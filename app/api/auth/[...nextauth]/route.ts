import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { bs58 } from "bs58"
import nacl from "tweetnacl"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "phantom",
      name: "Phantom",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
        publicKey: {
          label: "Public Key",
          type: "text",
        },
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials?.signature || !credentials?.publicKey) {
          return null
        }

        try {
          const messageBytes = new TextEncoder().encode(credentials.message)
          const signatureBytes = bs58.decode(credentials.signature)
          const publicKeyBytes = bs58.decode(credentials.publicKey)

          const verified = nacl.sign.detached.verify(
            messageBytes,
            signatureBytes,
            publicKeyBytes
          )

          if (!verified) {
            return null
          }

          let user = await prisma.user.findUnique({
            where: { walletAddress: credentials.publicKey },
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                walletAddress: credentials.publicKey,
                email: `${credentials.publicKey}@phantom.com`,
              },
            })
          }

          return user
        } catch (e) {
          console.error("Auth error:", e)
          return null
        }
      },
    }),
    CredentialsProvider({
      id: "email",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          let user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                password: credentials.password,
              },
            })
          } else if (user.password !== credentials.password) {
            return null
          }

          return user
        } catch (e) {
          console.error("Email auth error:", e)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        })
        if (user) {
          session.user.id = user.id
          session.user.walletAddress = user.walletAddress
          session.user.username = user.username
        }
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
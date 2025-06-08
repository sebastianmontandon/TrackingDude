import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      phone?: string | null
      role: 'ADMIN' | 'READ_ONLY'
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    phone?: string | null
    role: 'ADMIN' | 'READ_ONLY'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    phone?: string
    role: 'ADMIN' | 'READ_ONLY'
  }
}
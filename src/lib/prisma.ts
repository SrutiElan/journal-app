import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}
// Create Prisma client with connection pooling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'], // Log queries in development
})
// In development, store the client globally to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

export const getDatabaseService = () => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

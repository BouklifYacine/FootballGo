import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

console.log("Environnement:", process.env.NODE_ENV)
console.log("DATABASE_URL:", process.env.DATABASE_URL)

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Ajoutez cette fonction de test
async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log("Connexion à la base de données réussie")
    
    // Compte le nombre d'utilisateurs
    const userCount = await prisma.user.count()
    console.log("Nombre d'utilisateurs dans la base de données:", userCount)
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error)
  }
}

testDatabaseConnection()
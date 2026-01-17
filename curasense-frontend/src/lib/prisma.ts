import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, neonConfig } from "@neondatabase/serverless";

// Configure Neon for serverless environments (Vercel)
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = "password";

// PrismaClient singleton pattern for Next.js
// Prevents multiple instances in development due to hot reloading
// Optimized for Vercel serverless with Neon DB

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  
  // Use Neon serverless Pool for better cold start performance on Vercel
  const pool = globalForPrisma.pool ?? new Pool({ 
    connectionString,
    // Optimized settings for serverless
    max: 1, // Single connection for serverless functions
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }
  
  // Create Prisma adapter with the Neon serverless pool
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" 
      ? ["query", "error", "warn"] 
      : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

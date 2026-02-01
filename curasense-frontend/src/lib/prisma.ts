import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, neonConfig } from "@neondatabase/serverless";

// Configure Neon for serverless environments (Vercel)
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = "password";

// PrismaClient singleton pattern for Next.js
// Prevents multiple instances in development due to hot reloading
// Optimized for Vercel serverless with Neon DB
// Uses LAZY initialization to ensure env vars are loaded

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * Get the DATABASE_URL with validation
 */
function getDatabaseUrl(): string {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error(
      "[Prisma] DATABASE_URL is not set. " +
      "Current env keys:", Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('PRISMA'))
    );
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please ensure DATABASE_URL is configured in your Vercel environment variables " +
      "for both Production and Preview environments."
    );
  }
  
  // Validate the connection string format
  if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
    throw new Error(
      "DATABASE_URL must be a valid PostgreSQL connection string starting with 'postgresql://' or 'postgres://'"
    );
  }
  
  return connectionString;
}

function createPrismaClient(): PrismaClient {
  const connectionString = getDatabaseUrl();
  
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

/**
 * Lazy-initialized Prisma client getter.
 * This ensures the client is only created when first accessed,
 * after Next.js has fully loaded environment variables.
 */
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Prisma client instance - uses a Proxy for lazy initialization.
 * The actual PrismaClient is only created on first property access,
 * ensuring environment variables are available.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrismaClient();
    const value = client[prop];
    // Bind methods to preserve 'this' context
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;

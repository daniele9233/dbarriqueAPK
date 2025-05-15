import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { type Context } from "hono";

// Create empty context object
export const createContext = () => ({});

// Initialize tRPC
const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure;
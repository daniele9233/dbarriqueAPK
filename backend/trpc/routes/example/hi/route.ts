import { protectedProcedure } from "@/backend/trpc/create-context";

export const hiProcedure = protectedProcedure.query(() => {
  return "Hello from the backend!";
});
import { router } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";

export const appRouter = router({
  example: router({
    hi: hiProcedure,
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { publicProcedure, router } from "./trpc";
import { appConfig } from "./config";

const appRouter = router({
  analyze: publicProcedure.query(async () => {
    return "Hello, rolefit!";
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

// Crate a standalone HTTP server
const server = createHTTPServer({
  router: appRouter,
});

server.listen(appConfig.port);

import { createTRPCClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@repo/api";

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    }),
  ],
});

export default trpc;

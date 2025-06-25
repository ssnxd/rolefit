import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@repo/api';
   
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001',
    }),
  ],
});

export default trpc;

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/utils/trpc';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        transformer: superjson,
        url: '/api/trpc',
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

import { NextRequest } from 'next/server';
import { appRouter } from '@/server/trpc/routers/_app';
import { createContext } from '@/server/trpc/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
  });
};

export { handler as GET, handler as POST };

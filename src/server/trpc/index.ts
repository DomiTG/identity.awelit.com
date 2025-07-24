import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { createContext } from './context';

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// ✅ Auth middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('Not authenticated');
  }
  return next({ ctx: { user: ctx.user } });
});

export const protectedProcedure = t.procedure.use(isAuthed);

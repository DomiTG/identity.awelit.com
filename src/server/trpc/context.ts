import { type NextRequest } from 'next/server';

export async function createContext({ req }: { req: NextRequest }) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  // 🧠 Replace this with your own auth logic (e.g. JWT, session, etc.)
  const user = token === 'secrettoken' ? { id: '1', name: 'Daniel' } : null;

  return { user };
}

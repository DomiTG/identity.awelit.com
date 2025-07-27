import { sign, verify as verifyJWT } from "jsonwebtoken";
import prisma from "@/server/db";

export async function POST(
    req: Request,
) {

  try {
    const refreshToken = req.headers.get("Authorization")?.split(" ")[1];
    if (!refreshToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const decoded: any = verifyJWT(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Invalid refresh token" }), { status: 401 });
    }
    const session = await prisma.client_sessions.findFirst({
      where: { refresh_token: refreshToken, user_id: decoded.userId },
    });
    if (!session || session.valid_until < new Date()) {
      if(session) {
        await prisma.client_sessions.delete({
          where: { id: session.id },
        });
      }
      return new Response(JSON.stringify({ error: "Session expired or invalid" }), { status: 401 });
    }

    const newAccessToken = sign(
      { userId: decoded.userId, clientId: decoded.clientId },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );
    const user = await prisma.client_users.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email_address: user.email_address,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    }), { status: 200 });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { sign, verify as verifyJWT } from "jsonwebtoken";
import prisma from "@/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const refreshToken = req.cookies["refresh_token"];
    if (!refreshToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded: any = verifyJWT(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    if (!decoded) {
      return res.status(401).json({ error: "Invalid refresh token" });
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
      return res.status(401).json({ error: "Session expired or invalid" });
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
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email_address,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

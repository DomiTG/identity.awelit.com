import { publicProcedure, router } from "../index";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@/server/db";
import { sign as signJWT } from "jsonwebtoken";

const checkCaptcha = async (captchaToken: string) => {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: "6Ld3PY0rAAAAABSRmP0_wX5rtoUElGlyAG5kx_l3", // Replace with your actual secret key
        response: captchaToken,
      }),
    }
  );
  const data = await response.json();
  return data.success;
};

const generateRefreshToken = (userId: number, clientId: string) => {
  return signJWT(
    { userId, clientId },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const authRouter = router({
  //Captcha secret = 6Ld3PY0rAAAAABSRmP0_wX5rtoUElGlyAG5kx_l3
  login: publicProcedure
    .input(
      z.object({
        email_address: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        password: z.string().min(6),
        captchaToken: z.string(),
        client_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email_address, password, captchaToken } = input;
      const isCaptchaValid = await checkCaptcha(captchaToken);
      if (!isCaptchaValid) {
        throw new Error("Captcha verification failed");
      }
      const client = await prisma.clients.findFirst({
        where: {
          client_id: input.client_id,
        },
      });
      if (!client) {
        throw new Error("Client not found");
      }
      const user = await prisma.client_users.findFirst({
        where: {
          email_address: email_address,
          client_id: client.id,
        },
      });
      if (!user) {
        throw new Error("Uživatel s tímto e-mailem neexistuje");
      }
      if (!user.password) {
        throw new Error("Uživatel nemá nastavené heslo");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Nesprávné heslo");
      }
      const tokens = generateRefreshToken(user.id, client.client_id);
      const session = await prisma.client_sessions.create({
        data: {
          user_id: user.id,
          refresh_token: tokens,
          valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          valid: true,
        },
      });
      if (!session) {
        throw new Error("Failed to create session");
      }
      return {
        refreshToken: tokens,
      };
    }),
  register: publicProcedure
    .input(
      z.object({
        email_address: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        password: z.string().min(6),
        captchaToken: z.string(),
        client_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email_address, password, captchaToken, client_id } = input;
      const isCaptchaValid = await checkCaptcha(captchaToken);
      if (!isCaptchaValid) {
        throw new Error("Captcha verification failed");
      }
      const client = await prisma.clients.findFirst({
        where: {
          client_id: client_id,
        },
      });
      if (!client) {
        throw new Error("Client not found");
      }
      const existingUser = await prisma.client_users.findFirst({
        where: {
          email_address: email_address,
          client_id: client.id,
        },
      });
      if (existingUser) {
        throw new Error("Uživatel s tímto e-mailem již existuje");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.client_users.create({
        data: {
          email_address,
          username: email_address.split("@")[0],
          password: hashedPassword,
          client_id: client.id,
          updated_at: new Date(),
          created_at: new Date(),
        },
      });
      const tokens = generateRefreshToken(newUser.id, client.client_id);
      const session = await prisma.client_sessions.create({
        data: {
          user_id: newUser.id,
          refresh_token: tokens,
          valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          valid: true,
        },
      });
      if (!session) {
        throw new Error("Failed to create session");
      }
      return {
        refreshToken: tokens,
      };
    }),
});

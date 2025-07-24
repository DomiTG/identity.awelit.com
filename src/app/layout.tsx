import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "./_trpc/Provider";

export const metadata: Metadata = {
  title: "Awelit Authentication System",
  description: "Awelit Authentication System",
};

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${montserrat.variable} antialiased`}
      >
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}

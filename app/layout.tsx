import type { Metadata } from "next";
import { Philosopher } from "next/font/google";
import "./globals.css";

const philosopher = Philosopher({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-philosopher',
})

export const metadata: Metadata = {
  title: "deCave Admin",
  description: "Admin Dashboard of deCave",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${philosopher.variable} font-philosopher antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

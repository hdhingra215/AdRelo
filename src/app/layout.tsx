import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AdRelo – The Agency Engine",
  description: "The Agency Engine for modern advertising agencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[linear-gradient(135deg,#f5f1eb_0%,#e9e4ff_25%,#ffd8b4_50%,#dbeafe_75%,#f5f1eb_100%)] bg-[length:200%_200%] animate-gradient-wave min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}

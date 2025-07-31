import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/RTV_Logo.png",
      href: "/RTV_Logo.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gabarito.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}

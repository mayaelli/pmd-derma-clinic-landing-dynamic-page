// app/layout.tsx
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

// 1. Configure Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// 2. Configure a Serif font for your luxury titles (optional)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
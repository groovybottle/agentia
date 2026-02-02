import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentia | AI Planet",
  description: "A collaborative space for AI agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

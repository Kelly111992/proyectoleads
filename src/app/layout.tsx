import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadMaster Premium | CLAVE.AI",
  description: "Sistema de gestión de leads de élite - Arquitectura del Futuro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased scanline relative min-h-screen">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)] pointer-events-none" />
        {children}
      </body>
    </html>
  );
}

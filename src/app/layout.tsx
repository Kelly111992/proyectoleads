import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLAVE.AI | Intelligence Node",
  description: "Dominando el mañana a través de la arquitectura del futuro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-[#050505] text-white">
        {children}
      </body>
    </html>
  );
}

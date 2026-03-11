import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALTEPSA | Matriz Operativa CRM",
  description: "Sistema Avanzado de Gestión de Leads y Operaciones ALTEPSA.",
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

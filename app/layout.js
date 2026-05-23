import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "WePrompt — O 1º Marketplace de IA da América Latina",
  description: "Curadoria especializada de soluções de IA, suporte em português, pronto para usar.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className={`${dmSans.className} min-h-full flex flex-col`} style={{background: "linear-gradient(135deg, #0a0a1a 0%, #0d0a2e 50%, #0a1628 100%)", minHeight: "100vh"}}>{children}</body>
    </html>
  );
}

import { DM_Sans } from "next/font/google";
import "./globals.css";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import NavbarController from "./components/NavbarController";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  metadataBase: new URL("https://weprompt.app.br"),
  title: "WePrompt — O 1º Marketplace de Soluções de IA da América Latina",
  description: "Encontre soluções de IA prontas para usar no seu negócio. Agentes, automações, chatbots e muito mais. Suporte em português.",
  keywords: ["marketplace IA", "soluções inteligência artificial", "agentes IA", "automação IA", "chatbots", "marketplace inteligência artificial brasil"],
  authors: [{ name: "WePrompt" }],
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  themeColor: "#0369A1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WePrompt",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "WePrompt — O 1º Marketplace de Soluções de IA da América Latina",
    description: "Encontre soluções de IA prontas para usar no seu negócio. Agentes, automações, chatbots e muito mais. Suporte em português.",
    url: "https://weprompt.app.br",
    siteName: "WePrompt",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WePrompt" }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WePrompt — O 1º Marketplace de Soluções de IA da América Latina",
    description: "Encontre soluções de IA prontas para usar no seu negócio. Agentes, automações, chatbots e muito mais. Suporte em português.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark h-full antialiased">
      <body className={`${dmSans.className} min-h-full flex flex-col`}>
        <NavbarController />
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}

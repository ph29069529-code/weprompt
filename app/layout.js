import "./globals.css";
import { Inter } from "next/font/google";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import NavbarController from "./components/NavbarController";
import FooterController from "./components/FooterController";
import GlobalDrawers from "@/components/GlobalDrawers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://weprompt.app.br"),
  title: "WePrompt — O 1º Marketplace de Soluções de IA da América Latina",
  description: "Encontre soluções de IA prontas para usar no seu negócio. Agentes, automações, chatbots e muito mais. Suporte em português.",
  keywords: ["marketplace IA", "soluções inteligência artificial", "agentes IA", "automação IA", "chatbots", "marketplace inteligência artificial brasil"],
  authors: [{ name: "WePrompt" }],
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  themeColor: "#6366F1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WePrompt",
  },
  icons: {
    icon: "/logo-icon-white.png",
    shortcut: "/logo-icon-white.png",
    apple: "/logo-icon-white.png",
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
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="icon" href="/logo-icon-white.png" />
        <link rel="apple-touch-icon" href="/logo-icon-white.png" />
        <meta name="theme-color" content="#6366F1" />
        <link rel="preconnect" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
      </head>
      <body className={`${inter.variable} min-h-full flex flex-col`}>
        <NavbarController />
        {children}
        <FooterController />
        <PWAInstallPrompt />
        <GlobalDrawers />
      </body>
    </html>
  );
}

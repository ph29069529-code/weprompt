import "./globals.css";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import NavbarController from "./components/NavbarController";
import GlobalDrawers from "@/components/GlobalDrawers";

export const metadata = {
  metadataBase: new URL("https://weprompt.app.br"),
  title: "WePrompt — O 1º Marketplace de Soluções de IA da América Latina",
  description: "Encontre soluções de IA prontas para usar no seu negócio. Agentes, automações, chatbots e muito mais. Suporte em português.",
  keywords: ["marketplace IA", "soluções inteligência artificial", "agentes IA", "automação IA", "chatbots", "marketplace inteligência artificial brasil"],
  authors: [{ name: "WePrompt" }],
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  themeColor: "#00D4AA",
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
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }} className="min-h-full flex flex-col">
        <NavbarController />
        {children}
        <PWAInstallPrompt />
        <GlobalDrawers />
      </body>
    </html>
  );
}

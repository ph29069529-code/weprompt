"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

const HIDDEN_PREFIXES = [
  "/dashboard",
  "/admin",
  "/checkout",
  "/obrigado",
  "/completar-perfil",
  "/login",
  "/cadastro",
  "/workspace",
];

export default function FooterController() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
  return <Footer />;
}

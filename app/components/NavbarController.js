"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDDEN_PREFIXES = ["/dashboard", "/login", "/cadastro", "/completar-perfil", "/checkout", "/obrigado"];

export default function NavbarController() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some(p => pathname?.startsWith(p))) return null;
  return <Navbar />;
}

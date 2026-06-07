"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDDEN_PREFIXES = ["/checkout", "/obrigado", "/completar-perfil", "/admin", "/dashboard"];

export default function NavbarController() {
  const pathname = usePathname();
  if (!pathname) return null;
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <Navbar />;
}

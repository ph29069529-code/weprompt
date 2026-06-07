"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import NavbarDashboard from "./NavbarDashboard";

const HIDDEN_PREFIXES = ["/checkout", "/obrigado", "/completar-perfil", "/admin", "/dashboard/admin"];
const DASHBOARD_PREFIXES = ["/dashboard"];

export default function NavbarController() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
  if (DASHBOARD_PREFIXES.some((p) => pathname?.startsWith(p))) return <NavbarDashboard />;
  return <Navbar />;
}

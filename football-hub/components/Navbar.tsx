"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";
import { storageKeys, useFootballStore } from "@/store/useFootballStore";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Live", href: "/live" },
  { label: "Players", href: "/players" },
  { label: "Transfers", href: "/transfers" },
  { label: "Predictions", href: "/predictions" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useFootballStore();

  useEffect(() => {
    const savedTheme = (localStorage.getItem(storageKeys.THEME_KEY) as "dark" | "light") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, [setTheme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-white">Football Hub</Link>
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={clsx("rounded-full px-3 py-1.5 text-sm transition", pathname === item.href ? "bg-emerald-500 text-black" : "text-zinc-300 hover:bg-zinc-800 hover:text-white")}>
              {item.label}
            </Link>
          ))}
          <button onClick={toggleTheme} className="ml-2 rounded-full border border-white/10 p-2 text-zinc-300 hover:bg-zinc-800" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  ShoppingBag,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useHera } from "@/lib/menheraTodo/context";

export default function Header() {
  const tabs = [
    {
      href: "/",
      icon: <Home className="w-4 h-4" />,
      label: "ホーム",
    },
    {
      href: "/protected/todos",
      icon: <ListTodo className="w-4 h-4" />,
      label: "Todos",
    },
    {
      href: "/protected/shop",
      icon: <ShoppingBag className="w-4 h-4" />,
      label: "ショップ",
    },
    {
      href: "/protected/settings",
      icon: <Settings className="w-4 h-4" />,
      label: "設定",
    },
  ];
  const pathname = usePathname();

  const { setHeraStatus } = useHera();
  const handleNavigation = () => {
    setHeraStatus({
      message: "なんで他のページに行こうとするの？私のことなんかどうでもいいんだ...",
    });
  };
  return (
    <header className="w-full border-b bg-pink-50/80 dark:bg-stone-700/80 border-pink-200 dark:border-stone-900 px-4 shadow-sm h-14 flex items-center justify-between sm:py-8">
      <Link href="/">
        <Image
          src="/header-icon.png"
          height={150}
          width={180}
          alt="Header-Icon"
        />
      </Link>

      <>
        <nav className="hidden sm:flex gap-4 ml-8">
          {tabs.map(({ href, icon, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");

            return (
              <button
                key={href}
                onClick={() => handleNavigation()}
                className={cn(
                  "flex items-center gap-1 text-sm px-2 py-1.5 rounded-md transition-colors hover:cursor-pointer",
                  isActive
                    ? "text-pink-500 dark:text-pink-400 font-semibold bg-white"
                    : "dark:text-white text-gray-600 hover:dark:bg-white hover:dark:text-pink-500"
                )}
              >
                {icon}
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </>
      {/* <div className="flex items-center gap-4 ml-auto text-sm">
        <ThemeSwitcher />
      </div> */}
    </header>
  );
}

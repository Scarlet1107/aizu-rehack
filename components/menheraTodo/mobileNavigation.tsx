"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  ShoppingBag,
  ListTodo,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHera } from "@/lib/menheraTodo/context";

type Props = {
  isHard: boolean;
};
// サーバーコンポーネントで実装したかった;;
// サーバーコンポーネントだとisActiveがうまく動かない
export const MobileNavigation = ({ isHard }: Props) => {
  const tabs: { href: string; icon: typeof Home; label: string }[] = [
    { href: "/", icon: Home, label: "ホーム" },
    { href: "/protected/todos", icon: ListTodo, label: "Todos" },
    ...(isHard
      ? [{ href: "/protected/chat", icon: MessageSquare, label: "チャット" }]
      : []),
    { href: "/protected/shop", icon: ShoppingBag, label: "ショップ" },
    { href: "/protected/settings", icon: Settings, label: "設定" },
  ];
  const pathname = usePathname();

  const { setHeraStatus } = useHera();
  const handleNavigation = () => {
    setHeraStatus({
      message: "なんで他のページに行こうとするの？私のことなんかどうでもいいんだ...",
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-pink-50/70 border-pink-200 dark:bg-white/50 border-t dark:border-gray-200 shadow-md sm:hidden">
      <ul className="flex justify-around items-center p-2 ">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <button onClick={() => handleNavigation()}>
                <div className="flex flex-col items-center text-xs rounded-full bg-white aspect-square w-13 h-13 justify-center hover:bg-pink-50 transition-all duration-200 ease-in-out">
                  <Icon
                    className={cn(
                      "h-5 w-5 mb-1",
                      isActive ? "text-pink-500" : "text-gray-500"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px]",
                      isActive ? "text-pink-500 font-semibold" : "text-gray-500"
                    )}
                  >
                    {label}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

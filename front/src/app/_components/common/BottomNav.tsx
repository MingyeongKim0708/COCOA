"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { Home, Search, BarChart2, User, Menu } from "lucide-react";

const navItems = [
  { label: "카테고리", icon: <Menu size={24} />, href: "/category" },
  { label: "검색", icon: <Search size={24} />, href: "/search" },
  { label: "홈", icon: <Home size={24} />, href: "/home" },
  { label: "비교", icon: <BarChart2 size={24} />, href: "/compare" },
  { label: "마이", icon: <User size={24} />, href: "/my" },
];

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavButtonClick = (href: string) => {
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <nav className="fixed bottom-[-0.1rem] left-0 right-0 z-50 flex justify-center bg-transparent">
      <div className="h-navh w-full max-w-[39rem] border-t border-gray4 bg-white px-4">
        <ul className="flex justify-between py-2 text-size5 text-gray2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <li key={item.href} className="flex flex-1 flex-col items-center">
                <button
                  onClick={() => handleNavButtonClick(item.href)}
                  className={cn(
                    "flex flex-col items-center gap-1",
                    isActive && "font-title text-red2",
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;

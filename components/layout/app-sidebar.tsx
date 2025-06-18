"use client";
import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  MegaphoneIcon,
  UtensilsIcon,
  PackageIcon,
  TicketIcon,
  BusIcon,
  SettingsIcon,
  LogOutIcon,
  LogoIcon,
} from "@/components/ui/icons";

const menuItems = [
  { icon: HomeIcon, label: "Home", href: "/" },
  { icon: MegaphoneIcon, label: "Announcements", href: "/announcements" },
  { icon: UtensilsIcon, label: "Food Services", href: "/food" },
  { icon: PackageIcon, label: "Lost & Found", href: "/lost-found" },
  { icon: TicketIcon, label: "Ticket Status", href: "/tickets" },
  { icon: BusIcon, label: "Transport", href: "/transport" },
  { icon: BusIcon, label: "Admin Transport", href: "/transportadmin" },
  { icon: SettingsIcon, label: "Settings", href: "/settings" },
];

export const AppSidebar = memo(function AppSidebar({
  activeItem,
  onClose,
}: {
  activeItem: string;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col items-center bg-white dark:bg-gray-800 rounded-tr-5xl rounded-br-5xl w-[250px] py-4 px-3">

      {/* Logo */}
      <div className="flex items-center justify-center w-full mb-15 mt-2">
        <LogoIcon size={180} className="shrink-0" />
      </div>

      {/* Main Menu */}
      <nav className="flex-1 flex flex-col w-full gap-4 mt-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex flex-row items-center gap-3 w-full py-2 px-3 !font-[var(--font-opensans)] !font-bold !text-[20px] !leading-[100%] !tracking-[0%] rounded-lg transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:text-blue-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-700/50"
                }
                ${item.label === "Transport" ? "relative" : ""}
              `}
            >
              <item.icon
                size={18}
                className={`shrink-0 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
              <span className="font-[var(--font-opensans)] font-bold text-[15px] leading-[100%] tracking-[0%]">{item.label}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Sign Out Button */}
      <div className="w-full">
        <button
          onClick={() => {
            // Handle sign out
            onClose();
          }}
          className="flex flex-row items-center gap-3 w-full py-2 px-3 rounded-lg transition-all cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 justify-start"
        >
          <LogOutIcon size={18} className="shrink-0 text-red-600 dark:text-red-400" />
          <span className="font-[var(--font-opensans)] font-bold text-[15px] leading-[100%] tracking-[0%]">Sign Out</span>
        </button>
      </div>
    </div>
  );
});

AppSidebar.displayName = "AppSidebar";

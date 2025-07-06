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
import { cn } from "@/lib/utils";

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

function NavLink({ href, isActive, onClick, children }: {
  href: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex flex-row items-center gap-3 w-full py-2 px-3 rounded-lg transition-all cursor-pointer",
        "font-opensans font-bold text-[15px] leading-[100%] tracking-[0%]",
        {
          "bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-400": isActive,
          "text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-800 dark:hover:text-blue-400": !isActive
        }
      )}
    >
      {children}
    </Link>
  );
}

export const AppSidebar = memo(function AppSidebar({
  onClose,
}: {
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col items-center bg-white dark:bg-black w-[250px] py-4 px-3 rounded-tr-3xl rounded-br-3xl">
      {/* Logo */}
      <div className="flex items-center justify-center w-full mb-15 mt-2">
        <LogoIcon size={180} className="shrink-0" />
      </div>

      {/* Main Menu */}
      <nav className="flex-1 flex flex-col w-full gap-4 mt-10">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <NavLink
              key={item.href}
              href={item.href}
              isActive={isActive}
              onClick={onClose}
            >
              <item.icon
                size={18}
                className={cn("shrink-0", {
                  "text-blue-600 dark:text-blue-400": isActive,
                  "text-gray-400 dark:text-gray-500": !isActive
                })}
              />
              <span>{item.label}</span>
            </NavLink>
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
          className={cn(
            "flex flex-row items-center gap-3 w-full py-2 px-3 rounded-lg transition-all cursor-pointer",
            "font-opensans font-bold text-[15px] leading-[100%] tracking-[0%]",
            "text-red-600 dark:text-red-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
          )}
        >
          <LogOutIcon size={18} className="shrink-0 text-red-600 dark:text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
});

AppSidebar.displayName = "AppSidebar";

"use client";
import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@/hooks/auth/use-auth";
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
} from "@/components/ui/primitives/icons";

import { cn, hasAdminRole } from "@/lib/utils";


interface MenuItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  adminOnly?: boolean;
  group?: string;
}

// Helper function to get today's transport URL
const getTodayTransportUrl = () => {
  const today = new Date();
  return `/transport/${format(today, 'yyyy-MM-dd')}`;
};

// Helper function to get today's transport admin URL
const getTodayTransportAdminUrl = () => {
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  return `/transport-admin/${todayString}/${todayString}`;
};

// Function to get menu items (called each render to get current date)
const getMenuItems = (): MenuItem[] => [
  // Dashboard
  { icon: HomeIcon, label: "Dashboard", href: "/dashboard", group: "main" },
  
  // Transport Services
  { icon: BusIcon, label: "Transport", href: getTodayTransportUrl(), group: "transport" },
  { icon: BusIcon, label: "Transport Admin", href: getTodayTransportAdminUrl(), adminOnly: true, group: "transport" },
  
  // Mess Services
  { icon: UtensilsIcon, label: "Mess", href: "/mess", group: "mess" },
  { icon: UtensilsIcon, label: "Mess Admin", href: "/mess-admin", adminOnly: true, group: "mess" },
  
  // Ticket Services
  { icon: TicketIcon, label: "Ticket", href: "/ticket", group: "support" },
  { icon: TicketIcon, label: "Ticket Admin", href: "/ticket-admin", adminOnly: true, group: "support" },
  
  // Document Services
  { icon: PackageIcon, label: "Documents", href: "/document", group: "documents" },
  { icon: PackageIcon, label: "Document Admin", href: "/document-admin", adminOnly: true, group: "documents" },
  
  // Common Drive Services
  { icon: PackageIcon, label: "Common Drive", href: "/common-drive", group: "common-drive" },
  { icon: PackageIcon, label: "Common Drive Admin", href: "/common-drive-admin", adminOnly: true, group: "common-drive" },
  
  // Student Services
  { icon: HomeIcon, label: "Digital ID Card", href: "/id-card", group: "student" },
  { icon: HomeIcon, label: "Fee", href: "/fee", group: "student" },
  { icon: HomeIcon, label: "Fee Admin", href: "/fee-admin", adminOnly: true, group: "student" },
  { icon: HomeIcon, label: "Placement Cell", href: "/placement", group: "student" },
  { icon: HomeIcon, label: "Placement Cell Admin", href: "/placement-admin", adminOnly: true, group: "student" },
  { icon: HomeIcon, label: "Room Booking", href: "/room-booking", group: "facilities" },
  { icon: HomeIcon, label: "Room Booking Admin", href: "/room-booking-admin", adminOnly: true, group: "facilities" },
  
  // Media & Events
  { icon: HomeIcon, label: "Gallery", href: "/gallery", group: "media" },
  { icon: HomeIcon, label: "Gallery Admin", href: "/gallery-admin", adminOnly: true, group: "media" },
  
  // Asset Management
  { icon: PackageIcon, label: "Lost & Found", href: "/lost-found", group: "assets" },
  { icon: PackageIcon, label: "Lost & Found Admin", href: "/lost-found-admin", adminOnly: true, group: "assets" },
  { icon: PackageIcon, label: "Borrowing", href: "/borrowing", group: "assets" },
  { icon: PackageIcon, label: "Borrowing Admin", href: "/borrowing-admin", adminOnly: true, group: "assets" },
  
  // Events
  { icon: MegaphoneIcon, label: "Events", href: "/events", group: "events" },
  { icon: MegaphoneIcon, label: "Events Admin", href: "/events-admin", adminOnly: true, group: "events" },
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

        "flex flex-row items-center justify-start gap-1.5 w-full py-1 px-2 rounded-lg transition-all cursor-pointer",
        "font-opensans font-medium text-xs leading-[100%] tracking-[0%]",

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
  const { userRoles, logout } = useAuth();
  const isAdmin = hasAdminRole(userRoles);

  // Get current menu items (includes today's date for transport)
  const menuItems = getMenuItems();

  // Group menu items
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!item.group) return acc;
    if (!acc[item.group]) acc[item.group] = [];
    
    // Only filter admin-only items for non-admin users
    if (item.adminOnly && !isAdmin) return acc;
    
    acc[item.group]!.push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black w-[220px] py-2 px-2 rounded-tr-3xl rounded-br-3xl">

      {/* Logo */}
      <div className="flex items-center justify-center w-full mb-4">
        <LogoIcon size={120} className="shrink-0" />
      </div>

      {/* Main Menu */}

      <nav className="flex-1 flex flex-col w-full gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {/* Main Dashboard */}
        {groupedMenuItems.main?.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
            onClick={onClose}
          >
            <item.icon
              size={14}
              className={cn("shrink-0", {
                "text-blue-600 dark:text-blue-400": pathname === item.href,
                "text-gray-400 dark:text-gray-500": pathname !== item.href
              })}
            />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}

        {/* Transport Section */}
        {groupedMenuItems.transport && (
          <>
            <div className="mt-4 mb-1 px-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Transport
              </span>
            </div>
            {groupedMenuItems.transport.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                isActive={pathname === item.href}
                onClick={onClose}
              >
                <item.icon
                  size={14}
                  className={cn("shrink-0", {
                    "text-blue-600 dark:text-blue-400": pathname === item.href,
                    "text-gray-400 dark:text-gray-500": pathname !== item.href
                  })}
                />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </>
        )}

        {/* Other Sections */}
        {Object.entries(groupedMenuItems).map(([group, items]) => {
          if (group === 'main' || group === 'transport') return null;
          
          return (
            <div key={group}>
              <div className="mt-4 mb-1 px-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                </span>
              </div>
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  isActive={pathname === item.href}
                  onClick={onClose}
                >
                  <item.icon
                    size={14}
                    className={cn("shrink-0", {
                      "text-blue-600 dark:text-blue-400": pathname === item.href,
                      "text-gray-400 dark:text-gray-500": pathname !== item.href
                    })}
                  />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>

          );
        })}
      </nav>


      {/* Sign Out Button */}
      <div className="w-full px-1 mt-2">

        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className={cn(

            "flex flex-row items-center justify-center gap-2 w-full py-1.5 px-2 rounded-lg transition-all cursor-pointer",
            "font-opensans font-medium text-xs leading-[100%] tracking-[0%]",
            "text-red-600 dark:text-red-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
          )}
        >
          <LogOutIcon size={14} className="shrink-0 text-red-600 dark:text-red-400" />

          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
});

AppSidebar.displayName = "AppSidebar";

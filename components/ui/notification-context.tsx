'use client'

import React, { createContext, useContext, useState, ReactNode } from "react";

type Notification = { message: string; type?: "success" | "error" | "info" };

const NotificationContext = createContext<{
  notify: (notification: Notification) => void;
} | null>(null);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx.notify;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <NotificationContext.Provider value={{ notify: setNotification }}>
      {children}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[99999] px-6 py-4 rounded-lg shadow-lg text-white font-semibold transition-all
            ${notification.type === "success" ? "bg-green-600" : notification.type === "error" ? "bg-red-600" : "bg-blue-600"}
          `}
          role="status"
          aria-live="polite"
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
} 
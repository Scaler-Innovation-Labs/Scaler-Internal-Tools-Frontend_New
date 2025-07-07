"use client";
import { useEffect, useState } from "react";
import ClientLayout from "../client-layout";
import LoginPage from "../auth/login";
import { useAuth } from "../../hooks/use-auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DashboardPage() {
  const { accessToken, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return null;
  }

  if (!accessToken) {
    return (
      <ClientLayout>
        <LoginPage />
      </ClientLayout>
    );
  }
  
  return (
    <ClientLayout>
      <DashboardLayout activeItem="home">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600">Welcome to your dashboard!</p>
        </div>
      </DashboardLayout>
    </ClientLayout>
  );
}

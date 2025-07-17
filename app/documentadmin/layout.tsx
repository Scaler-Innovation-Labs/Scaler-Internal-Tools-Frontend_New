'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DocumentAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
} 
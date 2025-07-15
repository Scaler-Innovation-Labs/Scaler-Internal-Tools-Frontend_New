'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DocumentLayout({
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
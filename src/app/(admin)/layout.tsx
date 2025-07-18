import type { Metadata } from "next";
import { AdminRoute } from '@/components/providers/admin-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export const metadata: Metadata = {
  title: "Admin Panel | SST Internal Tools",
  description: "Administrative interface for managing SST campus services including transport, documents, tickets, and facilities.",
  keywords: [
    "SST admin", 
    "transport admin", 
    "document admin", 
    "campus management", 
    "administrative interface"
  ],
  openGraph: {
    title: "Admin Panel - SST Internal Tools",
    description: "Administrative interface for managing SST campus services",
    type: "website",
  },
}

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <AdminRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AdminRoute>
  );
}
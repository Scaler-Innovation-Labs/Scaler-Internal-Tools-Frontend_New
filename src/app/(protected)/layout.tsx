import type { Metadata } from "next";
import { ProtectedRoute } from '@/components/providers/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

// You can still have page-specific metadata, but handle it differently
export const metadata: Metadata = {
  title: "SST Internal Tools | Dashboard",
  description: "Access SST campus services including transport, documents, tickets, and mess facilities.",
  keywords: ["SST", "campus services", "transport", "documents", "tickets", "mess"],
  openGraph: {
    title: "SST Internal Tools - Campus Services",
    description: "Access SST campus services and facilities",
    type: "website",
  },
}

export default function ProtectedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
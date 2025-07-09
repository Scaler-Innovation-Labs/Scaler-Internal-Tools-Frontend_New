import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ClientLayout from "../client-layout";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken?.value) {
    redirect("/login");
  }
  
  return (
    <ClientLayout>
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600">Welcome to your dashboard!</p>
        </div>
      </DashboardLayout>
    </ClientLayout>
  );
}

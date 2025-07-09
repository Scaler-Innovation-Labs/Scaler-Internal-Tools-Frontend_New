import ClientLayout from "../client-layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        {children}
      </div>
    </ClientLayout>
  );
} 
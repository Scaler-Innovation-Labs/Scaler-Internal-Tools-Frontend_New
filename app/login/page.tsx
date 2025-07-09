"use client";
import ClientLayout from "../client-layout";
import LoginPage from "../auth/login";

export default function LoginRoute() {
  return (
    <ClientLayout>
      <LoginPage />
    </ClientLayout>
  );
}

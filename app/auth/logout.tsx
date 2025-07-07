import { useAuth } from "../../hooks/use-auth";

export default function LogoutPage() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
      <button
        onClick={logout}
        className="px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
      >
        Confirm Logout
      </button>
    </div>
  );
}

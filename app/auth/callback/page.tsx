"use client";
import dynamic from 'next/dynamic';

// Dynamically import the AuthCallback component with no SSR
const AuthCallback = dynamic(() => import('../callback'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  ),
});

export default function CallbackPage() {
  return <AuthCallback />;
}

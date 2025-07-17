"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import ClientLayout from "../client-layout";

function TestAuthContent() {
  const { isAuthenticated, isLoading, error, login, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔐 Authentication Test</h1>
        
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Status</h2>
            <p><strong>Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</p>
            <p><strong>Error:</strong> {error ? `❌ ${error}` : '✅ None'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800">Error Details</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-100 rounded-lg">
                <h3 className="font-semibold text-green-800">✅ Authentication Successful!</h3>
                <p className="text-green-700">You are logged in and have a valid access token.</p>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs break-all">
                  <strong>Authentication Status:</strong> Authenticated
                </div>
              </div>
              
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
              
              <a
                href="/dashboard"
                className="block w-full text-center bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800">⚠️ Not Authenticated</h3>
                <p className="text-yellow-700">You need to log in to access protected resources.</p>
              </div>
              
              <button
                onClick={login}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Loading...' : 'Login with Google'}
              </button>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Instructions</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Click "Login with Google" to start OAuth flow</li>
              <li>You'll be redirected to Google login</li>
              <li>After authentication, you'll come back with tokens</li>
              <li>The access token will be stored in memory</li>
              <li>The refresh token will be in an HTTP-only cookie</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestAuthPage() {
  return (
    <ClientLayout>
      <TestAuthContent />
    </ClientLayout>
  );
}

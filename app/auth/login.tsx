"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    setUrlError(searchParams.get("error"));
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden flex">
      
      {/* Left Half - Welcome Section */}
      <div className="w-1/2 h-screen flex flex-col justify-center items-center px-16 bg-white">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-black mb-8 leading-tight">
            Welcome Back .!
          </h1>
          <div className="flex items-center justify-center w-full max-w-lg">
            <div className="border-2 border-black px-6 py-3 rounded-lg font-bold text-lg bg-white">
              SST Internals
            </div>
            <div className="flex-1 ml-6">
              <div className="border-t-2 border-dashed border-gray-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half - Login Form Area */}
      <div className="w-1/2 h-screen flex justify-center items-center relative bg-white">
        
        {/* Top Circle */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '302px',
            height: '302px',
            background: 'linear-gradient(180deg, rgba(160, 0, 186, 0.67) 0%, rgba(255, 255, 255, 0.67) 100%)',
            top: '81px',
            left: '120px',
            zIndex: 1
          }}
        ></div>

        {/* Bottom Right Circle */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '220px',
            height: '220px',
            background: 'linear-gradient(180deg, rgba(160, 0, 186, 0.67) 0%, rgba(255, 255, 255, 0.67) 100%)',
            bottom: '50px',
            right: '180px',
            transform: 'rotate(110deg)',
            zIndex: 1
          }}
        ></div>

        {/* Translucent Glass Panel */}
        <div 
          className="relative z-10 rounded-2xl p-12 flex flex-col justify-center items-start"
          style={{
            width: '480px',
            height: '600px',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="w-full max-w-sm">
            <div className="text-left mb-8">
              <h2 className="text-3xl font-bold text-black mb-3">Login</h2>
              <p className="text-gray-600 text-base">Glad you're back.!</p>
            </div>

            {/* Error Display */}
            {(error || (urlError && urlError !== "refresh_failed")) && (
              <div className="w-full mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {urlError === "oauth_error" && "OAuth authentication failed. Please try again."}
                {urlError === "no_code" && "Authentication code not received. Please try again."}
                {urlError === "callback_error" && "Authentication callback error. Please try again."}
                {error && !urlError && error}
                {!urlError && !error && "An authentication error occurred. Please try again."}
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={login}
              disabled={isLoading}
              className="flex items-center justify-center text-white font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60 disabled:cursor-not-allowed mb-8"
              style={{
                width: '400px',
                height: '62px',
                borderRadius: '12px',
                gap: '10px',
                paddingTop: '14px',
                paddingRight: '10px',
                paddingBottom: '14px',
                paddingLeft: '10px',
                background: 'linear-gradient(90.57deg, #628EFF 9.91%, #8740CD 53.29%, #580475 91.56%)',
                border: 'none',
                opacity: 1
              }}
            >
              <div className="w-8 h-8 mr-3 flex items-center justify-center bg-white rounded-full overflow-hidden">
                <svg width="24" height="24" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v1.7h2.6c1.53-1.4 2.41-3.5 2.41-6.04 0-.83-.09-1.48-.18-2.7z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-1.7c-.69.46-1.58.73-2.7.73-2.08 0-3.84-1.4-4.48-3.29H1.83v1.76C3.15 15.1 5.83 17 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.8c-.16-.46-.25-.96-.25-1.48s.09-1.02.25-1.48V6.08H1.83c-.52 1.04-.83 2.21-.83 3.44s.31 2.4.83 3.44l2.67-1.76z"/>
                  <path fill="#EA4335" d="M8.98 4.25c1.17 0 2.23.4 3.06 1.2l2.3-2.3C13.94 1.19 11.7.25 8.98.25 5.83.25 3.15 2.15 1.83 5.69l2.67 1.76c.64-1.89 2.4-3.2 4.48-3.2z"/>
                </svg>
              </div>
              {isLoading ? "Signing in..." : "Login with Google"}
            </button>

            {/* Footer Links */}
            <div className="flex items-center justify-between text-sm text-gray-500 w-full">
              <a href="#" className="hover:text-gray-700 transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/use-auth";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    setUrlError(searchParams.get("error"));
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f5f7]">
      <div className="flex flex-col md:flex-row w-full max-w-[1400px] min-h-[90vh] rounded-3xl shadow-2xl overflow-hidden bg-white border border-gray-200 mx-4 my-8 relative">
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-center items-start p-16 bg-white min-w-[500px]">
          <h1 className="text-6xl font-bold text-black whitespace-nowrap mb-4">
            Welcome Back .!
          </h1>
          <div className="flex items-center w-full mb-6">
            <span className="inline-block border-2 border-black px-5 py-2 rounded-md font-semibold italic text-xl bg-white whitespace-nowrap mr-4">
              SST Internals
            </span>
            <div
              className="border-t border-dashed border-gray-400 flex-1 ml-2"
              style={{ minWidth: "60px" }}
            ></div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col justify-center items-center bg-transparent p-0 relative min-h-[700px]">
          {/* Glassmorphic Card with Gradient Circles */}
          <div className="relative w-full max-w-md h-[540px] flex items-center justify-center">
            <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full z-0"
              style={{
                background: "rgba(200, 132, 252, 0.35)",
                boxShadow: "0 0 120px 60px #c084fc55",
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                border: "1.5px solid rgba(168, 139, 250, 0.25)"
              }}
            ></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full z-0"
              style={{
                background: "rgba(200, 132, 252, 0.25)",
                boxShadow: "0 0 80px 40px #a78bfa55",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1.5px solid rgba(168, 139, 250, 0.18)"
              }}
            ></div>

            <div
              className="relative z-10 w-full h-full rounded-2xl shadow-xl flex flex-col items-center justify-center px-10 py-12"
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                border: "1px solid rgba(200,200,255,0.18)"
              }}
            >
              <h2 className="text-3xl font-bold mb-1 text-black w-full text-left">
                Login
              </h2>
              <p className="mb-6 text-black text-base w-full text-left">
                Glad you&apos;re back.!
              </p>
              {/* Error Display */}
              {urlError && (
                <div className="w-full mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm text-center font-medium">
                    {urlError === "oauth_error" &&
                      "OAuth authentication failed. Please try again."}
                    {urlError === "no_code" &&
                      "Authentication code not received. Please try again."}
                    {urlError === "refresh_failed" &&
                      "Please log in to continue."}
                    {urlError === "callback_error" &&
                      "Authentication callback error. Please try again."}
                    {urlError !== "oauth_error" && 
                     urlError !== "no_code" && 
                     urlError !== "refresh_failed" && 
                     urlError !== "callback_error" &&
                      "An authentication error occurred. Please try again."}
                  </p>
                </div>
              )}
              <div className="flex w-full justify-center mb-4">
                <button
                  onClick={login}
                  disabled={isLoading}
                  className="flex items-center justify-center w-[95%] py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ minHeight: "56px" }}
                >
                  <span className="w-10 h-10 mr-4 flex items-center justify-center bg-white rounded-full overflow-hidden">
                    <img
                      src="/google.png"
                      alt="Google"
                      width={32}
                      height={32}
                      style={{ objectFit: "contain" }}
                    />
                  </span>
                  <span className="text-lg font-medium">
                    Login with Google
                  </span>
                </button>
              </div>
              <div className="flex w-full justify-between gap-4 mt-4 text-sm text-gray-600">
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
                <a href="#" className="hover:underline">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export for easy importing
export default LoginForm;
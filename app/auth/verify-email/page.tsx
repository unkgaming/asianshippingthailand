"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email and try again.");
      return;
    }

    // Verify the token
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed. The link may have expired.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "verifying" && (
          <>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email...</h1>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                Your account is now active. You can sign in and start using Asian Shipping services.
              </p>
            </div>

            <Link
              href="/signin"
              className="inline-block bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Sign In Now
            </Link>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to Home
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                The verification link may have expired or been used already. Please try signing up again or contact support.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/signup"
                className="block bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Sign Up Again
              </Link>
              
              <Link
                href="/signin"
                className="block text-gray-600 hover:text-gray-900 font-medium px-6 py-2"
              >
                Try Signing In
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

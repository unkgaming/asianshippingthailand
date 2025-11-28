import Link from "next/link";
import { Suspense } from "react";

export default function VerifyPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyPendingContent />
    </Suspense>
  );
}

function VerifyPendingContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
        
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Next steps:</strong>
          </p>
          <ol className="text-sm text-blue-700 mt-2 text-left list-decimal list-inside space-y-1">
            <li>Open your email inbox</li>
            <li>Find the verification email from Asian Shipping</li>
            <li>Click the verification link</li>
            <li>Return here to sign in</li>
          </ol>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Didn't receive the email? Check your spam folder or contact support.
        </p>

        <Link
          href="/auth/signin"
          className="inline-block bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Back to Sign In
        </Link>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

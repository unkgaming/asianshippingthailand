"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg)]">
      <div className="bg-white p-8 rounded-lg shadow-soft max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-primary">Customer Login</h1>

        <button
          onClick={() => signIn("google")}
          className="w-full border py-3 rounded mb-3 hover:bg-gray-50"
        >
          Sign in with Google
        </button>

        <button
          onClick={() => signIn("line")}
          className="w-full bg-[#06C755] text-white py-3 rounded hover:bg-[#05b44d]"
        >
          Sign in with LINE
        </button>
      </div>
    </div>
  );
}

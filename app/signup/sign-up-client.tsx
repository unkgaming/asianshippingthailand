"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function SignUpClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [pwLabel, setPwLabel] = useState("Too short");

  const passwordStrength = (() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0-4
  })();

  useEffect(() => {
    const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
    setPwLabel(labels[passwordStrength]);
  }, [passwordStrength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, company })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Registration failed");
      setSuccess(true);
      await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-orange-500 to-red-800 p-6">
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-0 md:flex overflow-hidden ring-1 ring-white/40">
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="hidden md:flex w-1/2 bg-gradient-to-br from-red-700 to-red-500 text-white flex-col justify-between p-8 relative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-3xl font-bold mb-4">Join Asian Shipping</h2>
            <p className="text-white/90 mb-6">Create an account to manage global logistics, track shipments, and streamline operations.</p>
            <ul className="space-y-4 text-sm">
              {[
                { icon: '🌍', text: 'Access worldwide port network' },
                { icon: '📦', text: 'Real-time tracking dashboard' },
                { icon: '🔐', text: 'Enterprise-grade data security' },
                { icon: '⚡', text: 'Optimized shipping workflows' },
              ].map((f, i) => (
                <motion.li key={f.text} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.1 }} className="flex gap-3">
                  <span>{f.icon}</span><span>{f.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-white/70">© {new Date().getFullYear()} Asian Shipping</motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={{ delay: 0.8 }} className="absolute -bottom-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        </motion.div>
        <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="w-full md:w-1/2 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-600 text-sm">Set up your shipping workspace</p>
        </div>
        {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{error}</div>}
        {success && <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">Account created! Redirecting...</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9+-.() ]{6,}"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="+66 1234 5678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Company Ltd."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="At least 8 characters"
            />
            <div className="mt-2 flex items-center gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-2 flex-1 rounded transition ${passwordStrength >= i ? ['bg-red-600','bg-orange-500','bg-yellow-500','bg-green-500'][passwordStrength-1] : 'bg-gray-200'}`}></div>
              ))}
              <span className="text-xs text-gray-600 font-medium">{pwLabel}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="Re-enter password"
            />
            {confirm && confirm !== password && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link href="/auth/login" className="text-red-600 font-semibold hover:text-red-700">Login</Link>
        </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

import Link from "next/link";
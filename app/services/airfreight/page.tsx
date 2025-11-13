"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AirfreightPage() {
  const features = [
    { icon: "⚡", title: "Express & Economy", desc: "Next-flight-out, express, and deferred options to fit your budget and timeline." },
    { icon: "📡", title: "Live Tracking", desc: "Real-time milestone updates from pickup to delivery with proactive alerts." },
    { icon: "🧾", title: "Customs Clearance", desc: "End-to-end documentation and brokerage to keep things moving at the border." },
    { icon: "🚪", title: "Door-to-Door", desc: "Pickup, linehaul, and last-mile arranged seamlessly by our team." },
  ];

  const commodities = [
    "Electronics & Components",
    "Apparel & Textiles",
    "Automotive Parts",
    "Medical & Pharma",
    "Perishables & Beverages",
    "Industrial Tools & Machinery",
    "Documents & High-Value Items",
  ];

  const transit = [
    { lane: "Asia ➜ USA/EU", time: "2 - 5 days", note: "Direct & consolidated services" },
    { lane: "Intra-Asia", time: "1 - 3 days", note: "High frequency departures" },
    { lane: "Asia ➜ Middle East", time: "2 - 4 days", note: "Strong hub connectivity" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80" alt="Airfreight" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-gray-300 mb-2"><Link href="/services" className="hover:underline">Services</Link> / Airfreight</p>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">Airfreight Services</h1>
              <p className="text-lg md:text-2xl text-gray-200 max-w-2xl">Fast, reliable air cargo solutions with full visibility and expert customs handling.</p>
              <div className="mt-8 flex gap-4">
                <Link href="/contact" className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition">Request Quote</Link>
                <Link href="#features" className="bg-white/10 backdrop-blur text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition">Explore Features</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">Why ship by air with us</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: text */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Service Options</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We offer flexible service profiles: Next-Flight-Out, Express, Standard, and Deferred. Whether you
                prioritize speed or cost, our team will plan the optimal routing and carrier mix for your cargo.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pickup, consolidation, airline booking, and last-mile delivery</li>
                <li>Dangerous goods handling and documentation support</li>
                <li>Temperature-controlled options upon request</li>
                <li>Insurance coverage and Proof of Delivery (POD)</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-3">What we handle</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commodities.map((c, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-red-600">✓</span>
                  <span className="text-gray-700">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: transit times */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Typical Transit Times</h3>
            <div className="space-y-4">
              {transit.map((t, i) => (
                <div key={i} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">{t.lane}</p>
                    <span className="text-red-600 font-bold">{t.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{t.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-500">Note: Transit times are estimates and may vary by carrier and season.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-4">Ready to move your cargo?</motion.h3>
          <p className="text-lg opacity-90 mb-8">Tell us about your shipment and get a fast, accurate airfreight quote.</p>
          <Link href="/contact" className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">Request Airfreight Quote</Link>
        </div>
      </section>
    </div>
  );
}

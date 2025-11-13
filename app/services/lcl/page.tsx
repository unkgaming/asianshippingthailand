"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LCLPage() {
  const features = [
    { icon: "🤝", title: "Shared Space, Lower Cost", desc: "Pay only for the space you use with reliable weekly consolidation." },
    { icon: "📦", title: "Secure Consolidation", desc: "Careful handling at origin CFS with clear labeling and packing standards." },
    { icon: "🗺️", title: "Extensive Lanes", desc: "Strong coverage across Asia, Europe, Americas, and Middle East." },
    { icon: "📈", title: "Predictable Schedules", desc: "Regular cut-offs and sailings to plan production and delivery." },
  ];

  const steps = [
    { step: 1, title: "Cargo Receipt at CFS", note: "Deliver cargo to our consolidation warehouse (CFS) before cut-off." },
    { step: 2, title: "Stuffing & Documentation", note: "We sort, label, and stuff consolidated containers; documents verified." },
    { step: 3, title: "Sailing & Deconsolidation", note: "Container sails to destination; we deconsolidate at destination CFS." },
    { step: 4, title: "Pickup / Delivery", note: "Collect cargo or arrange last-mile to your door." },
  ];

  const transit = [
    { lane: "Asia ➜ USA/EU", time: "25 - 40 days", note: "Varies by lane and consolidation hub" },
    { lane: "Intra-Asia", time: "8 - 18 days", note: "Frequent feeder services" },
    { lane: "Asia ➜ Middle East", time: "14 - 25 days", note: "Strong hub connectivity" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80" alt="LCL" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-gray-300 mb-2"><Link href="/services" className="hover:underline">Services</Link> / Seafreight - LCL</p>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">LCL (Less than Container)</h1>
              <p className="text-lg md:text-2xl text-gray-200 max-w-2xl">Cost-effective ocean freight for smaller loads with dependable weekly schedules.</p>
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
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">Why ship LCL with us</motion.h2>
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

      {/* Flow + Transit */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">How LCL Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((s) => (
                <div key={s.step} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="font-semibold text-gray-800">Step {s.step}: {s.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{s.note}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-3">Included Services</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Origin CFS handling and export documentation</li>
              <li>Consolidation and destination deconsolidation</li>
              <li>Customs clearance options and delivery coordination</li>
              <li>Tracking visibility and POD</li>
            </ul>
          </div>

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
            <div className="mt-6 text-sm text-gray-500">Note: Transit varies by consolidation hub, carrier, and season.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-4">Get an LCL quote</motion.h3>
          <p className="text-lg opacity-90 mb-8">Tell us your cargo details and origin/destination to get started.</p>
          <Link href="/contact" className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">Request LCL Quote</Link>
        </div>
      </section>
    </div>
  );
}

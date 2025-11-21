"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from '@/contexts/LanguageContext';

export default function LCLPage() {
  const { t } = useLanguage();
  const features = [
    { icon: "🤝", title: t('lcl.sharedSpace'), desc: t('lcl.sharedSpaceDesc') },
    { icon: "📦", title: t('lcl.secureConsolidation'), desc: t('lcl.secureConsolidationDesc') },
    { icon: "🗺️", title: t('lcl.extensiveLanes'), desc: t('lcl.extensiveLanesDesc') },
    { icon: "📈", title: t('lcl.predictableSchedules'), desc: t('lcl.predictableSchedulesDesc') },
  ];

  const steps = [
    { step: 1, title: t('lcl.step1Title'), note: t('lcl.step1Note') },
    { step: 2, title: t('lcl.step2Title'), note: t('lcl.step2Note') },
    { step: 3, title: t('lcl.step3Title'), note: t('lcl.step3Note') },
    { step: 4, title: t('lcl.step4Title'), note: t('lcl.step4Note') },
  ];

  const transit = [
    { lane: t('lcl.asiaUSAEU'), time: t('lcl.asiaUSAEUTime'), note: t('lcl.asiaUSAEUNote') },
    { lane: t('lcl.intraAsia'), time: t('lcl.intraAsiaTime'), note: t('lcl.intraAsiaNote') },
    { lane: t('lcl.asiaMiddleEast'), time: t('lcl.asiaMiddleEastTime'), note: t('lcl.asiaMiddleEastNote') },
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
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">{t('lcl.title')}</h1>
              <p className="text-lg md:text-2xl text-gray-200 max-w-2xl">{t('lcl.subtitle')}</p>
              <div className="mt-8 flex gap-4">
                <Link href="/contact" className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition">{t('servicesPage.contactUs')}</Link>
                <Link href="#features" className="bg-white/10 backdrop-blur text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition">{t('servicesPage.exploreFeat')}</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">{t('lcl.whyShipLCL')}</motion.h2>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{t('lcl.howItWorks')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((s) => (
                <div key={s.step} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="font-semibold text-gray-800">{t('lcl.step')}{s.step}: {s.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{s.note}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-10 mb-3">{t('lcl.includedServices')}</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{t('lcl.service1')}</li>
              <li>{t('lcl.service2')}</li>
              <li>{t('lcl.service3')}</li>
              <li>{t('lcl.service4')}</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('lcl.transitTimes')}</h3>
            <div className="space-y-4">
              {transit.map((tr, i) => (
                <div key={i} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">{tr.lane}</p>
                    <span className="text-red-600 font-bold">{tr.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{tr.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-sm text-gray-500">{t('lcl.transitNote')}</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold mb-4">{t('lcl.contactForLCL')}</motion.h3>
          <p className="text-lg opacity-90 mb-8">{t('lcl.tellUsCargo')}</p>
          <Link href="/contact" className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">{t('servicesPage.contactUs')}</Link>
        </div>
      </section>
    </div>
  );
}

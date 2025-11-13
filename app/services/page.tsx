'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState(0);

  const services = [
    {
      icon: String.fromCodePoint(0x2708, 0xFE0F),
      title: 'Airfreight Services',
      subtitle: 'Fast & Reliable Air Cargo',
      description: 'We deliver cargo worldwide with speed and precision through our extensive network of air carriers.',
      features: ['Express Delivery', 'Real-time Tracking', 'Customs Clearance', 'Door-to-Door Service'],
      regions: ['Europe', 'USA & Canada', 'Middle East', 'South Asia', 'South East Asia', 'Americas'],
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
      link: '/services/airfreight'
    },
    {
      icon: String.fromCodePoint(0x1F6A2),
      title: 'Seafreight Services: FCL',
      subtitle: 'Full Container Load',
      description: 'Full-container shipping service for large-scale sea freight with flexible options.',
      features: ['20ft & 40ft Containers', 'Competitive Rates', 'Global Network', 'Dedicated Support'],
      regions: ['Europe', 'Middle East', 'Asia Pacific', 'Americas'],
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
      link: '/services/fcl'
    },
    {
      icon: String.fromCodePoint(0x1F4E6),
      title: 'Seafreight Services: LCL',
      subtitle: 'Less Than Container Load',
      description: 'Cost-effective sea freight solution perfect for smaller shipments.',
      features: ['Cost-Effective', 'Flexible Scheduling', 'Consolidation', 'Weekly Departures'],
      regions: ['Europe', 'Asia', 'Americas', 'Middle East', 'Africa', 'Oceania'],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
      link: '/services/lcl'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1920&q=80" alt="Logistics" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Our Services</h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">Professional freight forwarding solutions</p>
              <div className="flex gap-4">
                <Link href="/contact" className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition">Request Quote</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {services.map((service, index) => (
              <button key={index} onClick={() => setActiveTab(index)} className={`px-8 py-4 rounded-lg font-semibold ${activeTab === index ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                <span className="text-2xl mr-2">{service.icon}</span>{service.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {services.map((service, index) => activeTab === index ? (
              <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-[400px] lg:h-auto">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-12">
                    <h4 className="text-2xl font-bold mb-4">{service.subtitle}</h4>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {service.features.map((f, i) => (<div key={i} className="flex items-center gap-2"><span></span>{f}</div>))}
                    </div>
                    <Link href={service.link} className="bg-red-600 text-white px-6 py-3 rounded-lg inline-block">Learn More</Link>
                  </div>
                </div>
              </motion.div>
            ) : null)}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

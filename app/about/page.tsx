'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { number: '23+', label: 'Years Experience' },
    { number: '50+', label: 'Countries Served' },
    { number: '10K+', label: 'Shipments/Year' },
    { number: '99.5%', label: 'On-Time Delivery' },
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Reliability',
      description: 'We deliver on our promises with consistent, dependable service you can count on.'
    },
    {
      icon: '⚡',
      title: 'Speed',
      description: 'Fast processing and transit times to keep your business moving forward.'
    },
    {
      icon: '🔒',
      title: 'Security',
      description: 'Your cargo is protected with comprehensive insurance and secure handling.'
    },
    {
      icon: '🤝',
      title: 'Partnership',
      description: 'We work as your logistics partner, not just a service provider.'
    },
  ];

  // Team section removed - to be added with actual team members

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About asianshippingthai
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Connecting the world through reliable, efficient logistics solutions since 2002.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2000, asianshippingthai began with a simple mission: to make international
                  shipping accessible and reliable for businesses of all sizes. What started as
                  a small freight forwarding operation in Bangkok has grown into a global
                  logistics powerhouse.
                </p>
                <p>
                  Today, we serve over 150 countries with a comprehensive suite of air, sea,
                  and ground transportation services. Our network of trusted partners and
                  state-of-the-art tracking technology ensures your cargo arrives safely and
                  on time, every time.
                </p>
                <p>
                  We're not just moving boxes—we're connecting businesses, enabling growth,
                  and helping our clients succeed in the global marketplace.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-gradient-to-br from-red-100 to-blue-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🌏</div>
                  <p className="text-xl font-semibold text-gray-700">Global Logistics Network</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications & Memberships Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Certifications & Memberships
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted, certified, and qualified to serve you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Certifications */}
            <motion.div
              className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🏆</span>
                <h3 className="text-2xl font-bold text-gray-800">Certifications</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="font-semibold text-gray-800">Member of Shipping Associated</p>
                    <p className="text-sm text-gray-600">Since September 24, 2002</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="font-semibold text-gray-800">Logistics Development</p>
                    <p className="text-sm text-gray-600">Since February 10, 2012</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="font-semibold text-gray-800">ISO 2001-2014</p>
                    <p className="text-sm text-gray-600">Certified 2014</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="font-semibold text-gray-800">Department of Business Development</p>
                    <p className="text-sm text-gray-600">October 12, 2009</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="font-semibold text-gray-800">Department of Business Development</p>
                    <p className="text-sm text-gray-600">October 9, 2009</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="font-semibold text-gray-800">Department of Business Development</p>
                    <p className="text-sm text-gray-600">September 17, 2014</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Specialized Services */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Customs Brokerage */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">📋</span>
                  <h3 className="text-2xl font-bold text-gray-800">Customs Brokerage</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Asian Shipping (Thailand) Co., Ltd. is also a qualified customs broker in Thailand. 
                  We are specialized in clearing both general cargo and dangerous cargo. One day delivery 
                  for import shipments and one day declaration for export.
                </p>
                <div className="bg-red-600 text-white px-4 py-3 rounded-lg font-semibold text-center">
                  "FAST & RELIABLE DECLARATION IS OUR MISSION"
                </div>
              </div>

              {/* Door to Door Services */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🚚</span>
                  <h3 className="text-2xl font-bold text-gray-800">Door to Door Services & Inland Transportation</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Due to our best performance in customs brokerage, we are trusted to be the fastest 
                  door to door service provider in Thailand among local forwarders. Asian guarantees 
                  a one day delivery to all customers in Thailand.
                </p>
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <span className="text-2xl">⚡</span>
                  <span>One Day Delivery Guarantee in Thailand</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Ship with Us?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses that trust asianshippingthai for their shipping needs
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="/services"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

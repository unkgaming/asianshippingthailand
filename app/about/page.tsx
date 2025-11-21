'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  
  const stats = [
    { number: '23+', label: t('about.yearsExp') },
    { number: 'Asia', label: t('about.regionalFocus') },
    { number: 'Fast', label: t('about.fastCustoms') },
    { number: '1 Day', label: t('about.deliveryGuarantee') },
  ];

  const values = [
    {
      icon: '🎯',
      title: t('about.reliability'),
      description: t('about.reliabilityDesc')
    },
    {
      icon: '⚡',
      title: t('about.speed'),
      description: t('about.speedDesc')
    },
    {
      icon: '🔒',
      title: t('about.security'),
      description: t('about.securityDesc')
    },
    {
      icon: '🤝',
      title: t('about.partnership'),
      description: t('about.partnershipDesc')
    },
  ];

  const team = [
    {
      name: 'Nattarin Niramitsupachet',
      position: 'Managing Director',
      responsibilities: 'Company leadership, partnerships, service quality',
      email: 'annz@asianshippingthai.com'
    },
    {
      name: 'Ms. Parnravee Bangnachart',
      position: 'Import Manager',
      responsibilities: 'Import operations, inbound customs, coordination',
      email: 'parnravee@asianshippingthai.com'
    },
    {
      name: 'Ms. Pawarasa (Pawarisa) Chaicharn',
      position: 'CS Export',
      responsibilities: 'Export shipments, outbound documents',
      email: 'pawarisa@asianshippingthai.com'
    },
    {
      name: 'Ms. Natcha Noitamto',
      position: 'Accounting',
      responsibilities: 'Billing, invoices, financial control',
      email: 'natcha@asainshippingthai.com'
    },
    {
      name: 'Nattalee Ruangpet',
      position: 'Chinese Interpreter',
      responsibilities: 'Chinese communication, supplier coordination',
      email: null
    },
  ];

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
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              {t('about.subtitle')}
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
                {t('about.ourStory')}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {t('about.storyP1')}
                </p>
                <p>
                  {t('about.storyP2')}
                </p>
                <p>
                  {t('about.storyP3')}
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
              {t('about.certificationsTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.certificationsSubtitle')}
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
                <h3 className="text-2xl font-bold text-gray-800">{t('about.certifications')}</h3>
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
                  <h3 className="text-2xl font-bold text-gray-800">{t('about.customsBrokerage')}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('about.customsDesc')}
                </p>
                <div className="bg-red-600 text-white px-4 py-3 rounded-lg font-semibold text-center">
                  "{t('about.customsMission')}"
                </div>
              </div>

              {/* Door to Door Services */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🚚</span>
                  <h3 className="text-2xl font-bold text-gray-800">{t('about.doorToDoor')}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('about.doorToDoorDesc')}
                </p>
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <span className="text-2xl">⚡</span>
                  <span>{t('about.oneDayGuarantee')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('about.meetTeam')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.teamSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-red-600 font-semibold mb-3">
                    {member.position}
                  </p>
                </div>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  {member.responsibilities}
                </p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="block text-center text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    {member.email}
                  </a>
                )}
              </motion.div>
            ))}
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
              {t('about.coreValues')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('about.valuesSubtitle')}
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
              {t('about.readyToShip')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('about.joinBusiness')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                {t('about.getStarted')}
              </Link>
              <Link
                href="/services"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition"
              >
                {t('about.viewServices')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

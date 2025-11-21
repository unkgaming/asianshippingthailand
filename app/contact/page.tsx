'use client';

import { motion } from 'framer-motion';
import SimpleContactForm from '@/components/SimpleContactForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('contact.getInTouch')}
          </motion.h1>
          <motion.p
            className="text-xl opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t('contact.helpLogistics')}
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SimpleContactForm />
            </motion.div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Asian Shipping Office Info */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-red-700 mb-2">CONTACT US : ASIAN SHIPPING OFFICE</h3>
              <div className="text-gray-800 font-semibold mb-1">ASIAN SHIPPING (THAILAND) CO.,LTD.</div>
              <div className="text-gray-600 mb-2">
                444 Port Authority Buiding, B. bldg., Room no.5/11,5th Floor Tarua,Road, Klongtoey, Bangkok 10110, Thailand.<br />
                TEL : <a href="tel:+6622493889" className="hover:text-red-600">+6622493889 (auto)</a><br />
                FAX : +6622493778<br />
                CELL PHONE NO. : <a href="tel:+66832947428" className="hover:text-red-600">+66832947428</a><br />
                E-MAIL : <a href="mailto:asian@asianshippingthai.com" className="hover:text-red-600">asian@asianshippingthai.com</a> (main)<br />
                <span className="font-semibold">FOR MORE INFORMATION, PLEASE CONTACT US AS BELOW.</span>
              </div>
              <div className="text-gray-800 font-bold mt-2">MANAGING DIRECTOR</div>
              <div className="text-gray-600 mb-2">
                Mrs. Nattarin Niramitsuphachet<br />
                E-mail : <a href="mailto:annz@asianshippingthai.com" className="hover:text-red-600">annz@asianshippingthai.com</a><br />
                Tel : +662 249 3889 ext.17<br />
                Mobile Phone : <a href="tel:+66991682939" className="hover:text-red-600">+6699 168 2939</a>
              </div>
              <div className="text-gray-800 font-bold mt-2">CS IMPORT</div>
              <div className="text-gray-600 mb-2">
                E-mail : <a href="mailto:import@asianshippingthai.com" className="hover:text-red-600">import@asianshippingthai.com</a><br />
                Tel : +662 249 3889 ext. 20 / 19
              </div>
              <div className="text-gray-800 font-bold mt-2">CS EXPORT</div>
              <div className="text-gray-600 mb-2">
                E-mail : <a href="mailto:export@asianshippingthai.com" className="hover:text-red-600">export@asianshippingthai.com</a><br />
                Tel : +662 249 3889 ext.12 / 17
              </div>
              <div className="text-gray-800 font-bold mt-2">MARKETING MANAGER</div>
              <div className="text-gray-600 mb-2">
                E-mail : <a href="mailto:marketingmanager@asianshippingthai.com" className="hover:text-red-600">marketingmanager@asianshippingthai.com</a><br />
                Tel : +662 249 3889 ext.13
              </div>
              <div className="text-gray-800 font-bold mt-2">SALE-CO</div>
              <div className="text-gray-600 mb-2">
                E-mail : <a href="mailto:sale-co@asianshippingthai.com" className="hover:text-red-600">sale-co@asianshippingthai.com</a><br />
                Tel : +662 249 3889 ext.16
              </div>
              <div className="text-gray-800 font-bold mt-2">ACCOUNTING</div>
              <div className="text-gray-600 mb-2">
                E-mail : <a href="mailto:accounting@asianshippingthai.com" className="hover:text-red-600">accounting@asianshippingthai.com</a><br />
                Tel : +662 249 3889 ext.11
              </div>
              <div className="text-gray-800 font-bold mt-2">OVERSEA</div>
              <div className="text-gray-600 mb-2">
                E-mail : <a href="mailto:oversea@asianshippingthai.com" className="hover:text-red-600">oversea@asianshippingthai.com</a><br />
                Tel : +662 249 3889 ext.18
              </div>
              <div className="text-gray-800 font-bold mt-2">Overall Information</div>
              <div className="text-gray-600 mb-2">
                E-mail : <a href="mailto:info@asianshippingthai.com" className="hover:text-red-600">info@asianshippingthai.com</a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

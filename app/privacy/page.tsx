'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xl opacity-90">
              Last updated: November 18, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">1. Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Asian Shipping (Thailand) Co., Ltd. ("asianshippingthai," "we," "us," or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">2.1 Personal Information</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Register for an account</li>
                  <li>Request a quote or shipping services</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us through our website</li>
                  <li>Use our shipment tracking system</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  This information may include: name, email address, phone number, company name, shipping address, billing information, and shipment details.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">2.2 Automatically Collected Information</h3>
                <p className="text-gray-600 leading-relaxed">
                  When you visit our website, we may automatically collect certain information about your device, including IP address, browser type, operating system, access times, and pages viewed.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Process and fulfill your shipping requests</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send you service updates and notifications about your shipments</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations and customs requirements</li>
                  <li>Detect and prevent fraud or unauthorized activities</li>
                  <li>Send promotional materials (with your consent)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> Third-party companies that help us operate our business (e.g., carriers, customs brokers, payment processors)</li>
                  <li><strong>Government Authorities:</strong> When required by law, including customs and regulatory agencies</li>
                  <li><strong>Business Partners:</strong> Shipping lines, airlines, and logistics partners necessary to fulfill your shipments</li>
                  <li><strong>Legal Requirements:</strong> To comply with legal processes or protect our rights</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">5. Data Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">6. Data Retention</h2>
                <p className="text-gray-600 leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Shipment records are typically retained for 7 years in accordance with Thai customs regulations.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">7. Your Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to processing of your information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent (where processing is based on consent)</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  To exercise these rights, please contact us at asian@asianshippingthai.com
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">8. Cookies and Tracking Technologies</h2>
                <p className="text-gray-600 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our website may not function properly without cookies.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">9. Third-Party Links</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">10. Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">11. International Data Transfers</h2>
                <p className="text-gray-600 leading-relaxed">
                  Your information may be transferred to and maintained on servers located outside of Thailand. By using our services, you consent to the transfer of your information to countries that may have different data protection laws.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">13. Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-800 font-semibold mb-2">Asian Shipping (Thailand) Co., Ltd.</p>
                  <p className="text-gray-600">444 Port Authority Building, Room 5/11, 5th Floor</p>
                  <p className="text-gray-600">Khlong Toei, Khlong Toei, Bangkok 10110</p>
                  <p className="text-gray-600 mt-3">
                    <strong>Email:</strong> asian@asianshippingthai.com
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> +66 2 249 3889
                  </p>
                  <p className="text-gray-600">
                    <strong>Fax:</strong> +66 2 249 3778
                  </p>
                </div>
              </div>

              <div className="border-t pt-8 mt-8">
                <p className="text-gray-500 text-sm">
                  By using our website and services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

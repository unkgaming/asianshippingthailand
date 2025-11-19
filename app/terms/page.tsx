'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
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
              Terms of Service
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
                <h2 className="text-3xl font-bold text-gray-800 mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms of Service ("Terms") constitute a legally binding agreement between you and Asian Shipping (Thailand) Co., Ltd. ("asianshippingthai," "we," "us," or "our") concerning your access to and use of our website and shipping services. By using our services, you agree to be bound by these Terms.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">2. Services Description</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Asian Shipping provides international freight forwarding and logistics services, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Ocean freight (FCL and LCL)</li>
                  <li>Air freight services</li>
                  <li>Customs brokerage and clearance</li>
                  <li>Door-to-door delivery</li>
                  <li>Shipment tracking and monitoring</li>
                  <li>Documentation and compliance services</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">3. User Accounts</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">3.1 Account Registration</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To access certain features of our services, you may need to create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">3.2 Account Termination</h3>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our discretion.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">4. Shipping Terms and Conditions</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">4.1 Booking and Acceptance</h3>
                <p className="text-gray-600 leading-relaxed">
                  All shipment bookings are subject to availability and acceptance by Asian Shipping. We reserve the right to refuse service for any shipment that does not comply with applicable laws, regulations, or our policies.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">4.2 Prohibited Items</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You agree not to ship any of the following items:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Illegal substances or contraband</li>
                  <li>Hazardous materials (unless properly declared and authorized)</li>
                  <li>Weapons, ammunition, or explosives (without proper permits)</li>
                  <li>Counterfeit goods or items that infringe intellectual property rights</li>
                  <li>Perishable goods (without prior arrangement)</li>
                  <li>Live animals (except where specifically permitted)</li>
                  <li>Any items prohibited by international or local laws</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">4.3 Accurate Declarations</h3>
                <p className="text-gray-600 leading-relaxed">
                  You are responsible for providing accurate and complete information about your shipment, including contents, value, weight, and dimensions. Misrepresentation may result in delays, fines, seizure of goods, or legal consequences.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">4.4 Customs and Duties</h3>
                <p className="text-gray-600 leading-relaxed">
                  You are responsible for all customs duties, taxes, and fees associated with your shipment. We will assist with customs clearance but cannot guarantee exemption from duties or taxes.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">5. Pricing and Payment</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">5.1 Rates and Quotes</h3>
                <p className="text-gray-600 leading-relaxed">
                  All rates quoted are estimates based on the information provided. Final charges may vary based on actual weight, dimensions, routing, and additional services required. We reserve the right to adjust pricing for changes in fuel costs, currency exchange rates, or carrier fees.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">5.2 Payment Terms</h3>
                <p className="text-gray-600 leading-relaxed">
                  Payment is due as specified in your service agreement. Late payments may incur interest charges and may result in suspension of services. We reserve the right to hold shipments until payment is received in full.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">5.3 Additional Charges</h3>
                <p className="text-gray-600 leading-relaxed">
                  Additional charges may apply for special handling, storage, detention, demurrage, re-routing, or other circumstances beyond the original quote.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">6. Liability and Insurance</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">6.1 Limitation of Liability</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our liability is limited to the actual loss or damage proven, subject to the maximum liability limits set forth by applicable international conventions (such as the Hague-Visby Rules for ocean freight or the Warsaw/Montreal Convention for air freight), unless additional insurance is purchased.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">6.2 Insurance</h3>
                <p className="text-gray-600 leading-relaxed">
                  We strongly recommend purchasing cargo insurance for your shipment. If you decline insurance, you accept the risk of loss or damage subject to carrier liability limits. Insurance must be arranged at the time of booking.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">6.3 Claims</h3>
                <p className="text-gray-600 leading-relaxed">
                  Claims for loss or damage must be submitted in writing within 7 days of delivery (or expected delivery date for lost shipments). Claims must include supporting documentation such as commercial invoices, packing lists, and proof of value.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">6.4 Exclusions</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We are not liable for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>Loss or damage due to improper packaging</li>
                  <li>Inherent defects or nature of the goods</li>
                  <li>Acts of God, war, terrorism, or force majeure events</li>
                  <li>Customs seizure or delays</li>
                  <li>Consequential, indirect, or special damages</li>
                  <li>Loss of profits or business opportunities</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">7. Delivery and Transit Times</h2>
                <p className="text-gray-600 leading-relaxed">
                  Transit times provided are estimates only and are not guaranteed. We are not liable for delays caused by customs, carriers, weather, strikes, or other circumstances beyond our reasonable control.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">8. Lien Rights</h2>
                <p className="text-gray-600 leading-relaxed">
                  We retain a lien on all goods in our possession until all charges and fees are paid in full. We may exercise our right to sell goods to satisfy unpaid charges after proper notice.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">9. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content on our website, including text, graphics, logos, images, and software, is the property of Asian Shipping or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">10. Indemnification</h2>
                <p className="text-gray-600 leading-relaxed">
                  You agree to indemnify and hold harmless Asian Shipping, its officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-4">
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any laws or regulations</li>
                  <li>Misrepresentation of shipment contents</li>
                  <li>Shipping of prohibited items</li>
                  <li>Your negligence or willful misconduct</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">11. Dispute Resolution</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">11.1 Governing Law</h3>
                <p className="text-gray-600 leading-relaxed">
                  These Terms are governed by the laws of Thailand, without regard to conflict of law principles.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">11.2 Jurisdiction</h3>
                <p className="text-gray-600 leading-relaxed">
                  Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts of Bangkok, Thailand.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">11.3 Arbitration</h3>
                <p className="text-gray-600 leading-relaxed">
                  At our discretion, disputes may be resolved through binding arbitration in accordance with the rules of the Thai Arbitration Institute.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">12. Force Majeure</h2>
                <p className="text-gray-600 leading-relaxed">
                  We are not liable for failure to perform our obligations due to causes beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, strikes, government actions, pandemics, or carrier failures.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">13. Severability</h2>
                <p className="text-gray-600 leading-relaxed">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">14. Modifications to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes constitutes acceptance of the modified Terms.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">15. Entire Agreement</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms, together with our Privacy Policy and any service-specific agreements, constitute the entire agreement between you and Asian Shipping regarding our services.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">16. Contact Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  For questions about these Terms, please contact us:
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
                  By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'airfreight',
    sendTo: '', // Department/email to send to
    // New fields
    productType: '',
    weight: '',
    weightUnit: 'kg',
    message: '',
  });
  const [sendToOptions, setSendToOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ productType?: string; weight?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Fetch available email addresses on mount
  useEffect(() => {
    fetch('/api/emails?options=1')
      .then(r => r.json())
      .then(res => {
        if (res?.fromOptions?.length) {
          setSendToOptions(res.fromOptions);
          setFormData(prev => ({ ...prev, sendTo: res.fromOptions[0] }));
        }
      })
      .catch(() => {});
  }, []);

  // Derived UI helper: show converted weight hint
  const convertedWeight = (() => {
    const w = parseFloat(formData.weight);
    if (isNaN(w) || w <= 0) return '';
    if (formData.weightUnit === 'kg') {
      const lb = w * 2.20462;
      return `≈ ${lb.toFixed(2)} lb`;
    } else {
      const kg = w / 2.20462;
      return `≈ ${kg.toFixed(2)} kg`;
    }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation for new fields
    const newErrors: { productType?: string; weight?: string } = {};
    if (!formData.productType) newErrors.productType = 'Please select a product type.';
    const weightVal = parseFloat(formData.weight);
    if (!formData.weight || isNaN(weightVal) || weightVal <= 0) {
      newErrors.weight = 'Please enter a valid weight greater than 0.';
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
        }),
      });

      const json = await res.json().catch(() => ({ ok: false, error: 'Unexpected server response' }));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || 'Failed to send your message. Please try again.');
      }

      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: 'airfreight',
          sendTo: sendToOptions[0] || '',
          productType: '',
          weight: '',
          weightUnit: 'kg',
          message: '',
        });
        setErrors({});
      }, 3000);
    } catch (err: any) {
      setServerError(err?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field-level errors as user fixes input
    if (name === 'productType' && value) setErrors(prev => ({ ...prev, productType: undefined }));
    if (name === 'weight' && parseFloat(value) > 0) setErrors(prev => ({ ...prev, weight: undefined }));
  };

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
            Get In Touch
          </motion.h1>
          <motion.p
            className="text-xl opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            We're here to help with all your logistics needs
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>

              {/* Tip banner */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-white border border-red-100">
                <p className="text-sm text-red-700 font-medium">
                  Pro tip: include product type and estimated total weight for a faster, more accurate quote.
                </p>
              </div>

              {serverError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  {serverError}
                </div>
              )}

              {submitted ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Interested In *
                      </label>
                      <select
                        name="service"
                        required
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      >
                        <option value="airfreight">Airfreight Services</option>
                        <option value="fcl">Seafreight - FCL</option>
                        <option value="lcl">Seafreight - LCL</option>
                        <option value="tracking">Tracking & Monitoring</option>
                        <option value="other">Other Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Send To *
                      </label>
                      <select
                        name="sendTo"
                        required
                        value={formData.sendTo}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                      >
                        {sendToOptions.length === 0 && (
                          <option value="">Loading...</option>
                        )}
                        {sendToOptions.map((email) => (
                          <option key={email} value={email}>
                            {email.includes('sales') ? '💼 Sales' : 
                             email.includes('quotes') ? '📋 Quotes' : 
                             email.includes('support') ? '🛠️ Support' : 
                             email}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">Choose the department that best matches your inquiry.</p>
                    </div>
                  </div>

                  {/* Shipment Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-600 text-xl">📦</span>
                      <h3 className="text-lg font-semibold text-gray-800">Shipment Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type
                      </label>
                      <select
                        name="productType"
                        required
                        value={formData.productType}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${errors.productType ? 'border-red-500' : 'border-gray-300'}`}
                        aria-invalid={!!errors.productType}
                      >
                        <option value="">Select a product category</option>
                        <optgroup label="Electronics & Fragile">
                          <option value="electronics">Consumer Electronics</option>
                          <option value="components">Electronic Components</option>
                          <option value="instruments">Instruments & Optics</option>
                        </optgroup>
                        <optgroup label="Apparel & Textiles">
                          <option value="apparel">Apparel</option>
                          <option value="textiles">Textiles & Fabrics</option>
                          <option value="footwear">Footwear</option>
                        </optgroup>
                        <optgroup label="Food & Perishables">
                          <option value="dry-food">Dry Food</option>
                          <option value="perishables">Perishables (Chilled/Frozen)</option>
                          <option value="beverage">Beverages</option>
                        </optgroup>
                        <optgroup label="Furniture & Oversized">
                          <option value="furniture">Furniture</option>
                          <option value="fixtures">Fixtures</option>
                        </optgroup>
                        <optgroup label="Machinery & Industrial">
                          <option value="machinery">Machinery</option>
                          <option value="industrial">Industrial Equipment</option>
                          <option value="tools">Tools</option>
                        </optgroup>
                        <optgroup label="Chemicals & Hazmat">
                          <option value="chemicals">Chemicals (Non-Hazmat)</option>
                          <option value="hazmat">Hazardous Materials</option>
                        </optgroup>
                        <optgroup label="Documents & Media">
                          <option value="documents">Documents</option>
                          <option value="media">Media & Books</option>
                        </optgroup>
                        <optgroup label="Automotive & Parts">
                          <option value="automotive">Automotive Parts</option>
                          <option value="tires">Tires</option>
                        </optgroup>
                        <optgroup label="Medical & Pharmaceutical">
                          <option value="medical">Medical Devices</option>
                          <option value="pharma">Pharmaceuticals</option>
                        </optgroup>
                        <optgroup label="Other">
                          <option value="household">Household Goods</option>
                          <option value="other">Other</option>
                        </optgroup>
                      </select>
                      {errors.productType && (
                        <p className="mt-2 text-sm text-red-600">{errors.productType}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">Optional, but helps us route your inquiry to the right team.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Total Weight
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          name="weight"
                          min="0"
                          step="0.01"
                          required
                          value={formData.weight}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
                          aria-invalid={!!errors.weight}
                          placeholder="e.g., 125.5"
                        />
                        <select
                          name="weightUnit"
                          value={formData.weightUnit}
                          onChange={handleChange}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                        >
                          <option value="kg">kg</option>
                          <option value="lb">lb</option>
                        </select>
                      </div>
                      {convertedWeight && (
                        <p className="mt-2 text-xs text-gray-500">{convertedWeight}</p>
                      )}
                      {errors.weight && (
                        <p className="mt-2 text-sm text-red-600">{errors.weight}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">Approximate total shipment weight including packaging.</p>
                    </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none"
                      placeholder="Tell us about your shipping needs..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Office Location */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-red-600 text-3xl mb-4">📍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Office Address</h3>
              <p className="text-gray-600">
                1234 Warehouse Ave<br />
                Logistics City, World 56789<br />
                Thailand
              </p>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-red-600 text-3xl mb-4">📞</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600">
                <a href="tel:+1234567890" className="hover:text-red-600 transition">
                  +1 (234) 567-890
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9AM - 6PM</p>
            </motion.div>

            {/* Email */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-red-600 text-3xl mb-4">✉️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Departments</h3>
              <div className="space-y-2">
                {sendToOptions.length > 0 ? (
                  sendToOptions.map((email) => (
                    <p key={email} className="text-sm text-gray-600">
                      <a href={`mailto:${email}`} className="hover:text-red-600 transition">
                        {email.includes('sales') ? '💼 ' : 
                         email.includes('quotes') ? '📋 ' : 
                         email.includes('support') ? '🛠️ ' : 
                         '📧 '}
                        {email}
                      </a>
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">
                    <a href="mailto:info@asianshippingthai.com" className="hover:text-red-600 transition">
                      info@asianshippingthai.com
                    </a>
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-3">We reply within 24 hours</p>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-3xl mb-4">🕐</div>
              <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

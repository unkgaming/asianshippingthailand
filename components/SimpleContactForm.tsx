'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SimpleContactForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error', message: string} | null>(null);
  const [mounted, setMounted] = useState(false);

  // Generate captcha only on client side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setCaptchaCode(generateCaptcha());
  }, []);

  function generateCaptcha() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptcha('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate captcha (skip if not yet mounted)
    if (!mounted || !captchaCode) {
      setNotification({ type: 'error', message: 'Please wait for page to load completely' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    
    if (captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      setNotification({ type: 'error', message: 'Verification code is incorrect' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      setNotification({ type: 'error', message: 'Please fill in all fields' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[SimpleContactForm] Submitting contact form to info@asianshippingthai.com');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: 'general',
          message: formData.message
        })
      });

      const data = await response.json();
      console.log('[SimpleContactForm] API response:', data);

      if (response.ok && data.ok) {
        setNotification({ type: 'success', message: 'Message sent successfully! We will contact you soon.' });
        setFormData({ name: '', phone: '', email: '', message: '' });
        setCaptcha('');
        setCaptchaCode(generateCaptcha());
      } else {
        console.error('[SimpleContactForm] Submit failed:', data);
        setNotification({ type: 'error', message: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('[SimpleContactForm] Connection error:', error);
      setNotification({ type: 'error', message: 'Connection error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-10 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            {t('contact.contactInfo')}
          </h2>
        </div>
        <p className="text-gray-600 ml-7">{t('contact.helpLogistics')}</p>
      </div>
      
      {notification && (
        <div className={`mb-4 p-3 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">👤</span>
          <input
            type="text"
            placeholder={t('contact.name')}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">📞</span>
          <input
            type="tel"
            placeholder={t('contact.phone')}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">✉️</span>
          <input
            type="email"
            placeholder={t('contact.email')}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Message */}
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">💬</span>
          <textarea
            placeholder={t('contact.message')}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows={4}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Captcha */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-gray-400">🔒</span>
            <input
              type="text"
              placeholder={t('form.verifyCode')}
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
            <span className="text-2xl font-bold tracking-wider select-none" style={{fontFamily: 'monospace'}}>
              {mounted ? captchaCode : '------'}
            </span>
            <button
              type="button"
              onClick={handleRefreshCaptcha}
              className="text-gray-600 hover:text-gray-800"
              title={t('form.refreshCode')}
            >
              🔄
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('form.sending') : t('form.send')}
        </button>
      </form>
    </div>
  );
}

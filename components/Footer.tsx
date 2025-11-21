"use client";
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-[var(--primary)] text-white mt-20">
      <div className="container-max py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold mb-3 text-lg">asianshippingthai</h3>
          <p className="text-gray-300 text-sm">
            {t('footer.tagline')}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-[var(--accent)]">{t('common.home')}</a></li>
            <li><a href="/services" className="hover:text-[var(--accent)]">{t('common.services')}</a></li>
            <li><a href="/news" className="hover:text-[var(--accent)]">News</a></li>
            <li><a href="/about" className="hover:text-[var(--accent)]">{t('footer.aboutUs')}</a></li>
            <li><a href="/contact" className="hover:text-[var(--accent)]">{t('common.contact')}</a></li>
            <li><a href="/portal" className="hover:text-[var(--accent)]">{t('footer.customerPortal')}</a></li>
            <li><a href="/admin" className="hover:text-[var(--accent)] flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t('footer.employeePortal')}
            </a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">{t('common.contact')}</h4>
          <p className="text-sm text-gray-300">TEL : +6622493889 (auto)</p>
          <p className="text-sm text-gray-300">FAX : +6622493778</p>
          <p className="text-sm text-gray-300">CELL PHONE NO. : +66832947428</p>
          <p className="text-sm text-gray-300">E-MAIL : asian@asianshippingthai.com (main)</p>
          <p className="text-sm text-gray-300">Overall info: info@asianshippingthai.com</p>
        </div>
      </div>

      <div className="border-t border-white/20 py-4">
        <div className="container-max flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
          <div>
            © {new Date().getFullYear()} asianshippingthai. {t('footer.allRights')}
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-[var(--accent)]">{t('footer.privacyPolicy')}</a>
            <a href="/terms" className="hover:text-[var(--accent)]">{t('footer.termsOfService')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  return (
    <header
  className={clsx(
    "fixed top-0 left-0 w-full z-50 transition-all bg-white shadow-sm"
  )}
>

      <div className="container-max flex items-center justify-between h-16">
        <Link href="/" className="font-extrabold text-[var(--primary)] text-xl">
          asianshippingthai
        </Link>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-red-600"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-[var(--accent)]">{t('common.home')}</Link>
          <Link href="/services" className="hover:text-[var(--accent)]">{t('common.services')}</Link>
          <Link href="/news" className="hover:text-[var(--accent)]">News</Link>
          <Link href="/portal" className="hover:text-[var(--accent)]">Portal</Link>
          
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition border border-gray-300"
            title={language === 'en' ? 'Switch to Thai' : 'Switch to English'}
          >
            <span className="text-base">{language === 'en' ? '🇹🇭' : '🇬🇧'}</span>
            <span className="font-medium">{language === 'en' ? 'ไทย' : 'EN'}</span>
          </button>
          
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium max-w-[150px] truncate">
                  {user.email}
                </span>
                <svg className={clsx("w-4 h-4 transition-transform", showUserMenu && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      {user.role === 'employee' ? '👔 Employee' : '👤 Customer'}
                    </p>
                  </div>
                  <Link
                    href={user.role === 'employee' ? '/admin/portal' : '/portal'}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    🏠 My Portal
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn-primary text-sm">Login</Link>
          )}
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden border-t border-gray-200">
            <nav className="container-max py-4 flex flex-col gap-2">
              <Link href="/" className="px-4 py-3 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>{t('common.home')}</Link>
              <Link href="/services" className="px-4 py-3 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>{t('common.services')}</Link>
              <Link href="/news" className="px-4 py-3 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>News</Link>
              <Link href="/portal" className="px-4 py-3 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Portal</Link>
              
              {/* Language Switcher Mobile */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                className="mx-4 px-4 py-3 flex items-center justify-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <span className="text-xl">{language === 'en' ? '🇹🇭' : '🇬🇧'}</span>
                <span className="font-medium">{language === 'en' ? 'Switch to Thai' : 'Switch to English'}</span>
              </button>
              
              {user ? (
                <div className="px-4 py-2 border-t border-gray-200 mt-2">
                  <p className="text-sm font-medium text-gray-900 mb-1">{user.name}</p>
                  <p className="text-xs text-gray-500 mb-3">{user.email}</p>
                  <Link
                    href={user.role === 'employee' ? '/admin/portal' : '/portal'}
                    className="block px-4 py-2 text-sm bg-gray-100 rounded-lg mb-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🏠 My Portal
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" className="mx-4 mt-2 btn-primary text-sm text-center" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="font-sans text-gray-800">
      <HeroSlider />
      <StatsSection />
      <ServicesSection />
      <FeaturesSection />
      <GlobalNetworkSection />
      <CTASection />
    </main>
  );
}

// Hero Slider Section
function HeroSlider() {
  const slides = [
    { 
      id: 1, 
      image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=80", 
      title: "Global Logistics Solutions",
      subtitle: "Connecting your business to the world with seamless air and sea freight services",
      icon: "🌍"
    },
    { 
      id: 2, 
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80", 
      title: "Reliable and Fast Delivery",
      subtitle: "99.5% on-time delivery rate across 200+ ports and airports worldwide",
      icon: "⚡"
    },
    { 
      id: 3, 
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80", 
      title: "Worldwide Cargo Network",
      subtitle: "Trusted by businesses globally for their shipping and logistics needs",
      icon: "🚢"
    },
  ];
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };
  const nextSlide = () => {
    setCurrent((current) => (current === slides.length - 1 ? 0 : current + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section 
      className="relative w-full h-screen overflow-hidden" 
      aria-label="Hero carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        {slides.map((slide, index) =>
          index === current ? (
            <motion.div
              key={slide.id}
              className="absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={85}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center" role="tabpanel" aria-live="polite">
                <div className="max-w-6xl mx-auto px-4 text-center w-full">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl md:text-8xl mb-6"
                  >
                    {slide.icon}
                  </motion.div>
                  <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white text-4xl md:text-7xl font-bold mb-6"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-200 text-lg md:text-2xl mb-8 max-w-3xl mx-auto"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-4 justify-center"
                  >
                    <Link 
                      href="/services"
                      className="bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition shadow-lg hover:shadow-xl"
                    >
                      Explore Services
                    </Link>
                    <Link 
                      href="/contact"
                      className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                      Get a Quote
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20" role="tablist" aria-label="Carousel navigation">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            role="tab"
            aria-selected={index === current}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
              index === current 
                ? 'bg-red-600 w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/20 transition z-20 group focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg className="w-6 h-6 group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/20 transition z-20 group focus:outline-none focus:ring-2 focus:ring-white"
      >
        <svg className="w-6 h-6 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { number: '500+', label: 'Weekly Flights', icon: '✈️', color: 'from-blue-500 to-blue-600' },
    { number: '200+', label: 'Global Ports', icon: '⚓', color: 'from-cyan-500 to-cyan-600' },
    { number: '10K+', label: 'Happy Clients', icon: '😊', color: 'from-green-500 to-green-600' },
    { number: '99.5%', label: 'On-Time Rate', icon: '⏱️', color: 'from-red-500 to-red-600' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-8 text-white text-center shadow-lg hover:shadow-2xl transition`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-5xl mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-sm font-medium opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Services Section
function ServicesSection() {
  const services = [
    { 
      title: "Air Freight", 
      icon: "✈️",
      description: "Fast and reliable air cargo delivery to destinations worldwide",
      features: ["Express Delivery", "Real-time Tracking", "Customs Support"],
      gradient: "from-blue-500 to-blue-700",
      link: "/services/airfreight"
    },
    { 
      title: "Sea Freight FCL", 
      icon: "🚢",
      description: "Full container load shipping for large-scale cargo needs",
      features: ["Container Options", "Competitive Rates", "Global Network"],
      gradient: "from-cyan-500 to-cyan-700",
      link: "/services/fcl"
    },
    { 
      title: "Sea Freight LCL", 
      icon: "📦",
      description: "Cost-effective solution for smaller shipments",
      features: ["Flexible Scheduling", "Consolidation", "Weekly Departures"],
      gradient: "from-teal-500 to-teal-700",
      link: "/services/lcl"
    },
    { 
      title: "Warehousing", 
      icon: "🏢",
      description: "Secure storage and inventory management solutions",
      features: ["24/7 Security", "Climate Control", "Inventory Tracking"],
      gradient: "from-purple-500 to-purple-700",
      link: "/services"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive logistics solutions tailored to your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={service.link}>
                <div className={`relative bg-gradient-to-br ${service.gradient} rounded-2xl p-6 text-white h-full overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-sm mb-4 opacity-90">{service.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold pt-4 border-t border-white/20">
                      <span>Learn More</span>
                      <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/services"
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition shadow-lg"
          >
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: "🔒",
      title: "Secure & Safe",
      description: "Advanced security measures and insurance coverage for all shipments"
    },
    {
      icon: "📱",
      title: "Real-Time Tracking",
      description: "Monitor your cargo 24/7 with our advanced tracking system"
    },
    {
      icon: "💼",
      title: "Expert Support",
      description: "Dedicated account managers and 24/7 customer service"
    },
    {
      icon: "🌐",
      title: "Global Coverage",
      description: "Network spanning 200+ ports and airports worldwide"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Industry-leading logistics solutions with unmatched reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Global Network Section
function GlobalNetworkSection() {
  const partners = [
    { name: "CIT Group Asia", region: "Asia Pacific" },
    { name: "RCL Group", region: "Southeast Asia" },
    { name: "Team Freight", region: "Global" },
    { name: "Trans Global Logistics", region: "Americas" },
    { name: "Alliance Logistics", region: "Europe" },
    { name: "Triumph Group", region: "Middle East" },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
          alt="Global logistics network visualization"
          fill
          className="object-cover"
          quality={75}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-gray-800/95"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Our Global Network</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Partnering with leading logistics companies worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition">
                  🤝
                </div>
                <div>
                  <h3 className="font-bold text-lg">{partner.name}</h3>
                  <p className="text-sm text-gray-300">{partner.region}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/about"
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition shadow-lg"
          >
            Learn More About Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Ship Your Cargo?</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contact us today and experience world-class logistics solutions with competitive pricing
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link 
              href="/contact"
              className="bg-white text-red-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-2xl hover:scale-105 transform"
            >
              Get Your Quote Now  
            </Link>
            <Link 
              href="/tracking"
              className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition"
            >
              Track Your Shipment
              
            </Link>
          </div>

          {/* Employee Portal Link */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-sm opacity-75 mb-3">Are you a staff member?</p>
            <Link 
              href="/admin"
              className="inline-flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Employee Portal Login
            </Link>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">📞</div>
              <div className="font-semibold mb-1">Call Us</div>
              <div className="text-sm opacity-90">+6622493889 (auto)</div>
              <div className="text-sm opacity-90">FAX: +6622493778</div>
              <div className="text-sm opacity-90">CELL: +66832947428</div>
            </motion.div>
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">📧</div>
              <div className="font-semibold mb-1">Email Us</div>
              <div className="text-sm opacity-90">asian@asianshippingthai.com (main)</div>
              <div className="text-sm opacity-90">info@asianshippingthai.com</div>
            </motion.div>
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">⏰</div>
              <div className="font-semibold mb-1">Business Hours</div>
              <div className="text-sm opacity-90">Mon-Fri: 9AM - 6PM</div>
              <div className="text-sm opacity-90">Sat: 10AM - 2PM</div>
              <div className="text-sm opacity-90">Sun: Closed</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

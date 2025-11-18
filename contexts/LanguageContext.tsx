"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'en' || savedLang === 'th') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

const translations = {
  en: {
    // Common
    common: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      getQuote: 'Get Quote',
      trackShipment: 'Track Shipment',
      login: 'Login',
      logout: 'Logout',
      submit: 'Submit',
      cancel: 'Cancel',
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      loading: 'Loading...',
      welcome: 'Welcome',
    },
    // Home page
    home: {
      hero: 'Your Trusted Partner in Asia-Wide Logistics',
      subtitle: 'Seamless shipping solutions connecting Thailand to every corner of Asia',
      whyChoose: 'Why Choose Asian Shipping Thailand?',
      trackYourShipment: 'Track Your Shipment',
      enterTracking: 'Enter your tracking number',
      track: 'Track',
      ourServices: 'Our Services',
      testimonials: 'What Our Clients Say',
      readyToShip: 'Ready to Ship?',
      getStarted: 'Get started with our reliable logistics solutions today',
    },
    // Services
    services: {
      airfreight: 'Air Freight',
      airfreightDesc: 'Fast and reliable air cargo services across Asia',
      fcl: 'Full Container Load (FCL)',
      fclDesc: 'Complete container shipping for large volumes',
      lcl: 'Less than Container Load (LCL)',
      lclDesc: 'Cost-effective shipping for smaller cargo',
      customs: 'Customs Clearance',
      customsDesc: 'Expert handling of all customs documentation',
      warehousing: 'Warehousing',
      warehousingDesc: 'Secure storage and distribution services',
      insurance: 'Cargo Insurance',
      insuranceDesc: 'Comprehensive coverage for your shipments',
    },
    // Contact
    contact: {
      getInTouch: 'Get in Touch',
      requestQuote: 'Request a Quote',
      name: 'Your Name',
      email: 'Email Address',
      phone: 'Phone Number',
      company: 'Company Name',
      service: 'Service Required',
      selectService: 'Select a service',
      message: 'Message',
      sendMessage: 'Send Message',
      contactInfo: 'Contact Information',
      officeHours: 'Office Hours',
      mondayFriday: 'Monday - Friday: 9:00 AM - 6:00 PM',
      saturday: 'Saturday: 9:00 AM - 1:00 PM',
      sunday: 'Sunday: Closed',
    },
    // Portal
    portal: {
      customerPortal: 'Customer Portal',
      myShipments: 'My Shipments',
      trackShipment: 'Track Shipment',
      profile: 'Profile',
      settings: 'Settings',
      shipmentDetails: 'Shipment Details',
      status: 'Status',
      origin: 'Origin',
      destination: 'Destination',
      weight: 'Weight',
      eta: 'Estimated Arrival',
      viewTracking: 'View Tracking',
    },
    // Admin Portal
    admin: {
      adminPortal: 'Admin Portal',
      dashboard: 'Dashboard',
      manageShipments: 'Manage Shipments',
      addShipment: 'Add Shipment',
      customerQuotes: 'Customer Quotes',
      documents: 'Documents',
      database: 'Database',
      totalShipments: 'Total Shipments',
      activeShipments: 'Active Shipments',
      recentQuotes: 'Recent Quotes',
      quoteRequests: 'Quote Requests',
      recentEmails: 'Recent Emails',
      composeEmail: 'Compose Email',
      newRequests: 'New Requests',
      responded: 'Responded',
      pending: 'Pending',
      remove: 'Remove',
      removeSelected: 'Remove Selected',
      permanentDelete: 'Permanent Delete',
      viewRawJson: 'View Raw JSON Data',
    },
    // Tracking
    tracking: {
      trackYourShipment: 'Track Your Shipment',
      trackingNumber: 'Tracking Number',
      shipmentNotFound: 'Shipment not found',
      trackingHistory: 'Tracking History',
      current: 'CURRENT',
      serviceType: 'Service Type',
      bookingDate: 'Booking Date',
      estimatedDelivery: 'Estimated Delivery',
    },
  },
  th: {
    // Common
    common: {
      home: 'หน้าแรก',
      about: 'เกี่ยวกับเรา',
      services: 'บริการ',
      contact: 'ติดต่อเรา',
      getQuote: 'ขอใบเสนอราคา',
      trackShipment: 'ติดตามพัสดุ',
      login: 'เข้าสู่ระบบ',
      logout: 'ออกจากระบบ',
      submit: 'ส่ง',
      cancel: 'ยกเลิก',
      close: 'ปิด',
      save: 'บันทึก',
      delete: 'ลบ',
      edit: 'แก้ไข',
      view: 'ดู',
      search: 'ค้นหา',
      loading: 'กำลังโหลด...',
      welcome: 'ยินดีต้อนรับ',
    },
    // Home page
    home: {
      hero: 'พันธมิตรด้านโลจิสติกส์ที่คุณไว้วางใจทั่วเอเชีย',
      subtitle: 'โซลูชันการจัดส่งที่ราบรื่นเชื่อมต่อไทยกับทุกมุมเอเชีย',
      whyChoose: 'ทำไมต้องเลือกเรา?',
      trackYourShipment: 'ติดตามพัสดุของคุณ',
      enterTracking: 'กรอกหมายเลขติดตาม',
      track: 'ติดตาม',
      ourServices: 'บริการของเรา',
      testimonials: 'ความคิดเห็นลูกค้า',
      readyToShip: 'พร้อมจัดส่ง?',
      getStarted: 'เริ่มต้นใช้โซลูชันโลจิสติกส์ที่เชื่อถือได้ของเราวันนี้',
    },
    // Services
    services: {
      airfreight: 'ขนส่งทางอากาศ',
      airfreightDesc: 'บริการขนส่งสินค้าทางอากาศที่รวดเร็วและเชื่อถือได้ทั่วเอเชีย',
      fcl: 'ตู้เต็มตู้ (FCL)',
      fclDesc: 'การจัดส่งตู้คอนเทนเนอร์เต็มสำหรับสินค้าปริมาณมาก',
      lcl: 'ตู้รวม (LCL)',
      lclDesc: 'การจัดส่งประหยัดสำหรับสินค้าขนาดเล็ก',
      customs: 'ผ่านพิธีการศุลกากร',
      customsDesc: 'จัดการเอกสารศุลกากรอย่างเชี่ยวชาญ',
      warehousing: 'คลังสินค้า',
      warehousingDesc: 'บริการเก็บและจัดจำหน่ายที่ปลอดภัย',
      insurance: 'ประกันสินค้า',
      insuranceDesc: 'การคุ้มครองที่ครอบคลุมสำหรับการจัดส่งของคุณ',
    },
    // Contact
    contact: {
      getInTouch: 'ติดต่อเรา',
      requestQuote: 'ขอใบเสนอราคา',
      name: 'ชื่อของคุณ',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      company: 'ชื่อบริษัท',
      service: 'บริการที่ต้องการ',
      selectService: 'เลือกบริการ',
      message: 'ข้อความ',
      sendMessage: 'ส่งข้อความ',
      contactInfo: 'ข้อมูลติดต่อ',
      officeHours: 'เวลาทำการ',
      mondayFriday: 'จันทร์ - ศุกร์: 9:00 - 18:00 น.',
      saturday: 'เสาร์: 9:00 - 13:00 น.',
      sunday: 'อาทิตย์: ปิด',
    },
    // Portal
    portal: {
      customerPortal: 'พอร์ทัลลูกค้า',
      myShipments: 'พัสดุของฉัน',
      trackShipment: 'ติดตามพัสดุ',
      profile: 'โปรไฟล์',
      settings: 'การตั้งค่า',
      shipmentDetails: 'รายละเอียดการจัดส่ง',
      status: 'สถานะ',
      origin: 'ต้นทาง',
      destination: 'ปลายทาง',
      weight: 'น้ำหนัก',
      eta: 'เวลาถึงโดยประมาณ',
      viewTracking: 'ดูการติดตาม',
    },
    // Admin Portal
    admin: {
      adminPortal: 'พอร์ทัลแอดมิน',
      dashboard: 'แดชบอร์ด',
      manageShipments: 'จัดการพัสดุ',
      addShipment: 'เพิ่มพัสดุ',
      customerQuotes: 'ใบเสนอราคาลูกค้า',
      documents: 'เอกสาร',
      database: 'ฐานข้อมูล',
      totalShipments: 'พัสดุทั้งหมด',
      activeShipments: 'พัสดุที่ใช้งาน',
      recentQuotes: 'ใบเสนอราคาล่าสุด',
      quoteRequests: 'คำขอใบเสนอราคา',
      recentEmails: 'อีเมลล่าสุด',
      composeEmail: 'เขียนอีเมล',
      newRequests: 'คำขอใหม่',
      responded: 'ตอบกลับแล้ว',
      pending: 'รอดำเนินการ',
      remove: 'ลบ',
      removeSelected: 'ลบที่เลือก',
      permanentDelete: 'ลบถาวร',
      viewRawJson: 'ดูข้อมูล JSON',
    },
    // Tracking
    tracking: {
      trackYourShipment: 'ติดตามพัสดุของคุณ',
      trackingNumber: 'หมายเลขติดตาม',
      shipmentNotFound: 'ไม่พบพัสดุ',
      trackingHistory: 'ประวัติการติดตาม',
      current: 'ปัจจุบัน',
      serviceType: 'ประเภทบริการ',
      bookingDate: 'วันที่จอง',
      estimatedDelivery: 'วันที่จัดส่งโดยประมาณ',
    },
  },
};

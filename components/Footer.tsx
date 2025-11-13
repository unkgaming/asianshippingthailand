export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white mt-20">
      <div className="container-max py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold mb-3 text-lg">asianshippingthai</h3>
          <p className="text-gray-300 text-sm">
            Reliable logistics solutions from Thailand to the world.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-[var(--accent)]">Home</a></li>
            <li><a href="/services" className="hover:text-[var(--accent)]">Services</a></li>
            <li><a href="/portal" className="hover:text-[var(--accent)]">Customer Portal</a></li>
            <li><a href="/admin" className="hover:text-[var(--accent)] flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Employee Portal
            </a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-sm text-gray-300">Hotline: +66 2 123 4567</p>
          <p className="text-sm text-gray-300">Email: info@logistix.co.th</p>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} asianshippingthai. All rights reserved.
      </div>
    </footer>
  );
}

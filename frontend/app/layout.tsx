import './styles/globals.css'
import { ReactNode } from 'react'
import ClientNavbar from '../../components/ClientNavbar'
import Footer from '../../components/Footer'
import Providers from '../../components/providers'

export const metadata = {
  title: 'asianshippingthai',
  description: 'Thailand — International logistics and tracking'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientNavbar />
          <main className="min-h-[calc(100vh-120px)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

"use client";
import dynamic from 'next/dynamic';

// Load the client Navbar dynamically with no SSR so hooks like useSession
// are only executed in the browser during client-side rendering.
const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

export default function ClientNavbar() {
  return <Navbar />;
}

// src/components/common/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              <img 
                src="/logo1.jpeg" 
                alt="Grove Assets Ltd" 
                className="h-8 w-auto object-contain" 
              />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white">Grove Assets Ltd</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-semibold text-gray-200 hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-sm font-semibold text-gray-200 hover:text-white transition-colors">About us</Link>
            <a 
              href="/#faqs" 
              onClick={(e) => handleSectionClick(e, 'faqs')} 
              className="text-sm font-semibold text-gray-200 hover:text-white transition-colors cursor-pointer"
            >
              FAQs
            </a>
            <a 
              href="/#insights" 
              onClick={(e) => handleSectionClick(e, 'insights')} 
              className="text-sm font-semibold text-gray-200 hover:text-white transition-colors cursor-pointer"
            >
              Insights
            </a>
            <Link href="/login" className="text-sm font-semibold text-gray-200 hover:text-white transition-colors">Login</Link>
            <Link href="/register">
              <span className="bg-[#2563eb] hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md">
                Get Started
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-gray-200 hover:text-white focus:outline-none p-1"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden py-5 bg-gray-950/95 backdrop-blur-md border border-gray-800 rounded-xl space-y-4 px-6 text-sm font-semibold shadow-2xl">
            <Link href="/" className="block py-2 text-gray-200 hover:text-white border-b border-gray-800/60" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" className="block py-2 text-gray-200 hover:text-white border-b border-gray-800/60" onClick={() => setIsOpen(false)}>About us</Link>
            <a 
              href="/#faqs" 
              onClick={(e) => handleSectionClick(e, 'faqs')} 
              className="block py-2 text-gray-200 hover:text-white cursor-pointer border-b border-gray-800/60"
            >
              FAQs
            </a>
            <a 
              href="/#insights" 
              onClick={(e) => handleSectionClick(e, 'insights')} 
              className="block py-2 text-gray-200 hover:text-white cursor-pointer border-b border-gray-800/60"
            >
              Insights
            </a>
            <Link href="/login" className="block py-2 text-gray-200 hover:text-white border-b border-gray-800/60" onClick={() => setIsOpen(false)}>Login</Link>
            <div className="pt-2">
              <Link href="/register" className="block w-full text-center bg-blue-600 text-white py-3 rounded-full font-bold shadow-lg" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
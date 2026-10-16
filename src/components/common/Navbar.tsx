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

  // Helper function to handle smooth scrolling to homepage sections
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (pathname === '/') {
      // If already on homepage, smooth scroll immediately
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate home first, then scroll after render
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
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md">
              💎
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Crystal</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-7">
            <Link href="/" className="text-xs font-medium text-gray-200 hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-xs font-medium text-gray-200 hover:text-white transition-colors">About us</Link>
            <Link href="/plans" className="text-xs font-medium text-gray-200 hover:text-white transition-colors">Plans</Link>
            <a 
              href="/#faqs" 
              onClick={(e) => handleSectionClick(e, 'faqs')} 
              className="text-xs font-medium text-gray-200 hover:text-white transition-colors cursor-pointer"
            >
              FAQs
            </a>
            <a 
              href="/#insights" 
              onClick={(e) => handleSectionClick(e, 'insights')} 
              className="text-xs font-medium text-gray-200 hover:text-white transition-colors cursor-pointer"
            >
              Insights
            </a>
            <Link href="/login" className="text-xs font-medium text-gray-200 hover:text-white transition-colors">Login</Link>
            <Link href="/register">
              <span className="bg-[#2563eb] hover:bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-semibold transition-all shadow-md">
                Get Started
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden text-gray-200 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden py-4 bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-lg space-y-3 px-4 text-xs">
            <Link href="/" className="block py-1.5 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" className="block py-1.5 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>About us</Link>
            <Link href="/plans" className="block py-1.5 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Plans</Link>
            <a 
              href="/#faqs" 
              onClick={(e) => handleSectionClick(e, 'faqs')} 
              className="block py-1.5 text-gray-300 hover:text-white cursor-pointer"
            >
              FAQs
            </a>
            <a 
              href="/#insights" 
              onClick={(e) => handleSectionClick(e, 'insights')} 
              className="block py-1.5 text-gray-300 hover:text-white cursor-pointer"
            >
              Insights
            </a>
            <Link href="/login" className="block py-1.5 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Login</Link>
            <Link href="/register" className="block w-full text-center bg-blue-600 text-white py-2 rounded-full font-semibold" onClick={() => setIsOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
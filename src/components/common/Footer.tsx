// src/components/common/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-white text-lg">
              <img 
                src="/logo1.jpeg" 
                alt="Grove Assets Ltd" 
                className="h-7 w-7 object-contain" 
              />
            </div>
            <span className="text-base sm:text-lg font-bold text-white">Grove Assets Ltd</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed font-normal">
            We enable investors to take advantage of the rapidly developing digital economy and secure their future now.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white mb-4">Useful Links</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/#faqs" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">Company Registration</Link></li>
          </ul>
        </div>

        {/* Site Links */}
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white mb-4">Site Links</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><a href="https://wa.me/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp Support</a></li>
          </ul>
        </div>

        {/* Compliance / Notice */}
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white mb-4">Legal</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Registered with official authority. 51 Whitesides Road, Randalstown, Antrim, Northern Ireland, BT41 3EX
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-600 text-white text-sm py-5">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 Grove Assets Ltd. All Rights Reserved.</p>
          <Link href="/terms" className="hover:underline font-medium">Terms and Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
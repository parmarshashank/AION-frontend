'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1D] border-t border-[#3B1C32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-xl font-bold bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] bg-clip-text text-transparent">
              AION
            </span>
            <p className="text-gray-300 mt-2">
              Your personal second brain for timeless knowledge retrieval.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#A64D79] mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-gray-300 hover:text-[#A64D79]">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-[#A64D79]">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#A64D79] mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#A64D79]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#A64D79]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#A64D79] mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-[#A64D79]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-[#A64D79]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-[#3B1C32]">
          <p className="text-center text-gray-300">
            © {new Date().getFullYear()} AION. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 
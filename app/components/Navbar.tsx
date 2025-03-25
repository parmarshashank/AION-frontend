'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-[#1A1A1D]/95 backdrop-blur-sm z-50 border-b border-[#3B1C32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] bg-clip-text text-transparent">
                AION
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-300 hover:text-[#A64D79] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '../utils/auth';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const response = await login(formData);
    
    if (response.token) {
      router.push('/dashboard');
    } else {
      setError(response.error || 'Invalid credentials');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] bg-clip-text text-transparent">
            AION
          </h2>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-300">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#3B1C32] py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-[#6A1E55] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#A64D79] focus:border-[#A64D79] bg-[#1A1A1D] text-gray-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-[#6A1E55] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#A64D79] focus:border-[#A64D79] bg-[#1A1A1D] text-gray-300"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#3B1C32] via-[#6A1E55] to-[#A64D79] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A64D79] disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#6A1E55]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#3B1C32] text-gray-300">
                  New to AION?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/signup"
                className="w-full flex justify-center py-2 px-4 border border-[#6A1E55] rounded-md shadow-sm text-sm font-medium text-gray-300 hover:text-white hover:border-[#A64D79] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A64D79]"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
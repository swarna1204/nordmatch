'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Building2 } from 'lucide-react';

export function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        console.error('Signup error:', data);
        return;
      }

      // Success - redirect
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600 mt-2">Get started with your free trial today</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2D5F8D] transition text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2D5F8D] transition text-gray-900 placeholder-gray-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2D5F8D] transition text-gray-900 placeholder-gray-500"
            required
          />
        </div>

        {/* Company Name - FIXED */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your Company"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2D5F8D] transition text-gray-900 placeholder-gray-500 bg-white"
            required
          />
        </div>

        {/* Password - FIXED */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2D5F8D] transition text-gray-900 placeholder-gray-500 bg-white"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            At least 8 characters with numbers and symbols
          </p>
        </div>

        {/* Terms */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            defaultChecked
            className="w-4 h-4 rounded accent-[#2D5F8D]"
            required
          />
          <span className="text-gray-600">
            I agree to the{' '}
            <Link href="#" className="text-[#2D5F8D] font-medium hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="#" className="text-[#2D5F8D] font-medium hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2D5F8D] hover:bg-[#1e3f5a] disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {loading ? 'Creating Account...' : 'Create Account'} →
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-[#2D5F8D] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
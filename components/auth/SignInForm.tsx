'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        console.error('Login error:', data);
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
        <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
        <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2D5F8D] transition text-gray-900 placeholder-gray-500 pr-12 bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-[#2D5F8D]"
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-[#2D5F8D] font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2D5F8D] hover:bg-[#1e3f5a] disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          {loading ? 'Signing in...' : 'Sign In'} →
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#2D5F8D] font-semibold hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
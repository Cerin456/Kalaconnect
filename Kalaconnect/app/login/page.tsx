'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to sign in. Please verify your credentials.');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('kala12345');
    setError('');
  };

  return (
    <main className="bg-[#FAF6EF] min-h-screen">
      <Navbar />

      <div className="pt-12 pb-24 flex items-center">
        <div className="max-w-md mx-auto px-6 w-full">
          {/* Logo & Headline */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 border-2 border-[#702D35] rotate-45 mb-2">
              <span className="font-serif text-2xl font-bold text-[#702D35] -rotate-45 leading-none">
                क
              </span>
            </div>
            <h1 className="font-serif text-4xl font-semibold text-[#1A0F0A]">
              Artist Portal Login
            </h1>
            <p className="font-sans text-sm text-[#1A0F0A]/60">
              Welcome back. Access your digital portfolio &amp; buyer enquiries.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-[#E7DDD0] shadow-sm rounded-3xl p-8 space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans rounded-xl p-3.5 flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                  Email or Registered Phone
                </label>
                <input
                  required
                  type="text"
                  placeholder="meera@kalaconnect.art"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                />
              </div>

              <div className="flex justify-end">
                <a
                  href="#demo"
                  onClick={() => fillDemoAccount('meera@kalaconnect.art')}
                  className="font-sans text-xs text-[#702D35] hover:underline"
                >
                  Forgot password? Use Demo
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#702D35] text-white py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#582128] transition-colors flex items-center justify-center gap-2 group shadow-sm"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Quick Demo Sign In Pills */}
            <div className="pt-4 border-t border-[#E7DDD0] space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-wider font-semibold text-[#1A0F0A]/50">
                <KeyRound size={12} />
                Quick 1-Click Demo Accounts
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('meera@kalaconnect.art')}
                  className="text-left bg-[#FAF6EF] hover:bg-[#F0E7DC] p-2.5 rounded-xl border border-[#E7DDD0] transition-colors text-xs font-sans"
                >
                  <div className="font-semibold text-[#1A0F0A]">Meera Devi</div>
                  <div className="text-[10px] text-[#C4522A]">Madhubani Artisan</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('ramesh@kalaconnect.art')}
                  className="text-left bg-[#FAF6EF] hover:bg-[#F0E7DC] p-2.5 rounded-xl border border-[#E7DDD0] transition-colors text-xs font-sans"
                >
                  <div className="font-semibold text-[#1A0F0A]">Ramesh Kumar</div>
                  <div className="text-[10px] text-[#C4522A]">Blue Pottery Master</div>
                </button>
              </div>
            </div>

            <p className="text-center font-sans text-xs text-[#1A0F0A]/50 pt-2">
              New to KalaConnect?{' '}
              <Link href="/join" className="text-[#702D35] font-semibold hover:underline">
                Create an Artist Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

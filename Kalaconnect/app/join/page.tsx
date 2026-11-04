'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, CheckCircle2, QrCode, AlertCircle } from 'lucide-react';

export default function JoinPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdArtist, setCreatedArtist] = useState<{
    id: string;
    slug: string;
    name: string;
    craft: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    craft: '',
    location: '',
    experience: '',
    story: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to complete registration.');
        return;
      }

      setCreatedArtist(data.artist);
    } catch {
      setError('Connection failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#FAF6EF] min-h-screen">
      <Navbar />

      <div className="pt-10 pb-24">
        <div className="max-w-2xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="flex justify-center">
              <div className="section-label">Join KalaConnect</div>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl font-medium text-[#1A0F0A]">
              Share your art with the{' '}
              <em className="text-[#582128] font-serif italic font-normal">world.</em>
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#1A0F0A]/70 max-w-md mx-auto">
              Build your digital identity, tell your story with AI assistance, and connect
              directly with global patrons.
            </p>
          </div>

          {createdArtist ? (
            <div className="bg-white border border-[#E7DDD0] rounded-3xl p-8 sm:p-12 shadow-md text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#702D35]/10 text-[#702D35] flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-sans font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-emerald-200">
                  Profile Live &amp; Persistent
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1A0F0A]">
                  Welcome to KalaConnect, {createdArtist.name}!
                </h2>
                <p className="font-sans text-sm text-[#1A0F0A]/70 max-w-md mx-auto leading-relaxed">
                  Your public portfolio for <strong className="text-[#C4522A]">{createdArtist.craft}</strong> is live and ready for artwork uploads.
                </p>
              </div>

              {/* Digital Portfolio Card Mock */}
              <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#1A0F0A]">
                      {createdArtist.name}
                    </h3>
                    <p className="font-sans text-xs font-semibold text-[#C4522A]">
                      {createdArtist.craft} &bull; {formData.location || 'India'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white border border-[#E7DDD0] rounded-xl flex items-center justify-center text-[#702D35]">
                    <QrCode size={24} />
                  </div>
                </div>

                <div className="text-xs font-sans text-[#1A0F0A]/70 line-clamp-2 italic">
                  &ldquo;{formData.story || 'Preserving timeless Indian craftsmanship with dedication and natural pigments.'}&rdquo;
                </div>

                <div className="pt-2 text-[11px] font-sans text-[#1A0F0A]/50 border-t border-[#E7DDD0]/80 flex justify-between items-center">
                  <span>URL: /artists/{createdArtist.slug}</span>
                  <span className="text-[#702D35] font-semibold">Active &amp; Shareable</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="bg-[#702D35] text-white px-7 py-3 rounded-lg text-sm font-semibold hover:bg-[#582128] transition-colors"
                >
                  Go to Artist Dashboard &rarr;
                </Link>
                <Link
                  href={`/artists/${createdArtist.slug}`}
                  className="border border-[#702D35] text-[#702D35] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#FAF6EF] transition-colors"
                >
                  View Public Portfolio
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E7DDD0] shadow-sm rounded-3xl p-8 sm:p-10 space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans rounded-xl p-3.5 flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form notice */}
              <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-xl p-4 flex items-start gap-3">
                <Sparkles size={18} className="text-[#C9A060] mt-0.5 flex-shrink-0" />
                <p className="text-xs font-sans text-[#1A0F0A]/75 leading-relaxed">
                  <strong>Zero tech barrier:</strong> Create your profile in seconds. Your account
                  lets you upload artwork photos, receive enquiries, and manage your portfolio.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ramesh"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Kumar"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="artist@kalaconnect.art"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                    Create Password
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                      Traditional Craft / Art Form
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Blue Pottery, Madhubani..."
                      value={formData.craft}
                      onChange={(e) => setFormData({ ...formData, craft: e.target.value })}
                      className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                      Region / Village / State
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Jaipur, Rajasthan"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                    Years of Experience in this Tradition
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors"
                  >
                    <option value="">Select experience level</option>
                    <option value="1-5 years">1 - 5 years (Emerging Artisan)</option>
                    <option value="5-15 years">5 - 15 years (Practicing Artisan)</option>
                    <option value="15-25 years">15 - 25 years (Master Craftsman)</option>
                    <option value="25+ years">25+ years (Living Heritage Custodian)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-xs font-semibold text-[#1A0F0A]/70 mb-1.5 uppercase tracking-wider">
                    Tell us your tradition&apos;s story (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe how you learned your craft, natural pigments used, or family lineage..."
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    className="w-full bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-lg px-4 py-3 font-sans text-sm text-[#1A0F0A] focus:outline-none focus:border-[#702D35] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#702D35] text-[#FAF6EF] py-4 rounded-lg font-sans font-semibold text-sm hover:bg-[#582128] transition-all flex items-center justify-center gap-2 group shadow-md"
                >
                  {loading ? 'Creating Portfolio...' : 'Create My Artist Profile'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center font-sans text-xs text-[#1A0F0A]/50 pt-1">
                  Already registered?{' '}
                  <Link href="/login" className="text-[#702D35] font-semibold hover:underline">
                    Artist Login
                  </Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

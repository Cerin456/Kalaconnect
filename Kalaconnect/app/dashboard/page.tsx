'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Plus,
  Trash2,
  Eye,
  Mail,
  Sparkles,
  QrCode,
  ExternalLink,
  LogOut,
  CheckCircle,
  Clock,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Palette,
  ShieldCheck,
  Calculator,
  Compass,
  LayoutGrid,
} from 'lucide-react';
import PricingAdvisorSection from '@/components/PricingAdvisorSection';
import CreativeJourneySection from '@/components/CreativeJourneySection';
import ExhibitionManagerSection from '@/components/ExhibitionManagerSection';
import { generateQRCodeSVG } from '@/lib/qrcode';

interface ArtistProfile {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  craft: string;
  location: string;
  experience: string;
  story: string;
  avatarUrl: string;
  badge: string;
  viewsCount: number;
}

interface Artwork {
  id: string;
  title: string;
  craft: string;
  medium: string;
  year: string;
  price?: string;
  dimensions?: string;
  imageUrl: string;
  description: string;
}

interface Enquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  enquiryType: string;
  message: string;
  status: 'pending' | 'responded';
  createdAt: string;
}

export default function ArtistDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeTab, setActiveTab] = useState<
    'portfolio' | 'enquiries' | 'pricing' | 'journey' | 'exhibitions' | 'identity'
  >('portfolio');

  // New Artwork Form State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [newArt, setNewArt] = useState({
    title: '',
    medium: 'Handmade natural pigments & stone minerals',
    year: '2026',
    price: '₹12,000',
    dimensions: '24" x 36"',
    description: '',
    imageFile: null as File | null,
    imagePreview: '',
  });

  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.authenticated || !data.artist) {
        router.push('/login');
        return;
      }
      setArtist(data.artist);
      setArtworks(data.artworks || []);
      setEnquiries(data.enquiries || []);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewArt({
        ...newArt,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleGenerateStory = async () => {
    if (!artist) return;
    setGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          craft: artist.craft,
          artworkTitle: newArt.title,
          medium: newArt.medium,
          region: artist.location,
        }),
      });
      const data = await res.json();
      if (data.story) {
        setNewArt((prev) => ({ ...prev, description: data.story }));
      }
    } catch (err) {
      console.error('AI story error:', err);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleUploadArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artist) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', newArt.title);
      formData.append('craft', artist.craft);
      formData.append('medium', newArt.medium);
      formData.append('year', newArt.year);
      formData.append('price', newArt.price);
      formData.append('dimensions', newArt.dimensions);
      formData.append('description', newArt.description);
      if (newArt.imageFile) {
        formData.append('image', newArt.imageFile);
      }

      const res = await fetch('/api/artworks', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.artwork) {
        setArtworks([data.artwork, ...artworks]);
        setUploadModalOpen(false);
        setNewArt({
          title: '',
          medium: 'Handmade natural pigments & stone minerals',
          year: '2026',
          price: '₹12,000',
          dimensions: '24" x 36"',
          description: '',
          imageFile: null,
          imagePreview: '',
        });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    if (!confirm('Are you sure you want to remove this masterpiece from your public portfolio?')) return;
    try {
      const res = await fetch('/api/artworks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setArtworks(artworks.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleEnquiryStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'responded' : 'pending';
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        setEnquiries(
          enquiries.map((e) => (e.id === id ? { ...e, status: nextStatus as any } : e))
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const copyPortfolioUrl = () => {
    if (!artist) return;
    const url = `${window.location.origin}/artists/${artist.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <main className="bg-[#FAF6EF] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-3 border-[#702D35] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-xl text-[#702D35]">Loading Artisan Portal...</p>
        </div>
      </main>
    );
  }

  if (!artist) return null;

  const pendingEnquiriesCount = enquiries.filter((e) => e.status === 'pending').length;

  return (
    <main className="bg-[#FAF6EF] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        {/* Top Header Card */}
        <div className="bg-white border border-[#E7DDD0] rounded-3xl p-8 mb-10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#E7DDD0] bg-[#F0E7DC] flex-shrink-0">
              <Image
                src={artist.avatarUrl || '/images/artist_meera.png'}
                alt={artist.firstName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#702D35] uppercase tracking-wider mb-1">
                <ShieldCheck size={14} />
                {artist.badge || 'Verified Artisan'}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1A0F0A]">
                {artist.firstName} {artist.lastName}
              </h1>
              <p className="font-sans text-sm text-[#C4522A] font-semibold mt-0.5">
                {artist.craft} &bull; {artist.location}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/artists/${artist.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 border border-[#E7DDD0] bg-white text-[#1A0F0A]/80 px-4 py-2.5 rounded-lg text-xs font-sans font-semibold hover:border-[#702D35] hover:text-[#702D35] transition-colors"
            >
              <ExternalLink size={14} />
              View Live Portfolio
            </Link>

            <button
              onClick={copyPortfolioUrl}
              className="inline-flex items-center gap-2 border border-[#E7DDD0] bg-white text-[#1A0F0A]/80 px-4 py-2.5 rounded-lg text-xs font-sans font-semibold hover:border-[#702D35] transition-colors"
            >
              {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copiedLink ? 'Link Copied!' : 'Copy Share Link'}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-[#FAF6EF] text-[#702D35] hover:bg-[#702D35] hover:text-white px-4 py-2.5 rounded-lg text-xs font-sans font-semibold transition-all border border-[#E7DDD0]"
            >
              <LogOut size={14} />
              Log Out
            </button>
          </div>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white border border-[#E7DDD0] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#702D35] mb-2">
              <span className="text-xs font-sans uppercase tracking-wider font-semibold text-[#1A0F0A]/60">
                Masterpieces
              </span>
              <Palette size={18} />
            </div>
            <div className="font-serif text-4xl font-bold text-[#1A0F0A]">
              {artworks.length}
            </div>
            <div className="text-xs font-sans text-[#1A0F0A]/50 mt-1">Live in digital gallery</div>
          </div>

          <div className="bg-white border border-[#E7DDD0] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#C9A060] mb-2">
              <span className="text-xs font-sans uppercase tracking-wider font-semibold text-[#1A0F0A]/60">
                Portfolio Views
              </span>
              <Eye size={18} />
            </div>
            <div className="font-serif text-4xl font-bold text-[#1A0F0A]">
              {(artist.viewsCount || 0).toLocaleString()}
            </div>
            <div className="text-xs font-sans text-[#1A0F0A]/50 mt-1">Global patrons reached</div>
          </div>

          <div className="bg-white border border-[#E7DDD0] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-[#C4522A] mb-2">
              <span className="text-xs font-sans uppercase tracking-wider font-semibold text-[#1A0F0A]/60">
                Patron Enquiries
              </span>
              <Mail size={18} />
            </div>
            <div className="font-serif text-4xl font-bold text-[#1A0F0A]">
              {enquiries.length}
            </div>
            <div className="text-xs font-sans text-[#C4522A] font-semibold mt-1">
              {pendingEnquiriesCount} pending response
            </div>
          </div>

          <div className="bg-white border border-[#E7DDD0] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-xs font-sans uppercase tracking-wider font-semibold text-[#1A0F0A]/60">
                Lineage
              </span>
              <ShieldCheck size={18} />
            </div>
            <div className="font-serif text-2xl font-bold text-[#1A0F0A] truncate">
              {artist.experience}
            </div>
            <div className="text-xs font-sans text-[#1A0F0A]/50 mt-1">Verified Craft Heritage</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-[#E7DDD0] mb-8 pb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'portfolio'
                ? 'bg-[#702D35] text-white shadow-sm'
                : 'bg-white text-[#1A0F0A]/70 border border-[#E7DDD0] hover:border-[#702D35]'
            }`}
          >
            <Palette size={14} />
            My Artwork Portfolio ({artworks.length})
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'enquiries'
                ? 'bg-[#702D35] text-white shadow-sm'
                : 'bg-white text-[#1A0F0A]/70 border border-[#E7DDD0] hover:border-[#702D35]'
            }`}
          >
            <Mail size={14} />
            Patron Enquiries ({enquiries.length})
            {pendingEnquiriesCount > 0 && (
              <span className="bg-[#C4522A] text-white text-[10px] px-2 py-0.5 rounded-full">
                {pendingEnquiriesCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'pricing'
                ? 'bg-[#702D35] text-white shadow-sm'
                : 'bg-white text-[#1A0F0A]/70 border border-[#E7DDD0] hover:border-[#702D35]'
            }`}
          >
            <Calculator size={14} />
            AI Pricing Advisor
          </button>

          <button
            onClick={() => setActiveTab('journey')}
            className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'journey'
                ? 'bg-[#702D35] text-white shadow-sm'
                : 'bg-white text-[#1A0F0A]/70 border border-[#E7DDD0] hover:border-[#702D35]'
            }`}
          >
            <Compass size={14} />
            My Creative Journey
          </button>

          <button
            onClick={() => setActiveTab('exhibitions')}
            className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'exhibitions'
                ? 'bg-[#702D35] text-white shadow-sm'
                : 'bg-white text-[#1A0F0A]/70 border border-[#E7DDD0] hover:border-[#702D35]'
            }`}
          >
            <LayoutGrid size={14} />
            My Exhibitions
          </button>

          <button
            onClick={() => setActiveTab('identity')}
            className={`px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'identity'
                ? 'bg-[#702D35] text-white shadow-sm'
                : 'bg-white text-[#1A0F0A]/70 border border-[#E7DDD0] hover:border-[#702D35]'
            }`}
          >
            <QrCode size={14} />
            Digital Card &amp; QR
          </button>
        </div>

        {/* TAB 1: PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                  Artworks in Your Digital Portfolio
                </h3>
                <p className="font-sans text-xs text-[#1A0F0A]/60 mt-0.5">
                  Uploaded creations appear automatically on your public portfolio page.
                </p>
              </div>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="bg-[#702D35] text-white px-5 py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus size={15} />
                Add New Masterpiece
              </button>
            </div>

            {artworks.length === 0 ? (
              <div className="bg-white border border-[#E7DDD0] rounded-3xl p-12 text-center space-y-4">
                <Palette size={36} className="text-[#1A0F0A]/30 mx-auto" />
                <h4 className="font-serif text-2xl text-[#1A0F0A]">No artworks uploaded yet</h4>
                <p className="font-sans text-sm text-[#1A0F0A]/60 max-w-sm mx-auto">
                  Take a photo of your traditional art piece and upload it to start receiving buyer enquiries.
                </p>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="bg-[#702D35] text-white px-6 py-3 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128]"
                >
                  Upload First Artwork
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artworks.map((work) => (
                  <div
                    key={work.id}
                    className="bg-white rounded-2xl overflow-hidden border border-[#E7DDD0] shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full aspect-[4/3] bg-[#F0E7DC]">
                        <Image src={work.imageUrl} alt={work.title} fill className="object-cover" />
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-xl font-semibold text-[#1A0F0A]">
                            {work.title}
                          </h4>
                          {work.price && (
                            <span className="text-xs font-sans font-bold text-[#702D35] bg-[#FAF6EF] px-2.5 py-1 rounded-full border border-[#E7DDD0]">
                              {work.price}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-sans text-[#1A0F0A]/60">{work.medium}</p>
                        {work.description && (
                          <p className="text-xs font-sans text-[#1A0F0A]/75 line-clamp-3 leading-relaxed pt-1">
                            {work.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-[#E7DDD0]/60 flex justify-between items-center text-xs font-sans text-[#1A0F0A]/50 mt-3">
                      <span>{work.year || '2026'} &bull; {work.dimensions || 'Handmade'}</span>
                      <button
                        onClick={() => handleDeleteArtwork(work.id)}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Artwork"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                Received Patron Enquiries
              </h3>
              <p className="font-sans text-xs text-[#1A0F0A]/60 mt-0.5">
                Direct buyer requests for custom commissions, existing pieces, or exhibitions.
              </p>
            </div>

            {enquiries.length === 0 ? (
              <div className="bg-white border border-[#E7DDD0] rounded-3xl p-12 text-center space-y-3">
                <Mail size={36} className="text-[#1A0F0A]/30 mx-auto" />
                <h4 className="font-serif text-2xl text-[#1A0F0A]">No enquiries yet</h4>
                <p className="font-sans text-sm text-[#1A0F0A]/60 max-w-sm mx-auto">
                  Share your portfolio link to start receiving purchase and commission requests from patrons worldwide.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className={`bg-white border rounded-2xl p-6 shadow-sm transition-all ${
                      enq.status === 'pending'
                        ? 'border-[#C4522A]/40 bg-gradient-to-r from-amber-50/30 to-white'
                        : 'border-[#E7DDD0]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-xl font-semibold text-[#1A0F0A]">
                            {enq.customerName}
                          </h4>
                          <span
                            className={`text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              enq.status === 'pending'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}
                          >
                            {enq.status === 'pending' ? 'Needs Response' : 'Responded'}
                          </span>
                        </div>
                        <div className="text-xs font-sans text-[#1A0F0A]/60 mt-0.5">
                          Enquiry Type: <strong className="text-[#702D35] capitalize">{enq.enquiryType.replace('_', ' ')}</strong>
                          <span className="mx-2">&bull;</span>
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleEnquiryStatus(enq.id, enq.status)}
                          className="text-xs font-sans font-semibold px-3 py-1.5 rounded-lg border border-[#E7DDD0] hover:bg-[#FAF6EF] transition-colors"
                        >
                          {enq.status === 'pending' ? 'Mark as Responded' : 'Mark as Pending'}
                        </button>
                      </div>
                    </div>

                    <p className="bg-[#FAF6EF] rounded-xl p-4 text-sm font-sans text-[#1A0F0A]/85 leading-relaxed mb-4 border border-[#E7DDD0]/70">
                      &ldquo;{enq.message}&rdquo;
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-[#1A0F0A]/70 pt-1">
                      <a
                        href={`mailto:${enq.customerEmail}?subject=KalaConnect: Re your artwork enquiry`}
                        className="inline-flex items-center gap-1.5 text-[#702D35] font-semibold hover:underline"
                      >
                        <Mail size={14} />
                        Email: {enq.customerEmail}
                      </a>
                      {enq.customerPhone && (
                        <a
                          href={`https://wa.me/${enq.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:underline"
                        >
                          <MessageCircle size={14} />
                          WhatsApp: {enq.customerPhone}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: AI ART PRICING ADVISOR */}
        {activeTab === 'pricing' && (
          <PricingAdvisorSection
            artworks={artworks}
            artistCraft={artist.craft}
            artistExperience={artist.experience}
            onArtworkPriceUpdated={(artworkId, newPrice) => {
              setArtworks((prev) =>
                prev.map((w) => (w.id === artworkId ? { ...w, price: newPrice } : w))
              );
            }}
          />
        )}

        {/* TAB: MY CREATIVE JOURNEY */}
        {activeTab === 'journey' && (
          <CreativeJourneySection
            artworks={artworks}
            artistCraft={artist.craft}
            artistName={`${artist.firstName} ${artist.lastName}`}
          />
        )}

        {/* TAB: MY EXHIBITIONS */}
        {activeTab === 'exhibitions' && (
          <ExhibitionManagerSection
            artworks={artworks}
            artistCraft={artist.craft}
            artistName={`${artist.firstName} ${artist.lastName}`}
          />
        )}

        {/* TAB 3: DIGITAL IDENTITY & QR */}
        {activeTab === 'identity' && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white border border-[#E7DDD0] rounded-3xl p-8 space-y-6 shadow-sm">
              <div>
                <div className="section-label mb-2">Digital Heritage Card</div>
                <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
                  Your KalaConnect Presence
                </h3>
                <p className="font-sans text-xs text-[#1A0F0A]/60 mt-1">
                  Share this verified link at craft fairs, exhibitions, and social media.
                </p>
              </div>

              <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#1A0F0A]">
                      {artist.firstName} {artist.lastName}
                    </h4>
                    <p className="font-sans text-xs font-semibold text-[#C4522A]">
                      {artist.craft} &bull; {artist.location}
                    </p>
                  </div>
                  <div className="w-10 h-10 border-2 border-[#702D35] rotate-45 flex items-center justify-center">
                    <span className="font-serif font-bold text-[#702D35] -rotate-45">क</span>
                  </div>
                </div>

                <p className="text-xs font-sans text-[#1A0F0A]/70 italic line-clamp-3 leading-relaxed">
                  &ldquo;{artist.story}&rdquo;
                </p>

                <div className="pt-2 border-t border-[#E7DDD0] flex justify-between items-center text-[11px] font-sans text-[#1A0F0A]/60">
                  <span>Verified Lineage: {artist.experience}</span>
                  <span className="text-[#702D35] font-semibold">100% Authentic</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70">
                  Your Public Portfolio Link
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}/artists/${artist.slug}` : `/artists/${artist.slug}`}
                    className="flex-1 bg-[#FAF6EF] border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-xs font-mono text-[#1A0F0A]"
                  />
                  <button
                    onClick={copyPortfolioUrl}
                    className="bg-[#702D35] text-white px-5 py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128]"
                  >
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Presentation Box */}
            <div className="bg-white border border-[#E7DDD0] rounded-3xl p-8 space-y-6 shadow-sm text-center">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                  Artisan QR Code
                </h3>
                <p className="font-sans text-xs text-[#1A0F0A]/60 mt-1">
                  Patrons can scan this at exhibitions to view your story, artwork, and send enquiries.
                </p>
              </div>

              {/* Dynamic SVG QR Visual */}
              <div className="inline-block p-6 bg-white border-2 border-[#702D35] rounded-3xl shadow-md">
                <svg
                  className="w-48 h-48 mx-auto"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" fill="#FAF6EF" rx="8" />
                  {/* Outer corner anchors */}
                  <rect x="8" y="8" width="24" height="24" fill="#702D35" rx="4" />
                  <rect x="12" y="12" width="16" height="16" fill="#FAF6EF" />
                  <rect x="16" y="16" width="8" height="8" fill="#702D35" />

                  <rect x="68" y="8" width="24" height="24" fill="#702D35" rx="4" />
                  <rect x="72" y="12" width="16" height="16" fill="#FAF6EF" />
                  <rect x="76" y="16" width="8" height="8" fill="#702D35" />

                  <rect x="8" y="68" width="24" height="24" fill="#702D35" rx="4" />
                  <rect x="12" y="72" width="16" height="16" fill="#FAF6EF" />
                  <rect x="16" y="76" width="8" height="8" fill="#702D35" />

                  {/* Aesthetic decorative QR dots */}
                  <circle cx="45" cy="20" r="3" fill="#702D35" />
                  <circle cx="55" cy="20" r="3" fill="#C4522A" />
                  <circle cx="45" cy="30" r="3" fill="#702D35" />
                  <circle cx="55" cy="35" r="4" fill="#702D35" />
                  <circle cx="50" cy="50" r="6" fill="#C9A060" />
                  <circle cx="20" cy="48" r="3" fill="#702D35" />
                  <circle cx="35" cy="50" r="3" fill="#C4522A" />
                  <circle cx="68" cy="48" r="3" fill="#702D35" />
                  <circle cx="80" cy="50" r="3" fill="#702D35" />
                  <circle cx="45" cy="70" r="3" fill="#702D35" />
                  <circle cx="55" cy="78" r="3" fill="#702D35" />
                  <circle cx="75" cy="72" r="4" fill="#C4522A" />
                  <circle cx="85" cy="80" r="3" fill="#702D35" />
                </svg>
                <div className="font-serif text-sm font-semibold text-[#702D35] mt-3">
                  {artist.firstName} {artist.lastName}
                </div>
                <div className="font-sans text-[10px] text-[#1A0F0A]/50 uppercase tracking-widest">
                  KalaConnect Verified
                </div>
              </div>

              <div>
                <button
                  onClick={() => window.print()}
                  className="bg-[#FAF6EF] text-[#702D35] border border-[#702D35] px-6 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#702D35] hover:text-white transition-colors"
                >
                  Print QR Signboard for Exhibitions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UPLOAD ARTWORK MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-3xl max-w-xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="section-label mb-1">Add Masterpiece</div>
                <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
                  Upload New Artwork
                </h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-[#1A0F0A]/50 hover:text-[#1A0F0A] p-2"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUploadArtwork} className="space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1.5">
                  Artwork Photo
                </label>
                <div className="border-2 border-dashed border-[#E7DDD0] hover:border-[#702D35] rounded-2xl p-6 text-center bg-white cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {newArt.imagePreview ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={newArt.imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <Upload size={30} className="mx-auto text-[#702D35]" />
                      <div className="text-sm font-sans font-semibold text-[#1A0F0A]">
                        Click or drag artwork photo here
                      </div>
                      <div className="text-xs font-sans text-[#1A0F0A]/50">
                        Supports high-res JPG, PNG, WEBP
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                  Title of Masterpiece
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sacred Peacock in Lotus Pond"
                  value={newArt.title}
                  onChange={(e) => setNewArt({ ...newArt, title: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                    Medium / Pigments Used
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lampblack and crushed indigo"
                    value={newArt.medium}
                    onChange={(e) => setNewArt({ ...newArt, medium: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                    Price / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹18,500 or Price on Request"
                    value={newArt.price}
                    onChange={(e) => setNewArt({ ...newArt, price: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24 x 36 Inches"
                    value={newArt.dimensions}
                    onChange={(e) => setNewArt({ ...newArt, dimensions: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                    Creation Year
                  </label>
                  <input
                    type="text"
                    value={newArt.year}
                    onChange={(e) => setNewArt({ ...newArt, year: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35]"
                  />
                </div>
              </div>

              {/* Story Description with AI Generator */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70">
                    Artistic Story &amp; Cultural Meaning
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateStory}
                    disabled={generatingAI}
                    className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#702D35] hover:text-[#582128]"
                  >
                    <Sparkles size={13} className="text-[#C9A060]" />
                    {generatingAI ? 'Writing Story...' : '✨ Write with AI Assistant'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Share the folklore, prayers, or generational meaning behind this piece..."
                  value={newArt.description}
                  onChange={(e) => setNewArt({ ...newArt, description: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35] resize-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 border border-[#E7DDD0] bg-white py-3 rounded-lg text-xs font-sans font-semibold hover:bg-[#FAF6EF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-[#702D35] text-white py-3 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-colors shadow-sm"
                >
                  {uploading ? 'Publishing...' : 'Publish to Digital Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

'use client';

import { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId?: string;
  artistName?: string;
  artform?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  artistId = 'artist-1',
  artistName = 'Master Artisan',
  artform = 'Traditional Artwork',
}: EnquiryModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'custom_commission',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistId,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          enquiryType: formData.enquiryType,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send enquiry.');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-3xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#1A0F0A]/60 hover:text-[#1A0F0A] hover:bg-[#E7DDD0]/50 transition-colors"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#702D35]/10 text-[#702D35] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
              Enquiry Delivered
            </h3>
            <p className="font-sans text-sm text-[#1A0F0A]/70 max-w-sm mx-auto leading-relaxed">
              Thank you for supporting traditional Indian art! Your message has been routed directly to{' '}
              <strong className="text-[#702D35]">{artistName}</strong> for {artform}.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-emerald-50 text-emerald-800 text-[11px] font-sans font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full border border-emerald-200">
                Delivered &bull; Saved to Artisan Portal
              </span>
            </div>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#702D35] text-white px-7 py-3 rounded-lg text-sm font-semibold hover:bg-[#582128] transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="section-label mb-2">Direct Artisan Enquiry</div>
              <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
                Connect with {artistName}
              </h3>
              <p className="font-sans text-xs text-[#1A0F0A]/60 mt-1">
                Enquire about purchasing authentic pieces or requesting a custom commission.
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans rounded-xl p-3 flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                  Your Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="patron@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                  Enquiry Type
                </label>
                <select
                  value={formData.enquiryType}
                  onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35] transition-colors"
                >
                  <option value="custom_commission">Custom Commission / Bespoke Artwork</option>
                  <option value="buy_existing">Purchase an Existing Masterpiece</option>
                  <option value="workshop">Artisan Workshop / Masterclass Request</option>
                  <option value="bulk_order">Corporate / Bulk Gifting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                  Your Message or Specifications
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about size, theme, delivery timeline, or any custom ideas..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-[#702D35] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#702D35] text-white py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#582128] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send size={15} />
                {submitting ? 'Delivering...' : 'Send Enquiry Directly to Artisan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const waNumber = '6281234567890'; // WhatsApp CS BengkelMotor

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = message.trim() || 'Halo Admin BengkelMotor, saya ingin konsultasi dan tanya jadwal servis motor.';
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Pop-up Chat Card with Glassmorphism */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden animate-scale-in ring-1 ring-slate-900/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  🛵
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-tight">CS BengkelMotor</div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>Online</span> • Respon Cepat (08.00-17.00)
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Message */}
          <div className="p-4 bg-slate-50/70 space-y-3">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200/70 shadow-2xs text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900">Halo! Selamat datang di BengkelMotor 👋</p>
              <p className="text-slate-500">Ada kendala dengan motor Anda atau ingin tanya jadwal servis kosong? Langsung chat kami via WhatsApp ya!</p>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Tanya Biaya Servis Rutin',
                'Cek Ketersediaan Sparepart',
                'Bantuan Booking Slot',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setMessage(chip)}
                  className="text-[10px] font-semibold bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 px-2.5 py-1 rounded-full transition active:scale-95 shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan ke CS bengkel..."
              className="w-full text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl shadow-md transition active:scale-90 flex-shrink-0"
              title="Kirim ke WhatsApp"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-full shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat WhatsApp CS Bengkel"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 pointer-events-none" />
          <MessageCircle className="h-5 w-5 fill-current" />
        </span>
        <span className="font-bold text-xs sm:text-sm tracking-tight hidden sm:inline-block">
          Chat CS Bengkel
        </span>
      </button>
    </div>
  );
};
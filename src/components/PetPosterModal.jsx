import React, { useState, useRef } from 'react';
import { usePaws } from '../context/PawsContext';
import { X, Printer, Download, Copy, Check, Share2, Phone, MapPin, Calendar, Tag, Info, MessageCircle } from 'lucide-react';


export const PetPosterModal = ({ pet, onClose }) => {
  const { siteConfig, currency } = usePaws();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const posterRef = useRef(null);

  if (!pet) return null;

  const rewardSymbol = pet.currencySymbol || currency.symbol;
  const rewardText = pet.rewardActive && pet.rewardAmount ? `${rewardSymbol} ${pet.rewardAmount}` : '';

  const socialHandles = {
    instagram: "@pawsfinder.official",
    tiktok: "@pawsfinder.nepal",
    linktree: "linktr.ee/pawsfinder",
    linkedin: "PawsFinder Network",
    whatsapp: siteConfig.whatsappNumber
  };

  const shareableText = `PLEASE HELP FIND ${pet.name.toUpperCase()}!

${pet.name} went missing near ${pet.lastSeenLocation} on ${new Date(pet.lostDate).toLocaleDateString()}.

Breed: ${pet.breed} (${pet.age || 'Age N/A'}, ${pet.gender || 'Unknown'})
Last Seen: ${pet.lastSeenLocation}
Date Lost: ${new Date(pet.lostDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
${pet.rewardActive && pet.rewardAmount ? `Reward Offered: ${rewardText}\n` : ''}
Distinctive Markings:
${pet.markings}

Behavior & Friendly Instructions:
${pet.behaviorNotes}

IF YOU SEE ${pet.name.toUpperCase()}, PLEASE CALL OR TEXT IMMEDIATELY:
Contact: ${pet.contactName || 'Pet Parent'}
Phone: ${pet.contactPhone}
WhatsApp: ${siteConfig.whatsappNumber}

Follow updates & share:
Instagram: ${socialHandles.instagram} | TikTok: ${socialHandles.tiktok} | Linktree: ${socialHandles.linktree}

Please share this with your friends, family, and neighborhood groups! Thank you so much!`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const link = document.createElement('a');
      link.download = `PAWSFINDER_POSTER_${pet.name}_${pet.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to render poster image:", err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">

      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">

        {/* Controls Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${pet.status === 'missing' ? 'bg-red-600 text-white' :
              pet.status === 'sighted' ? 'bg-amber-500 text-slate-950' :
                'bg-emerald-500 text-slate-950'
              }`}>
              {pet.status === 'missing' ? 'MISSING PET' : pet.status === 'sighted' ? 'SIGHTED' : 'REUNITED'}
            </span>
            <span className="text-xs font-medium text-slate-400">Notice #{pet.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Print Poster</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-md shadow-indigo-950"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Preparing PNG...' : 'Save PNG Poster'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">

          {/* HIGH-VISIBILITY STREET PRINTABLE POSTER CONTAINER */}
          <div
            id="printable-poster"
            ref={posterRef}
            style={{ backgroundColor: '#ffffff', color: '#0f172a', borderColor: '#dc2626' }}
            className="rounded-3xl p-6 sm:p-10 shadow-2xl border-8 relative overflow-hidden font-sans space-y-6"
          >
            {/* Top Brand Logo & Community Line */}
            <div style={{ borderColor: '#0f172a' }} className="flex items-center justify-between border-b-4 pb-4">
              <div className="h-12 w-52 flex items-center">
                <img
                  src={siteConfig.logoUrl}
                  alt={siteConfig.appTitle}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="text-right">
                <p style={{ color: '#dc2626' }} className="text-xs font-extrabold uppercase tracking-wider">NEIGHBORHOOD PET ALERT</p>
                <p style={{ color: '#64748b' }} className="text-[11px] font-bold">PAWSFINDER RECOVERY NETWORK</p>
              </div>
            </div>

            {/* STREET HEADLINE */}
            <div style={{ backgroundColor: '#dc2626', color: '#ffffff' }} className="text-center py-4 px-6 rounded-2xl shadow-md space-y-1">
              <h1 className="text-3xl sm:text-6xl font-black tracking-tight uppercase leading-none">
                HAVE YOU SEEN {pet.name.toUpperCase()}?
              </h1>
              <p style={{ color: '#fef2f2' }} className="text-xs sm:text-base font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <span>PLEASE HELP BRING OUR BELOVED PET HOME SAFE</span>
              </p>
            </div>

            {/* PROMINENT REWARD BADGE */}
            {pet.rewardActive && pet.rewardAmount && (
              <div style={{ backgroundColor: '#f59e0b', color: '#451a03', borderColor: '#d97706' }} className="text-center py-3 px-6 rounded-2xl border-2 shadow-md">
                <div className="text-2xl sm:text-4xl font-black uppercase tracking-wide">
                  REWARD OFFERED: {rewardText}
                </div>
                <p style={{ color: '#78350f' }} className="text-xs font-extrabold uppercase tracking-wider mt-0.5">
                  REWARD FOR INFORMATION LEADING TO SAFE RETURN
                </p>
              </div>
            )}

            {/* MAIN POSTER GRID: PET PHOTO & VITAL INFORMATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start my-4">

              {/* Pet Photo Frame */}
              <div className="space-y-4">
                <div style={{ borderColor: '#0f172a', backgroundColor: '#f8fafc' }} className="aspect-square w-full rounded-2xl overflow-hidden border-4 shadow-xl relative">
                  <img
                    src={pet.photoUrl || "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80"}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                  <div style={{ backgroundColor: '#020617', color: '#ffffff' }} className="absolute bottom-3 left-3 right-3 py-2 px-3 rounded-xl text-center">
                    <span className="text-lg font-black">{pet.name}</span>
                    <span style={{ color: '#cbd5e1' }} className="text-xs font-bold block">{pet.breed} • {pet.age} • {pet.gender}</span>
                  </div>
                </div>
              </div>

              {/* Vital Information Details */}
              <div className="space-y-4">

                {/* Location & Time */}
                <div style={{ backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }} className="p-4 rounded-2xl border-2 space-y-3">
                  <div className="flex items-start gap-3">
                    <div style={{ backgroundColor: '#dc2626', color: '#ffffff' }} className="p-2 rounded-xl shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }} className="text-xs font-extrabold uppercase block">Last Seen Location</span>
                      <span style={{ color: '#0f172a' }} className="text-base font-black">{pet.lastSeenLocation}</span>
                    </div>
                  </div>

                  <div style={{ borderColor: '#e2e8f0' }} className="flex items-start gap-3 border-t pt-3">
                    <div style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} className="p-2 rounded-xl shrink-0 mt-0.5">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }} className="text-xs font-extrabold uppercase block">Date & Time Lost</span>
                      <span style={{ color: '#0f172a' }} className="text-sm font-bold">
                        {new Date(pet.lostDate).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Distinctive Markings */}
                <div style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }} className="p-4 rounded-2xl border-2 space-y-1">
                  <span style={{ color: '#78350f' }} className="text-xs font-extrabold uppercase flex items-center gap-1.5">
                    <Tag className="w-4 h-4" /> Distinctive Markings & Features
                  </span>
                  <p style={{ color: '#0f172a' }} className="text-sm font-bold leading-snug">
                    {pet.markings || "Standard breed coat markings. Wearing collar."}
                  </p>
                </div>

                {/* Behavior & Handling */}
                <div style={{ backgroundColor: '#eff6ff', borderColor: '#93c5fd' }} className="p-4 rounded-2xl border-2 space-y-1">
                  <span style={{ color: '#1e3a8a' }} className="text-xs font-extrabold uppercase flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> Behavior & Friendly Handling
                  </span>
                  <p style={{ color: '#1e293b' }} className="text-xs font-bold leading-relaxed">
                    {pet.behaviorNotes || "Very friendly! Please approach gently or call phone immediately."}
                  </p>
                </div>

              </div>

            </div>

            {/* GIANT CONTACT BOX WITH WHATSAPP */}
            <div style={{ backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#ef4444' }} className="rounded-2xl p-6 border-4 shadow-2xl space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div>
                  <span style={{ color: '#fbbf24' }} className="text-xs font-black uppercase tracking-wider block">IF SPOTTED, PLEASE CALL OR TEXT IMMEDIATELY:</span>
                  <h3 className="text-2xl font-black">{pet.contactName || 'Pet Parent'}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-1">
                    <a
                      href={`tel:${pet.contactPhone}`}
                      style={{ color: '#f87171' }}
                      className="text-3xl sm:text-4xl font-black hover:underline flex items-center gap-2"
                    >
                      <Phone className="w-8 h-8 animate-bounce" />
                      <span>{pet.contactPhone}</span>
                    </a>
                  </div>
                </div>

                {/* WhatsApp Quick Link Box */}
                <div style={{ backgroundColor: '#064e3b', borderColor: '#10b981' }} className="p-3.5 rounded-2xl border-2 text-center shrink-0">
                  <span style={{ color: '#a7f3d0' }} className="text-[11px] font-black uppercase block mb-1">WhatsApp Rescue Chat</span>
                  <a
                    href={`https://wa.me/${socialHandles.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: '#059669', color: '#ffffff' }}
                    className="text-sm font-black flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Rescue Chat</span>
                  </a>
                </div>
              </div>
            </div>

            {/* POSTER SOCIAL MEDIA ICONS FOOTER STRIP */}
            <div style={{ borderColor: '#cbd5e1' }} className="pt-4 border-t-2">
              <div className="text-center mb-3">
                <span style={{ color: '#334155' }} className="text-xs font-black uppercase tracking-wider">
                  CONNECT & SHARE THIS ALERT ON SOCIAL MEDIA
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">

                {/* Instagram Icon */}
                <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-2.5 rounded-xl border flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 fill-current shrink-0" style={{ color: '#db2777' }} viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span style={{ color: '#1e293b' }} className="text-[11px] font-bold">Instagram</span>
                </div>

                {/* TikTok Icon */}
                <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-2.5 rounded-xl border flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 fill-current shrink-0" style={{ color: '#0f172a' }} viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.29 0 .56.04.82.1v-3.5a6.37 6.37 0 00-.82-.05A6.34 6.34 0 003.15 15.6a6.34 6.34 0 0010.86 4.45V11.2a8.27 8.27 0 005.58 2.15v-3.5a4.8 4.8 0 01-3.4-1.46 4.83 4.83 0 01-1.46-3.4h3.45v1.7z" />
                  </svg>
                  <span style={{ color: '#1e293b' }} className="text-[11px] font-bold">TikTok</span>
                </div>

                {/* Linktree Icon */}
                <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-2.5 rounded-xl border flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 fill-current shrink-0" style={{ color: '#059669' }} viewBox="0 0 24 24">
                    <path d="M13.511 5.853l3.963-3.963 1.414 1.414-3.963 3.963 3.963 3.963-1.414 1.414-3.963-3.963v6.321h-2v-6.321l-3.963 3.963-1.414-1.414 3.963-3.963-3.963-3.963 1.414-1.414 3.963 3.963v-4.853h2v4.853zm-6.511 12.147h10v2h-10z" />
                  </svg>
                  <span style={{ color: '#1e293b' }} className="text-[11px] font-bold">Linktree</span>
                </div>

                {/* LinkedIn Icon */}
                <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-2.5 rounded-xl border flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 fill-current shrink-0" style={{ color: '#0284c7' }} viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
                  </svg>
                  <span style={{ color: '#1e293b' }} className="text-[11px] font-bold">LinkedIn</span>
                </div>

                {/* WhatsApp Icon */}
                <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-2.5 rounded-xl border flex items-center justify-center gap-2 col-span-2 sm:col-span-1">
                  <MessageCircle className="w-5 h-5 fill-current shrink-0" style={{ color: '#059669' }} />
                  <span style={{ color: '#1e293b' }} className="text-[11px] font-bold">WhatsApp</span>
                </div>

              </div>

              <div style={{ color: '#64748b' }} className="text-center text-[11px] font-medium mt-3">
                Printed via PawsFinder Lost Pet Network • www.pawsfinder.org
              </div>
            </div>

          </div>

          {/* Social Media Broadcast Message */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-200">Social Media Share Message</h3>
              </div>
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Message'}</span>
              </button>
            </div>

            <textarea
              readOnly
              value={shareableText}
              rows={7}
              className="w-full bg-slate-900 text-slate-300 text-xs font-mono p-3.5 rounded-xl border border-slate-800 focus:outline-none resize-none"
            />
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Volume2,
  VolumeX,
  Sparkles,
  Copy,
  Check,
  X,
  ChevronDown,
  Navigation,
  Globe,
  Camera,
  Mail,
  Send,
  Star,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // State
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);
  const [lang, setLang] = useState('en'); // 'en' | 'ml'
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeVenueTab, setActiveVenueTab] = useState('nikkah'); // 'nikkah' | 'reception'
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [blessingCount, setBlessingCount] = useState(148);
  const [hasBlessed, setHasBlessed] = useState(false);
  const [userDua, setUserDua] = useState('');
  const [submittedDuas, setSubmittedDuas] = useState([
    { name: 'Family & Friends', text: 'May Allah bless your marriage with endless happiness, love and barakah! Ameen 🤲', time: 'Just now' },
    { name: 'നാട്ടുകാർ & ബന്ധുക്കൾ', text: 'അല്ലാഹു നിങ്ങളുടെ ദാമ്പത്യ ജീവിതം സമാധാനവും സന്തോഷവും നിറഞ്ഞതാക്കട്ടെ.', time: '5m ago' }
  ]);

  // Audio Ref (Baraka Allahu Lakuma Nasheed)
  const audioRef = useRef(null);

  // Scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toast Helper
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Play / Pause Nasheed
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
      showToast(lang === 'en' ? 'Nasheed paused' : 'നഷീദ് താൽക്കാലികമായി നിർത്തി');
    } else {
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
        showToast(lang === 'en' ? 'Playing: Baraka Allahu Lakuma 🎵' : 'ഗാനം പ്ലേ ചെയ്യുന്നു: ബാരകല്ലാഹു ലക്കുമ 🎵');
      }).catch((e) => {
        console.error('Playback error:', e);
      });
    }
  };

  // Open Envelope Animation & Start Audio
  const handleOpenEnvelope = () => {
    setIsOpeningAnim(true);

    // Confetti burst
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#faebb9', '#d4a34b', '#1e5245', '#ffffff', '#e2b96d']
    });

    // Attempt audio play immediately on user gesture
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch((e) => {
        console.log('Audio autoplay prevented:', e);
      });
    }

    setTimeout(() => {
      setIsEnvelopeOpen(true);
      setIsOpeningAnim(false);
      showToast(lang === 'en' ? 'Welcome to our celebration! 💍' : 'ഞങ്ങളുടെ വിവാഹത്തിലേക്ക് ഹൃദ്യമായ സ്വാഗതം! 💍');
    }, 700);
  };

  // Re-close envelope
  const handleResetEnvelope = () => {
    setIsEnvelopeOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Countdown timer to Nikkah (Dec 23, 2026, 19:00 IST)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });
  useEffect(() => {
    const targetDate = new Date('2026-12-23T19:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Send Blessing Button
  const handleSendBlessing = (customText = null) => {
    setBlessingCount((prev) => prev + 1);
    setHasBlessed(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#faebb9', '#d4a34b', '#ff4d6d', '#ffffff']
    });

    const blessingMsg = customText || (lang === 'en' ? 'Barakallahu Lakuma wa Baraka Alaykuma! 🤲' : 'അല്ലാഹു അനുഗ്രഹിക്കട്ടെ! ആമീൻ 🤲');
    showToast(blessingMsg);

    if (customText) {
      setSubmittedDuas((prev) => [
        { name: lang === 'en' ? 'Well-Wisher' : 'സ്നേഹിതൻ', text: customText, time: 'Just now' },
        ...prev
      ]);
      setUserDua('');
    }
  };

  // Copy address
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    showToast(lang === 'en' ? 'Address copied to clipboard!' : 'മേൽവിലാസം പകർത്തി!');
    setTimeout(() => setCopiedAddress(null), 2500);
  };

  // Download ICS Calendar File
  const downloadICS = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Muhammed Ameen and Farseena Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:ameen-farseena-nikkah-20261223@wedding',
      'DTSTAMP:20261112T120000Z',
      'DTSTART:20261223T133000Z',
      'DTEND:20261223T163000Z',
      'SUMMARY:Nikkah: Muhammed Ameen & Farseena',
      'DESCRIPTION:With the blessings of Allah, joining in marriage. Groom: Muhammed Ameen, Bride: Farseena.',
      'LOCATION:Dawa Community Hall, Kanjiramukku, Maranchery, Kerala',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:ameen-farseena-reception-20261224@wedding',
      'DTSTAMP:20261112T120000Z',
      'DTSTART:20261224T053000Z',
      'DTEND:20261224T103000Z',
      'SUMMARY:Wedding Reception: Muhammed Ameen & Farseena',
      'DESCRIPTION:Grand Wedding Reception of Muhammed Ameen & Farseena.',
      'LOCATION:Beevus Hall, Purangu, Maranchery, Kerala',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Ameen-Weds-Farseena-Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(lang === 'en' ? 'Event added to calendar (.ics)' : 'കലണ്ടർ ഫയൽ ഡൗൺലോഡ് ചെയ്തു');
  };

  // Share invitation
  const shareDetails = () => {
    const title = '💍 Muhammed Ameen weds Farseena — Wedding Invitation';
    const text = lang === 'en'
      ? `💍 Two hearts, one beautiful journey! ❤️\n\nWith immense joy and love, you are cordially invited to celebrate the marriage of Muhammed Ameen & Farseena.\n\n✨ Nikkah: Wednesday, Dec 23, 2026 at 7:00 PM (Dawa Community Hall, Kanjiramukku)\n🎉 Wedding Day: Thursday, Dec 24, 2026 (Beevus Hall, Purangu, Maranchery)\n\nTap to view the digital invitation:`
      : `💍 അല്ലാഹുവിന്റെ അനുഗ്രഹത്താൽ ഞങ്ങളുടെ മകൻ മുഹമ്മദ് അമീനും ഫർസീനയും വിവാഹിതരാവുകയാണ്.\n\n✨ നിക്കാഹ്: 2026 ഡിസംബർ 23 ബുധൻ വൈകീട്ട് 7:00 മണിക്ക് (ദഅ്‌വാ കമ്യൂണിറ്റി ഹാൾ, കാഞ്ഞിരമുക്ക്)\n🎉 വിവാഹ സുദിനം: 2026 ഡിസംബർ 24 വ്യാഴം (ബീവൂസ് ഹാൾ, പുറങ്ങ്, മാറഞ്ചേരി)\n\nതാങ്കളുടെ കുടുംബസമേതമുള്ള സാന്നിധ്യം സാദരം ക്ഷണിക്കുന്നു.\nവിവാഹ ക്ഷണക്കത്ത് കാണാൻ ഈ ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക:`;

    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title, text, url }).catch((e) => {
        if (e.name !== 'AbortError') copyToClipboard(`${text}\n${url}`, 'share');
      });
    } else {
      copyToClipboard(`${text}\n${url}`, 'share');
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `💍 Two hearts, one beautiful journey! ❤️\n\nWith immense joy, we invite you to be part of the wedding celebration of *Muhammed Ameen & Farseena*.\n\n📅 *Nikkah:* Wednesday, Dec 23, 2026 - 7:00 PM\n📍 *Venue:* Dawa Community Hall, Kanjiramukku\n\n📅 *Wedding Day:* Thursday, Dec 24, 2026\n📍 *Venue:* Beevus Hall, Purangu, Maranchery\n\n✨ View our digital wedding invitation:\n${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Google Maps URLs
  const beevusMapUrl = 'https://www.google.com/maps/search/?api=1&query=Beevus+Purangu+Maranchery+Kerala';
  const dawaMapUrl = 'https://www.google.com/maps/search/?api=1&query=Dawa+Community+Hall+Kanjiramukku+Maranchery+Kerala';

  return (
    <div className="min-h-screen bg-[#c2ceca] font-sans relative selection:bg-[#d4a34b] selection:text-[#0a201a]">
      {/* Hidden Audio Element for Islamic Nasheed */}
      <audio ref={audioRef} src="/nasheed.mp3" loop preload="auto" />

      {/* Top Reading Progress Bar */}
      {isEnvelopeOpen && (
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#d4a34b] via-[#faebb9] to-[#d4a34b] z-50 transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      )}

      {/* =========================================================================
          FIRST-TIME OPENING INTERACTIVE ENVELOPE OVERLAY
         ========================================================================= */}
      {!isEnvelopeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071915]/95 backdrop-blur-md overflow-hidden">
          {/* Subtle Islamic geometric starfield */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#faebb9_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Luxury Envelope Container */}
          <div
            className={`relative w-full max-w-[460px] bg-gradient-to-b from-[#0e2b24] via-[#12362e] to-[#091f1a] rounded-3xl border-2 border-[#d4a34b] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] text-center text-[#f4ead6] transition-all duration-700 ${
              isOpeningAnim ? 'scale-105 opacity-0 -translate-y-6 rotate-1' : 'scale-100 opacity-100 translate-y-0'
            }`}
          >
            {/* Top Envelope Flap Triangle Graphic */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-48 h-6 bg-[#d4a34b]/20 rounded-b-full border-b border-[#d4a34b]/50" />

            {/* Bismillah Header */}
            <div className="font-arabic text-xl sm:text-2xl text-[#faebb9] mb-1" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4a34b] font-semibold mb-6">
              Assalamu Alaikum
            </div>

            {/* Glowing Royal Gold Wax Seal */}
            <div className="relative my-4 flex items-center justify-center">
              <button
                onClick={handleOpenEnvelope}
                className="group relative w-32 h-32 rounded-full bg-gradient-to-tr from-[#9d7122] via-[#f7e4b2] to-[#b1812e] p-1.5 shadow-[0_0_35px_rgba(212,163,75,0.6)] hover:shadow-[0_0_50px_rgba(250,235,185,0.9)] hover:scale-105 transition-all duration-300"
              >
                {/* Inner Wax Ring */}
                <div className="w-full h-full rounded-full bg-[#0a201a] border-2 border-[#faebb9] flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-[#0e2b24] transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#faebb9]/10 to-transparent animate-pulse" />
                  <span className="font-script text-4xl text-gold-gradient leading-none pt-2">
                    A<i className="font-serif italic text-xl px-0.5 text-[#e6be6d]">&</i>F
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#e6be6d] mt-1">
                    Tap to Open
                  </span>
                </div>

                {/* Outer Rotating Sparkle Ring */}
                <div className="absolute -inset-2 rounded-full border border-dashed border-[#faebb9]/40 animate-spin-slow pointer-events-none" />
              </button>
            </div>

            {/* Names & Event Title */}
            <div className="my-5 space-y-1">
              <div className="text-xs uppercase tracking-[0.25em] text-[#e6be6d] font-medium">
                {lang === 'en' ? 'Wedding Invitation' : 'വിവാഹ ക്ഷണക്കത്ത്'}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gold-light tracking-tight">
                {lang === 'en' ? 'Muhammed Ameen & Farseena' : 'മുഹമ്മദ് അമീൻ & ഫർസീന'}
              </h1>
              <div className="text-[11px] text-[#faebb9]/80 uppercase tracking-widest pt-1">
                23 & 24 December 2026 · Maranchery
              </div>
            </div>

            {/* Interactive Open Invitation CTA */}
            <button
              onClick={handleOpenEnvelope}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d4a34b] via-[#faebb9] to-[#d4a34b] text-[#091f1a] font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <Mail className="w-4 h-4 text-[#091f1a] group-hover:rotate-12 transition-transform" />
              <span>{lang === 'en' ? 'Open Invitation & Play Nasheed' : 'ക്ഷണക്കത്ത് തുറക്കുക'}</span>
              <Sparkles className="w-4 h-4 text-[#091f1a]" />
            </button>

            {/* Language Switcher on Envelope */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
                className="inline-flex items-center gap-1.5 text-[11px] text-[#faebb9]/80 hover:text-[#faebb9] underline underline-offset-4"
              >
                <Globe className="w-3.5 h-3.5 text-[#d4a34b]" />
                <span>{lang === 'en' ? 'മലയാളത്തിൽ കാണുക' : 'Switch to English'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Controls (Top Navigation Bar) */}
      {isEnvelopeOpen && (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[540px] flex items-center justify-between px-4 py-2.5 rounded-full bg-[#091f1a]/90 backdrop-blur-md border border-[#d4a34b]/40 shadow-xl shadow-black/25 text-[#fbf7ef]">
          {/* Monogram / Home */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-[#d4a34b] flex items-center justify-center font-script text-[#faebb9] text-xl pt-1 bg-[#143c32]">
              A&F
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#e6be6d] leading-none">
                Ameen & Farseena
              </span>
              <span className="text-[8.5px] uppercase tracking-wider text-[#d4a34b]/80">
                23 & 24 Dec 2026
              </span>
            </div>
          </div>

          {/* Action Buttons: Language toggle, Music, Envelope reset */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Re-open Envelope */}
            <button
              onClick={handleResetEnvelope}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#143c32] hover:bg-[#1e5245] border border-[#d4a34b]/40 text-[#faebb9] transition-all hover:scale-105"
              title="Close to Envelope View"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d4a34b]" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => {
                setLang(lang === 'en' ? 'ml' : 'en');
                showToast(lang === 'en' ? 'മലയാളത്തിലേക്ക് മാറ്റി' : 'Switched to English');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#143c32] hover:bg-[#1e5245] border border-[#d4a34b]/50 text-xs font-semibold text-[#faebb9] transition-all hover:scale-105"
            >
              <Globe className="w-3 h-3 text-[#d4a34b]" />
              <span>{lang === 'en' ? 'മലയാളം' : 'English'}</span>
            </button>

            {/* Audio Toggle (Baraka Allahu Lakuma) */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:scale-105 ${
                isAudioPlaying
                  ? 'bg-gradient-to-r from-[#d4a34b] to-[#faebb9] text-[#091f1a] border-[#faebb9] shadow-[0_0_12px_rgba(212,163,75,0.6)]'
                  : 'bg-[#143c32] text-[#e6be6d] border-[#d4a34b]/40'
              }`}
              title={isAudioPlaying ? 'Mute Nasheed' : 'Play Baraka Allahu Lakuma'}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span className="hidden sm:inline text-[10px]">Playing</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Music</span>
                </>
              )}
            </button>
          </div>
        </nav>
      )}

      {/* Main Container - Mobile-First Luxury Wedding Card Layout */}
      <main className="max-w-[560px] mx-auto bg-[#fbf7ef] shadow-2xl relative overflow-hidden text-[#3a2818] border-x border-[#c2b29c]/30">

        {/* HERO SECTION */}
        <section
          id="hero"
          className="min-h-[100svh] relative flex flex-col justify-between p-4 sm:p-6 pt-24 pb-12 bg-hero-gradient text-[#f4ead6] overflow-hidden text-center"
        >
          {/* Decorative Islamic Background Elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4a34b_1px,transparent_1px)] [background-size:20px_20px]" />
          
          {/* Corner Floral Arabesques (SVG) */}
          <div className="absolute top-2 left-2 w-28 h-28 opacity-40 pointer-events-none rotate-0">
            <svg viewBox="0 0 100 100" fill="none" stroke="#d4a34b" strokeWidth="1.2">
              <path d="M5,5 Q50,10 95,50 Q10,50 5,5 Z" />
              <circle cx="50" cy="50" r="15" />
              <circle cx="20" cy="20" r="6" />
            </svg>
          </div>
          <div className="absolute top-2 right-2 w-28 h-28 opacity-40 pointer-events-none -scale-x-100">
            <svg viewBox="0 0 100 100" fill="none" stroke="#d4a34b" strokeWidth="1.2">
              <path d="M5,5 Q50,10 95,50 Q10,50 5,5 Z" />
              <circle cx="50" cy="50" r="15" />
              <circle cx="20" cy="20" r="6" />
            </svg>
          </div>

          {/* Grand Arch Frame */}
          <div className="ornate-arch flex-1 flex flex-col items-center justify-center p-6 sm:p-8 my-auto relative z-10 backdrop-blur-[1px]">
            {/* Islamic Crescent & Star Symbol */}
            <div className="mb-3 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#e6be6d] drop-shadow-[0_0_12px_rgba(230,190,109,0.5)]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10 A 40 40 0 1 0 90 70 A 32 32 0 1 1 50 10 Z" />
                <polygon points="68,26 71,34 79,34 73,39 75,47 68,42 61,47 63,39 57,34 65,34" />
              </svg>
            </div>

            {/* Arabic Calligraphy (Assalamu Alaikum) */}
            <div className="font-arabic text-xl sm:text-2xl text-[#faebb9] tracking-wider mb-1" dir="rtl">
              أَسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
            </div>
            <div className="text-[11px] tracking-[0.28em] text-[#d4a34b] uppercase font-semibold mb-4">
              {lang === 'en' ? 'By the Grace & Blessings of Allah' : 'അല്ലാഹുവിന്റെ അനുഗ്രഹത്താൽ'}
            </div>

            {/* Rotating Seal Monogram */}
            <div className="relative w-44 h-44 my-2 flex items-center justify-center">
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <path id="sealPathMain" d="M100,16 A84,84 0 1,1 99.9,16" fill="none" />
                  <text className="text-[9.5px] uppercase font-bold tracking-[0.24em] fill-[#e6be6d]">
                    <textPath href="#sealPathMain" textLength="527">
                      TWO HEARTS ✦ ONE LIFETIME ✦ 23 & 24 DECEMBER 2026 ✦
                    </textPath>
                  </text>
                </svg>
              </div>
              {/* Center Monogram */}
              <div className="w-28 h-28 rounded-full border border-[#d4a34b]/60 flex flex-col items-center justify-center bg-[#091f1a]/80 shadow-inner">
                <span className="font-script text-4xl text-gold-gradient leading-none pt-2">
                  A<i className="font-serif italic text-xl px-1 text-[#e6be6d]">&</i>F
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#d4a34b] font-medium mt-1">Union</span>
              </div>
            </div>

            {/* Subtitle Invitation */}
            <p className="text-xs uppercase tracking-[0.25em] text-[#e6be6d]/90 font-medium mt-3 mb-2 max-w-[320px] leading-relaxed">
              {lang === 'en'
                ? 'We cordially invite you to celebrate the wedding ceremony of'
                : 'ഞങ്ങളുടെ മകൻ വിവാഹിതനാവുന്ന ശുഭവാർത്ത അറിയിക്കുന്നു'}
            </p>

            {/* Couple Names */}
            <div className="my-2 space-y-1">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-gold-light tracking-tight">
                {lang === 'en' ? 'Muhammed Ameen' : 'മുഹമ്മദ് അമീൻ'}
              </h1>
              <div className="flex items-center justify-center gap-3 my-1">
                <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#d4a34b]" />
                <span className="font-script text-2xl text-[#faebb9]">{lang === 'en' ? 'weds' : 'വിവാഹം'}</span>
                <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#d4a34b]" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-gold-light tracking-tight">
                {lang === 'en' ? 'Farseena' : 'ഫർസീന'}
              </h2>
            </div>

            {/* Date Badge */}
            <div className="mt-4 pt-3 border-t border-[#d4a34b]/40 w-full max-w-[320px] flex items-center justify-around text-center">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#d4a34b]">Nikkah</span>
                <span className="font-serif text-lg font-bold text-[#fff7de]">23 Dec</span>
                <span className="block text-[9px] uppercase text-[#e6be6d]/80">Wednesday 7 PM</span>
              </div>
              <div className="h-8 w-[1px] bg-[#d4a34b]/40" />
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-[#d4a34b]">Wedding</span>
                <span className="font-serif text-lg font-bold text-[#fff7de]">24 Dec</span>
                <span className="block text-[9px] uppercase text-[#e6be6d]/80">Thursday (Rajab 14)</span>
              </div>
            </div>

            {/* View Printed Card Lightbox Trigger */}
            <button
              onClick={() => setShowModal(true)}
              className="mt-5 inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-[#faebb9] bg-[#143c32]/80 hover:bg-[#1e5245] border border-[#d4a34b] px-4 py-2 rounded-full transition-all hover:scale-105"
            >
              <Camera className="w-3.5 h-3.5 text-[#d4a34b]" />
              <span>{lang === 'en' ? 'View Printed Card' : 'അച്ചടിച്ച ക്ഷണക്കത്ത് കാണുക'}</span>
            </button>
          </div>

          {/* Scroll Down Cue */}
          <div className="pt-4 flex flex-col items-center">
            <a href="#families" className="text-[10px] tracking-[0.25em] uppercase text-[#e6be6d]/80 flex flex-col items-center gap-1 hover:text-[#faebb9] transition-colors">
              <span>{lang === 'en' ? 'Scroll to explore' : 'താഴോട്ട് സ്ക്രോൾ ചെയ്യുക'}</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-[#d4a34b]" />
            </a>
          </div>
        </section>


        {/* SECTION 1: TWO FAMILIES */}
        <section id="families" className="px-5 py-16 sm:py-20 text-center bg-[#fbf7ef] relative">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#143c32] font-bold mb-1">
            01 · {lang === 'en' ? 'Two Families' : 'കുടുംബങ്ങൾ'}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0e2b24] font-semibold tracking-tight">
            {lang === 'en' ? 'United in Love & Blessings' : 'സ്നേഹത്തിന്റെ പുണ്യബന്ധം'}
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4a34b]" />
            <div className="diamond-dot" />
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4a34b]" />
          </div>

          <p className="text-sm text-[#675442] max-w-[400px] mx-auto leading-relaxed mb-8">
            {lang === 'en'
              ? 'With the grace of Almighty Allah and the prayers of our elders, we rejoice in bringing together our beloved families.'
              : 'സർവ്വേശ്വരന്റെ അനുഗ്രഹത്താലും മാതാപിതാക്കളുടെ പ്രാർത്ഥനകളാലും രണ്ട് കുടുംബങ്ങൾ ഒന്നിക്കുന്ന ഈ സുദിനത്തിലേക്ക് സ്വാഗതം.'}
          </p>

          {/* Groom Card */}
          <div className="bg-gradient-to-b from-[#f3f7f4] to-[#e4ece7] border border-[#143c32]/25 rounded-2xl p-6 sm:p-7 relative shadow-md hover:shadow-lg transition-shadow">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0e2b24] text-[#faebb9] text-[9.5px] uppercase tracking-[0.2em] font-semibold px-4 py-1 rounded-full shadow">
              {lang === 'en' ? 'The Groom' : 'വരൻ'}
            </span>
            <div className="w-12 h-12 rounded-full border border-[#d4a34b] mx-auto flex items-center justify-center font-script text-2xl text-[#9d7122] mb-3 bg-white/60">
              A
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0e2b24] mb-1">
              {lang === 'en' ? 'Muhammed Ameen' : 'മുഹമ്മദ് അമീൻ'}
            </h3>
            
            {/* Groom's Parents */}
            <div className="text-xs uppercase tracking-wider text-[#9d7122] font-semibold mb-3">
              {lang === 'en' ? 'Son of Mr. Seethi K.M. & Mrs. Fathima K.M.' : 'Mr. സീതി KM & Mrs. ഫാത്തിമ KM ദമ്പതികളുടെ മകൻ'}
            </div>

            {/* Groom's Address */}
            <div className="flex items-start justify-center gap-2 text-xs text-[#5a4837] leading-relaxed max-w-[340px] mx-auto">
              <MapPin className="w-4 h-4 text-[#d4a34b] flex-shrink-0 mt-0.5" />
              <span>
                {lang === 'en' ? (
                  <>
                    Kaliyarakath Manatha Parambil<br />
                    M.G. Road Nalakam, Maranchery
                  </>
                ) : (
                  <>
                    കാളിയാരകത്ത് മാനാത്ത പറമ്പിൽ<br />
                    MG റോഡ് നാലകം, മാറഞ്ചേരി
                  </>
                )}
              </span>
            </div>

            {/* Groom's Contact Bar */}
            <div className="mt-4 pt-3 border-t border-[#143c32]/15 flex items-center justify-center gap-3">
              <a
                href="tel:9633509129"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0e2b24] text-[#faebb9] text-xs font-semibold hover:bg-[#143c32] transition-colors"
              >
                <Phone className="w-3 h-3 text-[#d4a34b]" />
                <span>9633509129</span>
              </a>
              <a
                href="https://wa.me/919633509129?text=Congratulations%20Ameen%20and%20family%20on%20the%20wedding!"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Ampersand Connector */}
          <div className="my-4">
            <span className="font-script text-4xl text-[#d4a34b]">&amp;</span>
          </div>

          {/* Bride Card */}
          <div className="bg-[#fffdf9] border border-[#d4a34b]/40 rounded-2xl p-6 sm:p-7 relative shadow-md hover:shadow-lg transition-shadow">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#9d7122] text-[#fff8e7] text-[9.5px] uppercase tracking-[0.2em] font-semibold px-4 py-1 rounded-full shadow">
              {lang === 'en' ? 'The Bride' : 'വധു'}
            </span>
            <div className="w-12 h-12 rounded-full border border-[#d4a34b] mx-auto flex items-center justify-center font-script text-2xl text-[#9d7122] mb-3 bg-[#fbf7ef]">
              F
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0e2b24] mb-1">
              {lang === 'en' ? 'Farseena' : 'ഫർസീന'}
            </h3>
            
            {/* Bride's Parents */}
            <div className="text-xs uppercase tracking-wider text-[#9d7122] font-semibold mb-3">
              {lang === 'en'
                ? 'D/o Mr. Abdurahman (Kunjimon) & Mrs. Fathima'
                : 'അബ്ദുറഹ്മാൻ (കുഞ്ഞിമോൻ) & ഫാത്തിമ ദമ്പതികളുടെ മകൾ'}
            </div>

            {/* Bride's Address */}
            <div className="flex items-start justify-center gap-2 text-xs text-[#5a4837] leading-relaxed max-w-[340px] mx-auto">
              <MapPin className="w-4 h-4 text-[#d4a34b] flex-shrink-0 mt-0.5" />
              <span>
                {lang === 'en' ? (
                  <>
                    Valiya Parambath House<br />
                    Kanjiramukku, Maranchery
                  </>
                ) : (
                  <>
                    വലിയ പറമ്പത്ത് ഹൗസ്<br />
                    കാഞ്ഞിരമുക്ക്, മാറഞ്ചേരി
                  </>
                )}
              </span>
            </div>
          </div>
        </section>


        {/* SECTION 2: SAVE THE DATES & LIVE COUNTDOWN */}
        <section id="dates" className="px-5 py-16 sm:py-20 bg-[#0e2b24] text-[#f4ead6] text-center relative overflow-hidden">
          {/* Subtle Halo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-[#d4a34b]/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-dashed border-[#d4a34b]/25 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4a34b] font-bold mb-1">
              02 · {lang === 'en' ? 'Save The Dates' : 'സുദിനങ്ങൾ'}
            </div>
            <h2 className="font-script text-4xl sm:text-5xl text-[#faebb9] mb-2">
              {lang === 'en' ? 'Counting down to forever' : 'മംഗള മുഹൂർത്തത്തിലേക്ക്'}
            </h2>

            {/* Live Countdown Grid */}
            <div className="grid grid-cols-4 gap-2.5 max-w-[380px] mx-auto my-7">
              <div className="bg-[#143c32]/80 border border-[#d4a34b]/40 rounded-xl p-3 shadow-inner">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#fff7de] block leading-none">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#d4a34b] font-semibold mt-1 block">
                  {lang === 'en' ? 'Days' : 'ദിവസം'}
                </span>
              </div>
              <div className="bg-[#143c32]/80 border border-[#d4a34b]/40 rounded-xl p-3 shadow-inner">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#fff7de] block leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#d4a34b] font-semibold mt-1 block">
                  {lang === 'en' ? 'Hours' : 'മണിക്കൂർ'}
                </span>
              </div>
              <div className="bg-[#143c32]/80 border border-[#d4a34b]/40 rounded-xl p-3 shadow-inner">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#fff7de] block leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#d4a34b] font-semibold mt-1 block">
                  {lang === 'en' ? 'Mins' : 'മിനിറ്റ്'}
                </span>
              </div>
              <div className="bg-[#143c32]/80 border border-[#d4a34b]/40 rounded-xl p-3 shadow-inner">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#faebb9] block leading-none animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#d4a34b] font-semibold mt-1 block">
                  {lang === 'en' ? 'Secs' : 'സെക്കന്റ്'}
                </span>
              </div>
            </div>

            {/* Interactive Calendar for December 2026 */}
            <div className="bg-[#091f1a]/90 border border-[#d4a34b]/40 rounded-2xl p-5 max-w-[360px] mx-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d4a34b]/30">
                <div className="text-sm uppercase tracking-widest font-semibold text-[#faebb9]">
                  December 2026
                </div>
                <div className="text-[11px] text-[#d4a34b] font-serif italic">
                  Rajab 1448 AH
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-[#d4a34b] uppercase mb-2">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>

              {/* Calendar Grid - December 2026 starts on Tuesday (day index 2) */}
              <div className="grid grid-cols-7 gap-1 text-xs">
                <span className="opacity-0">0</span>
                <span className="opacity-0">0</span>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                  const isNikkah = d === 23;
                  const isWedding = d === 24;
                  return (
                    <div
                      key={d}
                      className={`aspect-square rounded-full flex flex-col items-center justify-center transition-all ${
                        isNikkah
                          ? 'bg-gradient-to-tr from-[#d4a34b] to-[#faebb9] text-[#091f1a] font-bold shadow-lg ring-2 ring-[#faebb9] scale-110'
                          : isWedding
                          ? 'bg-[#1e5245] border border-[#d4a34b] text-[#faebb9] font-bold ring-1 ring-[#d4a34b]'
                          : 'text-[#e6be6d]/70 hover:bg-[#143c32]/50'
                      }`}
                    >
                      <span>{d}</span>
                    </div>
                  );
                })}
              </div>

              {/* Legend & Notes */}
              <div className="mt-4 pt-3 border-t border-[#d4a34b]/20 flex flex-col gap-1.5 text-[11px]">
                <div className="flex items-center justify-center gap-2 text-[#faebb9]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#faebb9]" />
                  <span><strong>Dec 23 (Wed, 7 PM):</strong> {lang === 'en' ? 'Nikkah Ceremony' : 'നിക്കാഹ് കർമ്മം'}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-[#e6be6d]">
                  <span className="w-2.5 h-2.5 rounded-full border border-[#d4a34b] bg-[#1e5245]" />
                  <span><strong>Dec 24 (Thu, Rajab 14):</strong> {lang === 'en' ? 'Wedding Reception' : 'വിവാഹ സുദിനം'}</span>
                </div>
              </div>
            </div>

            {/* Add to Calendar & Blessings */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={downloadICS}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4a34b] to-[#faebb9] text-[#091f1a] text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Calendar className="w-4 h-4 text-[#091f1a]" />
                <span>{lang === 'en' ? 'Add To Calendar' : 'കലണ്ടറിലേക്ക് ചേർക്കുക'}</span>
              </button>

              <button
                onClick={() => handleSendBlessing()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#143c32] hover:bg-[#1e5245] border border-[#d4a34b]/60 text-[#faebb9] text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-[#d4a34b]" />
                <span>{lang === 'en' ? 'Send Blessings' : 'പ്രാർത്ഥനകൾ അർപ്പിക്കുക'}</span>
              </button>
            </div>
          </div>
        </section>


        {/* SECTION 3: VENUES & DIRECTIONS */}
        <section id="venues" className="px-5 py-16 sm:py-20 text-center bg-gradient-to-b from-[#fbf7ef] to-[#ede3d1] relative">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#143c32] font-bold mb-1">
            03 · {lang === 'en' ? 'Venues & Locations' : 'വേദികൾ'}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0e2b24] font-semibold tracking-tight">
            {lang === 'en' ? 'Where We Celebrate' : 'വിവാഹ വേദികൾ'}
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4a34b]" />
            <div className="diamond-dot" />
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4a34b]" />
          </div>

          <p className="text-sm text-[#675442] max-w-[420px] mx-auto mb-6">
            {lang === 'en'
              ? 'Please join us at our scheduled venues. Tap "Navigate on Google Maps" for turn-by-turn directions.'
              : 'താഴെ പറയുന്ന വേദികളിലേക്ക് താങ്കളെ കുടുംബസമേതം സ്നേഹപൂർവ്വം സ്വാഗതം ചെയ്യുന്നു. മാപ്പിലൂടെ കൃത്യമായ വഴി അറിയാം.'}
          </p>

          {/* Venue Switcher Tabs */}
          <div className="inline-flex p-1 bg-[#e4ded0] rounded-full border border-[#d4a34b]/40 mb-8 max-w-full">
            <button
              onClick={() => setActiveVenueTab('nikkah')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeVenueTab === 'nikkah'
                  ? 'bg-[#0e2b24] text-[#faebb9] shadow'
                  : 'text-[#675442] hover:text-[#0e2b24]'
              }`}
            >
              {lang === 'en' ? '1. Nikkah (Dec 23)' : '1. നിക്കാഹ് (ഡിസം. 23)'}
            </button>
            <button
              onClick={() => setActiveVenueTab('reception')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeVenueTab === 'reception'
                  ? 'bg-[#0e2b24] text-[#faebb9] shadow'
                  : 'text-[#675442] hover:text-[#0e2b24]'
              }`}
            >
              {lang === 'en' ? '2. Wedding Day (Dec 24)' : '2. വിവാഹ വേദി (ഡിസം. 24)'}
            </button>
          </div>

          {/* Venue Details Cards */}
          {activeVenueTab === 'nikkah' ? (
            /* NIKKAH VENUE CARD */
            <div className="bg-[#fffdf9] border-2 border-[#143c32] rounded-3xl p-6 sm:p-8 shadow-xl text-center relative transition-all">
              <span className="bg-[#143c32] text-[#faebb9] text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full inline-block mb-3">
                {lang === 'en' ? 'Wednesday · 23 December 2026 · 7:00 PM' : '2026 ഡിസംബർ 23 · ബുധൻ · വൈകിട്ട് 7 മണി'}
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#0e2b24] mb-1">
                {lang === 'en' ? "Da'wa Community Hall" : 'ദഅ്‌വാ കമ്യൂണിറ്റി ഹാൾ'}
              </h3>
              <p className="font-script text-2xl text-[#9d7122] mb-3">
                {lang === 'en' ? 'Kanjiramukku, Maranchery' : 'കാഞ്ഞിരമുക്ക്'}
              </p>

              <div className="bg-[#f6f2e8] p-4 rounded-xl border border-[#d4a34b]/30 max-w-[360px] mx-auto text-xs text-[#524131] space-y-1 mb-6">
                <div className="font-semibold text-[#0e2b24]">
                  {lang === 'en' ? 'Nikkah & Reception Evening' : 'നിക്കാഹ് ചടങ്ങുകൾ'}
                </div>
                <div>Kanhiramukku - Biyyam Road, Kanjiramukku</div>
                <div>Malappuram District, Kerala — PIN 679584</div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={dawaMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0e2b24] text-[#faebb9] text-xs font-bold uppercase tracking-wider hover:bg-[#143c32] shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Navigation className="w-4 h-4 text-[#d4a34b]" />
                  <span>{lang === 'en' ? 'Navigate on Google Maps' : 'ഗൂഗിൾ മാപ്പ് വഴി കാണുക'}</span>
                </a>

                <button
                  onClick={() =>
                    copyToClipboard(
                      "Da'wa Community Hall, Kanhiramukku, Maranchery, Malappuram, Kerala 679584",
                      'dawa'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#ede5d5] hover:bg-[#e2d8c3] text-[#3a2818] text-xs font-semibold border border-[#d4a34b]/40 transition-colors"
                >
                  {copiedAddress === 'dawa' ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAddress === 'dawa' ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* WEDDING DAY VENUE CARD (Beevus Hall, Purangu) */
            <div className="bg-[#fffdf9] border-2 border-[#d4a34b] rounded-3xl p-6 sm:p-8 shadow-xl text-center relative transition-all">
              <span className="bg-[#9d7122] text-[#fff7e6] text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full inline-block mb-3">
                {lang === 'en' ? 'Thursday · 24 December 2026 · Rajab 14' : '2026 ഡിസംബർ 24 · വ്യാഴം · റജബ് - 14'}
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#0e2b24] mb-1">
                {lang === 'en' ? 'Beevus Hall' : 'ബീവൂസ് ഹാൾ'}
              </h3>
              <p className="font-script text-2xl text-[#9d7122] mb-3">
                {lang === 'en' ? 'Purangu, Maranchery' : 'പുറങ്ങ്, മാറഞ്ചേരി'}
              </p>

              <div className="bg-[#f6f2e8] p-4 rounded-xl border border-[#d4a34b]/30 max-w-[360px] mx-auto text-xs text-[#524131] space-y-1 mb-6">
                <div className="font-semibold text-[#0e2b24]">
                  {lang === 'en' ? 'Wedding Day Ceremony & Feast' : 'വിവാഹ സദ്യയും സൽക്കാരവും'}
                </div>
                <div>Beevus Hall / Lounge, Purangu</div>
                <div>Maranchery, Ponnani Taluk, Malappuram, Kerala</div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={beevusMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9d7122] text-[#fff7e6] text-xs font-bold uppercase tracking-wider hover:bg-[#835d19] shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Navigation className="w-4 h-4 text-[#faebb9]" />
                  <span>{lang === 'en' ? 'Navigate on Google Maps' : 'ഗൂഗിൾ മാപ്പ് വഴി കാണുക'}</span>
                </a>

                <button
                  onClick={() =>
                    copyToClipboard(
                      'Beevus Hall, Purangu, Maranchery, Ponnani, Malappuram, Kerala',
                      'beevus'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#ede5d5] hover:bg-[#e2d8c3] text-[#3a2818] text-xs font-semibold border border-[#d4a34b]/40 transition-colors"
                >
                  {copiedAddress === 'beevus' ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAddress === 'beevus' ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          )}
        </section>


        {/* SECTION 4: WITH ALL OUR LOVE & INTERTWINED RINGS */}
        <section id="rsvp" className="px-5 py-16 sm:py-20 text-center bg-[#fbf7ef] relative">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#143c32] font-bold mb-1">
            04 · {lang === 'en' ? 'With All Our Love' : 'സ്നേഹപൂർവ്വം'}
          </div>

          {/* Intertwined Gold Wedding Rings Graphic */}
          <div className="relative w-64 h-36 mx-auto my-4 flex items-center justify-center">
            <svg viewBox="0 0 260 160" className="w-full h-full drop-shadow-[0_8px_16px_rgba(212,163,75,0.3)]">
              <defs>
                <linearGradient id="ringGoldA" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#faebb9" />
                  <stop offset="40%" stopColor="#d4a34b" />
                  <stop offset="70%" stopColor="#9d7122" />
                  <stop offset="100%" stopColor="#f8df9e" />
                </linearGradient>
                <linearGradient id="ringGoldB" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#faebb9" />
                  <stop offset="45%" stopColor="#e2b96d" />
                  <stop offset="75%" stopColor="#9d7122" />
                  <stop offset="100%" stopColor="#fdf3d6" />
                </linearGradient>
              </defs>

              {/* Left Ring (Groom - Ameen) */}
              <circle
                cx="105"
                cy="85"
                r="46"
                fill="none"
                stroke="url(#ringGoldA)"
                strokeWidth="8.5"
                strokeDasharray="289"
                strokeDashoffset={289 * (1 - Math.min(1, scrollProgress * 1.5))}
                className="transition-all duration-300"
              />

              {/* Right Ring (Bride - Farseena) */}
              <circle
                cx="155"
                cy="85"
                r="46"
                fill="none"
                stroke="url(#ringGoldB)"
                strokeWidth="8.5"
                strokeDasharray="289"
                strokeDashoffset={289 * (1 - Math.min(1, scrollProgress * 1.5))}
                className="transition-all duration-300"
              />

              {/* Sparkling Solitaire Gem on Groom Ring */}
              <g transform="translate(105, 34)">
                <polygon
                  points="-12,-3 -6,-11 6,-11 12,-3 0,13"
                  fill="#ffffff"
                  stroke="#d4a34b"
                  strokeWidth="0.8"
                />
                <circle cx="0" cy="-2" r="2.5" fill="#f8df9e" />
              </g>

              {/* Sparkle Twinkles */}
              <path
                d="M105,12 L106.5,18 L112,19.5 L106.5,21 L105,27 L103.5,21 L98,19.5 L103.5,18 Z"
                fill="#faebb9"
                className="animate-pulse"
              />
              <path
                d="M150,22 L151,26 L155,27 L151,28 L150,32 L149,28 L145,27 L149,26 Z"
                fill="#faebb9"
                className="animate-pulse"
                style={{ animationDelay: '1s' }}
              />
            </svg>
          </div>

          <div className="font-script text-5xl sm:text-6xl text-gold-gradient mb-2">
            A<i>&amp;</i>F
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0e2b24] max-w-[420px] mx-auto leading-tight mb-4">
            {lang === 'en'
              ? 'Your Presence is our Greatest Blessing'
              : 'താങ്കളുടെ കുടുംബസമേതമുള്ള സാന്നിധ്യം സാദരം ക്ഷണിക്കുന്നു'}
          </h2>

          <p className="text-sm text-[#675442] max-w-[420px] mx-auto leading-relaxed mb-6">
            {lang === 'en'
              ? 'We would be deeply honored and delighted to have you join us as we embark on this sacred journey of marriage.'
              : 'തദവസരത്തിൽ താങ്കളുടെയും കുടുംബത്തിന്റെയും മഹനീയ സാന്നിധ്യവും പ്രാർത്ഥനകളും സാദരം അഭ്യർത്ഥിക്കുന്നു.'}
          </p>

          {/* Invitation Signed Off by Parents */}
          <div className="bg-[#f4efe5] border border-[#d4a34b]/40 rounded-2xl p-5 max-w-[400px] mx-auto text-xs text-[#524131] space-y-2 mb-8 shadow-sm">
            <div className="font-semibold text-sm text-[#0e2b24]">
              {lang === 'en' ? 'With warm regards & love:' : 'സ്നേഹപൂർവ്വം:'}
            </div>
            <div className="font-serif text-base font-bold text-[#0e2b24]">
              {lang === 'en' ? 'Mr. Seethi K.M. & Mrs. Fathima K.M.' : 'Mr. സീതി KM & Mrs. ഫാത്തിമ KM'}
            </div>
            <div>
              {lang === 'en' ? (
                <>Kaliyarakath Manatha Parambil, M.G. Road Nalakam, Maranchery</>
              ) : (
                <>കാളിയാരകത്ത് മാനാത്ത പറമ്പിൽ, MG റോഡ് നാലകം, മാറഞ്ചേരി</>
              )}
            </div>
            <div className="pt-2 border-t border-[#d4a34b]/30 font-medium text-[#9d7122]">
              {lang === 'en' ? 'Warmly invited by: Relatives & Friends' : 'ഉപചാരപൂർവ്വം: ബന്ധു മിത്രാദികൾ'}
            </div>
          </div>

          {/* Share & WhatsApp Call-to-Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={shareDetails}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0e2b24] text-[#faebb9] text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#143c32] hover:scale-105 transition-all"
            >
              <Share2 className="w-4 h-4 text-[#d4a34b]" />
              <span>{lang === 'en' ? 'Share Invitation' : 'ക്ഷണക്കത്ത് പങ്കുവെക്കുക'}</span>
            </button>

            <button
              onClick={openWhatsApp}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 hover:scale-105 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'en' ? 'Share on WhatsApp' : 'വാട്ട്സ്ആപ്പിൽ അയക്കുക'}</span>
            </button>
          </div>

          {/* =========================================================================
              NEW GRAND ISLAMIC WEDDING BLESSING FINALE (NO REFERENCES)
             ========================================================================= */}
          <div className="bg-gradient-to-b from-[#091f1a] to-[#0e2b24] text-[#f4ead6] p-7 sm:p-9 rounded-3xl border border-[#d4a34b]/60 shadow-2xl relative overflow-hidden my-6">
            {/* Background Halo */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#d4a34b]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Sacred Marriage Du'a Calligraphy */}
            <div className="font-arabic text-2xl sm:text-3xl text-gold-gradient font-bold leading-relaxed mb-3" dir="rtl">
              بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
            </div>

            <div className="font-serif italic text-sm sm:text-base text-[#faebb9] max-w-[420px] mx-auto mb-2">
              "Bārakallāhu lakumā wa bāraka 'alaykumā wa jama'a baynakumā fī khayr"
            </div>

            <p className="text-xs text-[#d4a34b] uppercase tracking-widest max-w-[380px] mx-auto leading-relaxed mb-6 font-semibold">
              {lang === 'en'
                ? 'May Allah bless you both, shower His blessings upon you, and unite you in goodness and harmony.'
                : 'അല്ലാഹു നിങ്ങളുടെ ദാമ്പത്യം അനുഗ്രഹിക്കുകയും ഇരുവരിലും നന്മകൾ ഒരുമിച്ചുകൂട്ടുകയും ചെയ്യട്ടെ.'}
            </p>

            {/* Interactive Du'a Counter & Send Prayers */}
            <div className="bg-[#143c32]/80 border border-[#d4a34b]/40 rounded-2xl p-4 sm:p-5 max-w-[420px] mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-[#faebb9] mb-3">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#ff4d6d] fill-[#ff4d6d]" />
                  <span>{lang === 'en' ? 'Wedding Blessings' : 'പ്രാർത്ഥനകൾ'}:</span>
                </span>
                <span className="bg-[#091f1a] px-3 py-1 rounded-full text-[#faebb9] border border-[#d4a34b]/40">
                  {blessingCount} {lang === 'en' ? 'Duas' : 'ദുആകൾ'}
                </span>
              </div>

              {/* Quick Du'a Pill Buttons */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <button
                  onClick={() => handleSendBlessing(lang === 'en' ? 'Barakallahu Lakuma! 🤲' : 'ബാരകല്ലാഹു ലക്കുമ! 🤲')}
                  className="px-3 py-1.5 rounded-full bg-[#091f1a] hover:bg-[#d4a34b] hover:text-[#091f1a] border border-[#d4a34b]/50 text-[11px] font-medium text-[#faebb9] transition-all"
                >
                  🤲 Barakallahu Lakuma
                </button>
                <button
                  onClick={() => handleSendBlessing(lang === 'en' ? 'Mubarak to Ameen & Farseena! 🎉' : 'അമീനും ഫർസീനക്കും ആശംസകൾ! 🎉')}
                  className="px-3 py-1.5 rounded-full bg-[#091f1a] hover:bg-[#d4a34b] hover:text-[#091f1a] border border-[#d4a34b]/50 text-[11px] font-medium text-[#faebb9] transition-all"
                >
                  💍 Mubarak!
                </button>
                <button
                  onClick={() => handleSendBlessing(lang === 'en' ? 'May Allah bless your home with peace & joy! 🏡' : 'സന്തോഷകരമായ കുടുംബജീവിതം ആശംസിക്കുന്നു! 🏡')}
                  className="px-3 py-1.5 rounded-full bg-[#091f1a] hover:bg-[#d4a34b] hover:text-[#091f1a] border border-[#d4a34b]/50 text-[11px] font-medium text-[#faebb9] transition-all"
                >
                  ❤️ Happy Married Life
                </button>
              </div>

              {/* Custom Du'a Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (userDua.trim()) handleSendBlessing(userDua.trim());
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={userDua}
                  onChange={(e) => setUserDua(e.target.value)}
                  placeholder={lang === 'en' ? 'Type your heartfelt prayer...' : 'നിങ്ങളുടെ പ്രാർത്ഥന ഇവിടെ ടൈപ്പ് ചെയ്യുക...'}
                  className="flex-1 bg-[#091f1a] border border-[#d4a34b]/50 rounded-full px-4 py-2 text-xs text-[#faebb9] placeholder-[#e6be6d]/50 focus:outline-none focus:border-[#faebb9]"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-[#d4a34b] hover:bg-[#faebb9] text-[#091f1a] flex items-center justify-center flex-shrink-0 shadow transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Recent Blessings Feed */}
              {submittedDuas.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#d4a34b]/20 space-y-2 text-left">
                  {submittedDuas.slice(0, 3).map((d, idx) => (
                    <div key={idx} className="bg-[#091f1a]/60 rounded-lg p-2.5 text-[11px]">
                      <div className="flex justify-between font-semibold text-[#d4a34b] text-[10px] mb-0.5">
                        <span>{d.name}</span>
                        <span className="opacity-70">{d.time}</span>
                      </div>
                      <div className="text-[#f4ead6]/90">{d.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 text-[11px] tracking-[0.25em] uppercase text-[#7d6a52]">
            Muhammed Ameen &amp; Farseena<br />
            23 · 24 · December · 2026
          </div>
        </section>
      </main>

      {/* LIGHTBOX MODAL: ORIGINAL PRINTED WEDDING CARD */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#0e2b24] p-3 rounded-2xl border border-[#d4a34b] shadow-2xl flex flex-col items-center max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#143c32] text-[#faebb9] hover:bg-[#d4a34b] hover:text-[#091f1a] flex items-center justify-center border border-[#d4a34b]/40 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#faebb9] mb-2 mt-1">
              {lang === 'en' ? 'Original Printed Wedding Card' : 'യഥാർത്ഥ അച്ചടിച്ച ക്ഷണക്കത്ത്'}
            </h3>

            {/* Scrollable Image View */}
            <div className="overflow-y-auto w-full flex justify-center rounded-lg border border-[#d4a34b]/30 bg-black/40 p-1">
              <img
                src="/wedding-card.jpg"
                alt="Original Wedding Card"
                className="w-full max-h-[75vh] object-contain rounded"
              />
            </div>

            <div className="mt-3 text-[11px] text-[#faebb9]/80 text-center">
              {lang === 'en'
                ? 'High-resolution invitation card of Muhammed Ameen & Farseena'
                : 'മുഹമ്മദ് അമീൻ & ഫർസീന വിവാഹ ക്ഷണക്കത്ത്'}
            </div>
          </div>
        </div>
      )}

      {/* TOAST POPUP NOTIFICATION */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-50 transition-all duration-300 pointer-events-none ${
          toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-[#091f1a]/95 text-[#faebb9] border border-[#d4a34b] px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#d4a34b]" />
          <span>{toastMsg}</span>
        </div>
      </div>
    </div>
  );
}

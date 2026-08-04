import React, { useState, useRef } from 'react';
import { Quote, RefreshCw, Bookmark, Share2 } from 'lucide-react';
import anime from 'animejs';

const WISDOM_QUOTES = [
  {
    quote: "With great power comes great responsibility.",
    author: "Uncle Ben / Peter Parker",
    universe: "Earth-616",
    badge: "FOUNDATIONAL PRINCIPLE",
  },
  {
    quote: "Anyone can wear the mask. You could wear the mask. If you didn't know that before, I hope you do now.",
    author: "Miles Morales",
    universe: "Earth-1610",
    badge: "MULTIVERSE TRUTH",
  },
  {
    quote: "In the Spider-Verse, it's not about how many times you get knocked down. It's about how many times you get back up.",
    author: "Gwen Stacy (Spider-Gwen)",
    universe: "Earth-65",
    badge: "RESILIENCE METRIC",
  },
  {
    quote: "You have a choice between the hard way and the right way. Choose the right way every single time.",
    author: "Miguel O'Hara (Spider-Man 2099)",
    universe: "Earth-928",
    badge: "2099 PROTOCOL",
  },
  {
    quote: "No matter how hard it gets, Spider-Man never quits. We always find a way to fix the code.",
    author: "Peter B. Parker",
    universe: "Earth-616B",
    badge: "DEBUGGER LESSON",
  },
];

export default function DailyWisdom({ soundEnabled }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef(null);
  const refreshBtnRef = useRef(null);

  const handleNextQuote = () => {
    // Anime.js 360-degree rotation on refresh icon & scale pulse on card
    anime({
      targets: refreshBtnRef.current,
      rotate: '+=360',
      duration: 600,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: cardRef.current,
      scale: [0.96, 1],
      opacity: [0.7, 1],
      duration: 450,
      easing: 'easeOutBack',
    });

    setCurrentIndex((prev) => (prev + 1) % WISDOM_QUOTES.length);
  };

  const currentWisdom = WISDOM_QUOTES[currentIndex];

  return (
    <section id="wisdom" className="py-20 px-4 relative z-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono tracking-widest uppercase mb-3">
            <Quote className="w-3.5 h-3.5" /> SPIDER-SENSE ARCHIVES
          </div>
          <h2 className="font-comic text-4xl sm:text-6xl text-white tracking-wider">
            MULTIVERSE <span className="text-[#00F0FF]">DAILY WISDOM</span>
          </h2>
        </div>

        {/* Quote Glassmorphism Card */}
        <div
          ref={cardRef}
          className="relative bg-gradient-to-br from-[#141824]/90 via-[#0B0D12]/95 to-[#141824]/90 border border-[#00F0FF]/30 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl group overflow-hidden"
        >
          {/* Subtle Cyber Decorative Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FF1E52] rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00F0FF] rounded-br-3xl" />

          {/* Badge */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <span className="px-3.5 py-1 text-xs font-mono bg-[#FF1E52]/20 border border-[#FF1E52]/40 text-[#FF1E52] rounded-full uppercase tracking-wider font-semibold">
              {currentWisdom.badge}
            </span>
            <span className="text-xs font-mono text-[#00F0FF]/80">
              ORIGIN: {currentWisdom.universe}
            </span>
          </div>

          {/* Quote Text */}
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif text-slate-100 italic leading-relaxed tracking-wide mb-8">
            "{currentWisdom.quote}"
          </blockquote>

          {/* Author & Footer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-800">
            <div>
              <div className="font-comic text-2xl text-[#00F0FF] tracking-wide">
                {currentWisdom.author}
              </div>
              <div className="text-xs font-mono text-slate-400">
                VERIFIED BY SPIDER-NET DATABASE
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                ref={refreshBtnRef}
                onClick={handleNextQuote}
                className="inline-flex items-center gap-2 px-5 py-2.5 font-comic text-base text-black bg-[#00F0FF] hover:bg-[#FF1E52] hover:text-white rounded-xl shadow-glow-cyan hover:shadow-glow-red transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>NEXT WISDOM</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

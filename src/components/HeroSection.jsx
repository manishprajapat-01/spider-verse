import React, { useState } from 'react';
import { Crosshair, ShieldAlert, Sparkles, Terminal, Activity, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeroSection({ triggerWebShooter }) {
  const [spiderSenseActive, setSpiderSenseActive] = useState(true);

  const handleWebShooterClick = (e) => {
    // Fire canvas web shooter explosion
    if (triggerWebShooter) {
      triggerWebShooter(e.clientX, e.clientY);
    }

    // Fire cyber neon web particle confetti
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: e.clientY / window.innerHeight, x: e.clientX / window.innerWidth },
      colors: ['#FF1E52', '#00F0FF', '#FFE600', '#ffffff'],
      ticks: 200,
      gravity: 1.2,
      scalar: 1.1,
    });
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 overflow-hidden">
      
      {/* Background Neon Grid Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#FF1E52]/20 via-[#00F0FF]/20 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Cyber Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141824]/90 border border-[#00F0FF]/40 backdrop-blur-md shadow-glow-cyan mb-8 animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-[#00F0FF] animate-ping" />
          <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> PARALLEL EARTH-616 INTERFACE v2.5
          </span>
        </div>

        {/* Main Headline with Comic Typography */}
        <h1 className="font-comic text-5xl sm:text-7xl md:text-8xl tracking-wider text-white max-w-5xl leading-none drop-shadow-2xl">
          WITH GREAT POWER COMES GREAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1E52] via-[#00F0FF] to-[#FFE600] drop-shadow-neon-red">CYBER CODE</span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
          Welcome to the high-tech, multi-threaded suit interface. Tap into web-shooter physics, real-time spider-sense diagnostics, and multiverse archives.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <button
            onClick={handleWebShooterClick}
            className="group relative inline-flex items-center gap-3 px-8 py-4 font-comic text-xl tracking-wider text-white bg-gradient-to-r from-[#FF1E52] to-[#990026] rounded-xl border border-[#FF1E52]/50 shadow-glow-red hover:shadow-glow-cyan hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <Zap className="w-6 h-6 text-[#FFE600] group-hover:rotate-180 transition-transform duration-500" />
            <span>FIRE WEB-SHOOTER</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-mono bg-[#00F0FF] text-black rounded font-bold uppercase tracking-wider shadow-sm">
              CLICK ANYWHERE
            </span>
          </button>

          <a
            href="#comics"
            className="inline-flex items-center gap-2 px-8 py-4 font-comic text-xl tracking-wider text-[#00F0FF] bg-[#141824] hover:bg-[#00F0FF]/10 rounded-xl border border-[#00F0FF]/40 hover:border-[#00F0FF] transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span>EXPLORE MULTIVERSE</span>
          </a>
        </div>

        {/* Spider-Sense Radar Widget */}
        <div className="mt-14 w-full max-w-xl bg-[#141824]/80 border border-[#00F0FF]/30 rounded-2xl p-5 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#0B0D12] border border-[#FF1E52]/40">
              <Activity className={`w-6 h-6 ${spiderSenseActive ? 'text-[#FF1E52] animate-pulse' : 'text-slate-600'}`} />
              {spiderSenseActive && (
                <span className="absolute inset-0 rounded-xl border border-[#FF1E52] animate-ping opacity-30" />
              )}
            </div>
            <div className="text-left">
              <div className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-[#FF1E52]" /> Suit Diagnostic Radar
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">
                {spiderSenseActive ? "Spider-Sense: HIGH ANOMALY DETECTED" : "Spider-Sense: CALM METRICS"}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSpiderSenseActive(!spiderSenseActive)}
            className="px-3.5 py-1.5 text-xs font-mono rounded-lg border border-slate-700 bg-[#0B0D12] hover:border-[#00F0FF] text-slate-300 hover:text-[#00F0FF] transition-colors flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#FFE600]" />
            {spiderSenseActive ? "TOGGLE DAMPENER" : "ACTIVATE SENSE"}
          </button>
        </div>

      </div>
    </section>
  );
}

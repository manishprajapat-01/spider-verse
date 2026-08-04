import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Shield, Zap, Cpu, Activity, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

const SPIDER_SUITS = [
  {
    id: 'classic-616',
    name: 'EARTH-616 CLASSIC SUIT',
    hero: 'PETER PARKER',
    universe: 'EARTH-616',
    primaryColor: '#FF1E52',
    accentColor: '#00F0FF',
    badge: 'FOUNDATIONAL CLASSIC',
    desc: 'The original nano-weave suit equipped with high-tensile web-shooters, precognitive spider-sense optics, and wall-crawling friction nodes.',
    stats: { agility: 95, webTech: 92, spiderSense: 98, armor: 72 },
  },
  {
    id: 'miles-1610',
    name: 'MILES MORALES STRIKE SUIT',
    hero: 'MILES MORALES',
    universe: 'EARTH-1610',
    primaryColor: '#FF1E52',
    accentColor: '#FFE600',
    badge: 'BIO-ELECTRIC OVERDRIVE',
    desc: 'Upgraded with bio-electric venom blast conductors, optical camouflage cloak nodes, and lightweight cyber-fabric.',
    stats: { agility: 98, webTech: 88, spiderSense: 94, armor: 78 },
  },
  {
    id: 'gwen-65',
    name: 'SPIDER-GWEN NEON SUIT',
    hero: 'GWEN STACY',
    universe: 'EARTH-65',
    primaryColor: '#00F0FF',
    accentColor: '#FF007F',
    badge: 'ACROBATIC HARMONY',
    desc: 'Sleek aerodynamic white-and-cyan weave integrated with rhythm-based kinetic dampeners and micro-grip web shooters.',
    stats: { agility: 100, webTech: 90, spiderSense: 96, armor: 68 },
  },
  {
    id: 'miguel-2099',
    name: 'SPIDER-MAN 2099 SUIT',
    hero: "MIGUEL O'HARA",
    universe: 'EARTH-928',
    primaryColor: '#0055FF',
    accentColor: '#FF1E52',
    badge: '2099 CYBER-FUTURE',
    desc: 'Formed from Unstable Molecule Fabric with plasma claws, anti-gravity cape glide, and a tactical multiverse timeline HUD.',
    stats: { agility: 92, webTech: 99, spiderSense: 90, armor: 92 },
  },
  {
    id: 'symbiote-black',
    name: 'SYMBIOTE OBSIDIAN SUIT',
    hero: 'VENE-PARKER',
    universe: 'EARTH-616B',
    primaryColor: '#8B5CF6',
    accentColor: '#FF1E52',
    badge: 'ALIEN OVERLOAD',
    desc: 'Alien Klyntar symbiote bonding that grants infinite organic web mass, shapeshifting tendrils, and 400% boosted raw strength.',
    stats: { agility: 94, webTech: 100, spiderSense: 88, armor: 98 },
  },
];

export default function GSAPSuitHangar() {
  const [activeSuitIndex, setActiveSuitIndex] = useState(0);
  const cardContainerRef = useRef(null);
  const statsContainerRef = useRef(null);
  const bgGlowRef = useRef(null);

  const activeSuit = SPIDER_SUITS[activeSuitIndex];

  // GSAP 3D Suit Change Animation Engine
  useEffect(() => {
    const cards = cardContainerRef.current?.querySelectorAll('.suit-card');
    if (!cards) return;

    // 1. GSAP 3D Perspective Flip & Scale Stagger Timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });

    cards.forEach((card, index) => {
      const isCurrent = index === activeSuitIndex;
      const offset = index - activeSuitIndex;

      tl.to(
        card,
        {
          rotationY: offset * -18,
          x: offset * 45,
          z: isCurrent ? 80 : -Math.abs(offset) * 60,
          scale: isCurrent ? 1.05 : 0.85 - Math.abs(offset) * 0.08,
          opacity: Math.abs(offset) > 2 ? 0.3 : 1 - Math.abs(offset) * 0.25,
          borderColor: isCurrent ? activeSuit.primaryColor : 'rgba(0, 240, 255, 0.2)',
          boxShadow: isCurrent ? `0 0 30px ${activeSuit.primaryColor}88` : '0 0 10px rgba(0,0,0,0.5)',
        },
        0
      );
    });

    // 2. GSAP Numeric Stat Counters Count-Up Animation
    const statBars = statsContainerRef.current?.querySelectorAll('.stat-bar-fill');
    const statNums = statsContainerRef.current?.querySelectorAll('.stat-num');

    if (statBars && statNums) {
      const statKeys = ['agility', 'webTech', 'spiderSense', 'armor'];
      statKeys.forEach((key, i) => {
        const val = activeSuit.stats[key];
        
        // Progress bar width tween
        gsap.to(statBars[i], {
          width: `${val}%`,
          backgroundColor: activeSuit.primaryColor,
          duration: 0.8,
          ease: 'back.out(1.2)',
        });

        // Numeric text count-up tween
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: val,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: () => {
            if (statNums[i]) statNums[i].innerText = `${Math.round(counterObj.val)}%`;
          },
        });
      });
    }

    // 3. GSAP Background Glow Radial Gradient Interpolation
    gsap.to(bgGlowRef.current, {
      background: `radial-gradient(circle at 50% 50%, ${activeSuit.primaryColor}25 0%, transparent 70%)`,
      duration: 1.0,
    });
  }, [activeSuitIndex, activeSuit]);

  const handleNext = () => {
    setActiveSuitIndex((prev) => (prev + 1) % SPIDER_SUITS.length);
  };

  const handlePrev = () => {
    setActiveSuitIndex((prev) => (prev - 1 + SPIDER_SUITS.length) % SPIDER_SUITS.length);
  };

  return (
    <section id="suit-hangar" className="py-28 px-4 relative z-20 overflow-hidden bg-[#0B0D12]">
      
      {/* Dynamic GSAP Animated Background Radial Glow */}
      <div 
        ref={bgGlowRef} 
        className="absolute inset-0 pointer-events-none transition-all duration-700" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141824] border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono tracking-widest uppercase mb-4 shadow-glow-cyan">
            <Cpu className="w-4 h-4 text-[#FF1E52] animate-pulse" /> GSAP 3D CYBER HANGAR ENGINE
          </div>
          <h2 className="font-comic text-5xl sm:text-7xl text-white tracking-wider">
            MULTIVERSE <span style={{ color: activeSuit.primaryColor }} className="transition-colors duration-500">SUIT VAULT</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base font-light max-w-xl mx-auto">
            Interact with the 3D suit carousel to trigger real-time GSAP stat counters and holographic diagnostics.
          </p>
        </div>

        {/* Suit Hangar 3D Stage & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* 3D Suit Card Carousel (Left / Center - 7 Cols) */}
          <div className="lg:col-span-7 relative flex flex-col items-center">
            
            {/* Carousel Navigation Buttons */}
            <div className="absolute -top-12 right-0 flex items-center gap-3 z-30">
              <button
                onClick={handlePrev}
                className="p-3 rounded-xl bg-[#141824] border border-[#00F0FF]/30 text-[#00F0FF] hover:border-[#FF1E52] hover:text-[#FF1E52] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-xl bg-[#141824] border border-[#00F0FF]/30 text-[#00F0FF] hover:border-[#FF1E52] hover:text-[#FF1E52] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Cards 3D Container */}
            <div 
              ref={cardContainerRef} 
              className="w-full h-[420px] flex items-center justify-center relative perspective-[1200px]"
            >
              {SPIDER_SUITS.map((suit, index) => (
                <div
                  key={suit.id}
                  onClick={() => setActiveSuitIndex(index)}
                  className="suit-card absolute w-[280px] sm:w-[320px] h-[380px] rounded-3xl bg-[#141824]/90 border-2 border-[#00F0FF]/30 p-6 flex flex-col justify-between backdrop-blur-xl cursor-pointer transition-colors duration-300 select-none"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Suit Top Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-[#0B0D12] text-[#00F0FF]">
                      {suit.universe}
                    </span>
                    <Sparkles className="w-4 h-4" style={{ color: suit.primaryColor }} />
                  </div>

                  {/* Suit Icon Emblem */}
                  <div className="my-auto flex flex-col items-center justify-center text-center">
                    <div 
                      className="w-20 h-20 rounded-2xl bg-[#0B0D12] border border-slate-700 flex items-center justify-center mb-4 shadow-2xl group-hover:scale-110 transition-transform"
                      style={{ borderColor: suit.primaryColor }}
                    >
                      <Shield className="w-10 h-10" style={{ color: suit.primaryColor }} />
                    </div>
                    <h3 className="font-comic text-2xl text-white tracking-wide leading-tight">
                      {suit.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-1">HERO: {suit.hero}</p>
                  </div>

                  {/* Badge Bottom */}
                  <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-[#00F0FF] tracking-wider uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#FFE600]" /> {suit.badge}
                  </div>
                </div>
              ))}
            </div>

            {/* Suit Selector Indicators */}
            <div className="flex items-center gap-2 mt-6">
              {SPIDER_SUITS.map((suit, index) => (
                <button
                  key={suit.id}
                  onClick={() => setActiveSuitIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeSuitIndex ? 'w-8 bg-[#00F0FF] shadow-glow-cyan' : 'w-2.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* GSAP Animated Diagnostics Panel (Right - 5 Cols) */}
          <div className="lg:col-span-5 bg-[#141824]/90 border border-[#00F0FF]/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00F0FF]/20 to-transparent blur-3xl" />

            {/* Suit Title & Info */}
            <div className="mb-6">
              <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Activity className="w-4 h-4 text-[#FF1E52] animate-pulse" /> SUIT SPECIFICATIONS
              </span>
              <h3 className="font-comic text-3xl text-white tracking-wider">
                {activeSuit.name}
              </h3>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed font-light">
                {activeSuit.desc}
              </p>
            </div>

            {/* Animated GSAP Stat Bars */}
            <div ref={statsContainerRef} className="space-y-5 pt-4 border-t border-slate-800">
              
              {/* Agility Stat */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-300">AGILITY & REFLEXES</span>
                  <span className="stat-num text-[#00F0FF] font-bold">0%</span>
                </div>
                <div className="w-full h-2.5 bg-[#0B0D12] rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div className="stat-bar-fill h-full rounded-full w-0 transition-all" />
                </div>
              </div>

              {/* Web Tech Stat */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-300">WEB TECH & RANGE</span>
                  <span className="stat-num text-[#00F0FF] font-bold">0%</span>
                </div>
                <div className="w-full h-2.5 bg-[#0B0D12] rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div className="stat-bar-fill h-full rounded-full w-0 transition-all" />
                </div>
              </div>

              {/* Spider-Sense Stat */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-300">SPIDER-SENSE SPECTRUM</span>
                  <span className="stat-num text-[#00F0FF] font-bold">0%</span>
                </div>
                <div className="w-full h-2.5 bg-[#0B0D12] rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div className="stat-bar-fill h-full rounded-full w-0 transition-all" />
                </div>
              </div>

              {/* Armor Stat */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-300">SUIT ARMOR DURABILITY</span>
                  <span className="stat-num text-[#00F0FF] font-bold">0%</span>
                </div>
                <div className="w-full h-2.5 bg-[#0B0D12] rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div className="stat-bar-fill h-full rounded-full w-0 transition-all" />
                </div>
              </div>

            </div>

            {/* Suit Action Button */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                SYSTEM STATUS: ACTIVE
              </span>
              <button
                className="px-5 py-2.5 font-comic text-lg text-black rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-glow-cyan"
                style={{ backgroundColor: activeSuit.primaryColor, color: '#fff' }}
              >
                EQUIP SUIT
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

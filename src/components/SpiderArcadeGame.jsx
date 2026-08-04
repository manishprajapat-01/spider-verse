import React, { useState, useEffect, useRef } from 'react';
import { Target, Trophy, Flame, RefreshCw, Zap, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import anime from 'animejs';

// Vector Black Widow Hanging Spider for the Arcade Game
function ArcadeBlackWidowSVG({ className = "w-14 h-20" }) {
  return (
    <svg className={className} viewBox="-40 -65 80 135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="arcGloss" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="35%" stopColor="#1A202C" />
          <stop offset="100%" stopColor="#080A0F" />
        </radialGradient>
        <filter id="arcGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Shadow */}
      <g opacity="0.3" transform="translate(8, 10) scale(0.95)">
        <ellipse cx="0" cy="18" rx="14" ry="18" fill="#000" />
        <circle cx="0" cy="-2" r="7" fill="#000" />
        <path d="M-4,-2 C-18,-15 -24,-35 -14,-52" stroke="#000" strokeWidth="4" />
        <path d="M4,-2 C18,-15 24,-35 14,-52" stroke="#000" strokeWidth="4" />
        <path d="M-5,0 C-24,-8 -30,-22 -20,-38" stroke="#000" strokeWidth="3.5" />
        <path d="M5,0 C24,-8 30,-22 20,-38" stroke="#000" strokeWidth="3.5" />
        <path d="M-5,4 C-26,12 -32,26 -22,42" stroke="#000" strokeWidth="3.5" />
        <path d="M5,4 C26,12 32,26 22,42" stroke="#000" strokeWidth="3.5" />
        <path d="M-4,8 C-20,24 -26,48 -14,66" stroke="#000" strokeWidth="4" />
        <path d="M4,8 C20,24 26,48 14,66" stroke="#000" strokeWidth="4" />
      </g>

      {/* Legs */}
      <path d="M-4,-2 C-18,-15 -24,-35 -14,-52 C-12,-55 -9,-52 -11,-46" fill="url(#arcGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M4,-2 C18,-15 24,-35 14,-52 C12,-55 9,-52 11,-46" fill="url(#arcGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M-5,0 C-24,-8 -30,-22 -20,-38 C-18,-41 -15,-38 -17,-33" fill="url(#arcGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M5,0 C24,-8 30,-22 20,-38 C18,-41 15,-38 17,-33" fill="url(#arcGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M-5,4 C-26,12 -32,26 -22,42 C-20,45 -17,42 -19,37" fill="url(#arcGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M5,4 C26,12 32,26 22,42 C20,45 17,42 19,37" fill="url(#arcGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M-4,8 C-20,24 -26,48 -14,66 C-12,69 -9,66 -11,60" fill="url(#arcGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M4,8 C20,24 26,48 14,66 C12,69 9,66 11,60" fill="url(#arcGloss)" stroke="#1A202C" strokeWidth="1" />

      {/* Body */}
      <circle cx="0" cy="-2" r="7" fill="url(#arcGloss)" stroke="#303644" strokeWidth="0.8" />
      <ellipse cx="0" cy="18" rx="14" ry="18" fill="url(#arcGloss)" stroke="#303644" strokeWidth="0.8" />

      {/* Red Hourglass Emblem */}
      <path d="M-5,11 L5,11 L-2,18 L-6,25 L6,25 L2,18 Z" fill="#FF1E52" filter="url(#arcGlow)" />
    </svg>
  );
}

export default function SpiderArcadeGame({ soundEnabled }) {
  const stageRef = useRef(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [defeated, setDefeated] = useState(0);
  const [spiders, setSpiders] = useState([
    { id: 1, x: 20, length: 160, hit: false },
    { id: 2, x: 45, length: 220, hit: false },
    { id: 3, x: 70, length: 180, hit: false },
    { id: 4, x: 88, length: 240, hit: false },
  ]);

  const [popups, setPopups] = useState([]);

  // Web Impact Audio Synthesizer
  const playWebHitSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  // Automatic Spider Wave Respawner (Spawns a new spider every 2 seconds if count < 5)
  useEffect(() => {
    const respawnInterval = setInterval(() => {
      setSpiders((prev) => {
        if (prev.length < 5) {
          const newId = Date.now();
          const newX = Math.floor(Math.random() * 75) + 12; // 12% to 87% width
          const newLen = Math.floor(Math.random() * 120) + 140; // 140px to 260px
          return [...prev, { id: newId, x: newX, length: newLen, hit: false }];
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(respawnInterval);
  }, []);

  // Spider Hit / Web Shoot Handler
  const handleSpiderHit = (spider, e) => {
    e.stopPropagation();
    if (spider.hit) return;

    playWebHitSound();

    // Mark spider as hit
    setSpiders((prev) =>
      prev.map((s) => (s.id === spider.id ? { ...s, hit: true } : s))
    );

    // Update Score & Combo
    const addedPoints = 100 * combo;
    setScore((prev) => prev + addedPoints);
    setCombo((prev) => Math.min(prev + 1, 5));
    setDefeated((prev) => prev + 1);

    // Spawn Action Burst Popup Text
    const stageRect = stageRef.current?.getBoundingClientRect();
    const clickX = e.clientX - (stageRect?.left || 0);
    const clickY = e.clientY - (stageRect?.top || 0);

    const popupId = Date.now();
    setPopups((prev) => [
      ...prev,
      { id: popupId, x: clickX, y: clickY, text: `+${addedPoints} PTS!`, combo: combo > 1 ? `COMBO x${combo}` : null },
    ]);

    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== popupId));
    }, 1000);

    // Confetti Web Explosion
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#FF1E52', '#00F0FF', '#FFE600'],
    });

    // Remove hit spider & trigger automatic new spawn after 1.8s
    setTimeout(() => {
      setSpiders((prev) => prev.filter((s) => s.id !== spider.id));
    }, 200);
  };

  const handleResetGame = () => {
    setScore(0);
    setCombo(1);
    setDefeated(0);
    setSpiders([
      { id: Date.now() + 1, x: 25, length: 170, hit: false },
      { id: Date.now() + 2, x: 55, length: 230, hit: false },
      { id: Date.now() + 3, x: 80, length: 190, hit: false },
    ]);
  };

  return (
    <section id="game-arcade" className="py-24 px-4 relative z-20 bg-[#0B0D12]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF1E52]/10 border border-[#FF1E52]/40 text-[#FF1E52] text-xs font-mono tracking-widest uppercase mb-4 shadow-glow-red">
            <Target className="w-4 h-4 text-[#FF1E52] animate-spin" /> SPIDER-TARGET THWIP ARCADE
          </div>
          <h2 className="font-comic text-5xl sm:text-7xl text-white tracking-wider">
            WEB-SHOOTER <span className="text-[#FF1E52]">SPIDER GAME</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base font-light max-w-xl mx-auto">
            Shoot webs at descending Black Widow spiders! Squashing a spider removes it instantly and spawns new target waves.
          </p>
        </div>

        {/* Arcade Stage Box */}
        <div className="relative bg-[#141824]/90 border-2 border-[#00F0FF]/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Top HUD Metrics Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-800 mb-8">
            
            {/* Score */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D12] border border-[#FF1E52] flex items-center justify-center text-[#FF1E52] shadow-glow-red">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">TOTAL SCORE</div>
                <div className="font-comic text-3xl text-white tracking-wider">{score} PTS</div>
              </div>
            </div>

            {/* Combo Multiplier */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D12] border border-[#FFE600] flex items-center justify-center text-[#FFE600] shadow-glow-gold">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">COMBO STREAK</div>
                <div className="font-comic text-3xl text-[#FFE600] tracking-wider">{combo}x MULTIPLIER</div>
              </div>
            </div>

            {/* Spiders Defeated */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D12] border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shadow-glow-cyan">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">SPIDERS SQUASHED</div>
                <div className="font-comic text-3xl text-[#00F0FF] tracking-wider">{defeated} TARGETS</div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetGame}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-comic text-base text-black bg-[#00F0FF] hover:bg-[#FF1E52] hover:text-white rounded-xl transition-all duration-300 shadow-glow-cyan cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RESTART GAME</span>
            </button>
          </div>

          {/* Interactive Game Stage (Hanging Spiders Area) */}
          <div 
            ref={stageRef}
            className="relative w-full h-[400px] bg-[#0B0D12] border border-slate-800 rounded-2xl overflow-hidden cursor-crosshair"
          >
            {/* Background Laser Grid */}
            <div className="absolute inset-0 bg-spider-web-bg opacity-30 pointer-events-none" />

            {/* Active Hanging Spiders */}
            {spiders.map((spider) => (
              <div
                key={spider.id}
                onClick={(e) => handleSpiderHit(spider, e)}
                className={`absolute top-0 flex flex-col items-center cursor-pointer transition-all duration-300 group ${
                  spider.hit ? 'scale-0 opacity-0' : 'animate-silk-swing'
                }`}
                style={{ left: `${spider.x}%` }}
              >
                {/* Luminous Web Silk Thread */}
                <div 
                  className="w-[1.5px] bg-gradient-to-b from-[#00F0FF] via-white to-transparent shadow-glow-cyan transition-all duration-500"
                  style={{ height: `${spider.length}px` }}
                />

                {/* Hanging Black Widow Spider Icon */}
                <div className="relative -mt-2 group-hover:scale-125 transition-transform duration-300">
                  <ArcadeBlackWidowSVG className="w-14 h-20" />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-mono bg-[#FF1E52] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    SHOOT WEB!
                  </span>
                </div>
              </div>
            ))}

            {/* Action Burst Popups (+100 PTS!, COMBO x2!) */}
            {popups.map((pop) => (
              <div
                key={pop.id}
                className="absolute pointer-events-none font-comic text-3xl text-[#FFE600] drop-shadow-neon-gold animate-bounce z-40"
                style={{ left: pop.x, top: pop.y - 40 }}
              >
                <div>{pop.text}</div>
                {pop.combo && <div className="text-sm font-mono text-[#00F0FF]">{pop.combo}</div>}
              </div>
            ))}

            {/* Instructions Overlay */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <span className="text-[10px] font-mono text-slate-400 bg-[#141824]/80 px-3 py-1.5 rounded-lg border border-slate-700">
                🎯 CLICK ANY HANGING SPIDER TO FIRE WEB & SQUASH IT! NEW SPIDERS AUTO-RESPAWN.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

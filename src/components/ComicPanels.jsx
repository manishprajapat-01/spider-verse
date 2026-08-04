import React, { useState } from 'react';
import { Shield, Flame, Eye, Skull, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

const COMIC_PANELS = [
  {
    id: 1,
    title: "THE RADIOACTIVE BITE",
    issue: "ISSUE #01",
    burst: "THWIP!",
    color: "from-[#FF1E52] to-[#990026]",
    borderColor: "border-[#FF1E52]",
    badgeColor: "bg-[#FF1E52]",
    shadowGlow: "shadow-glow-red",
    icon: Flame,
    desc: "Genetically modified spider bite grants super-sensory instincts, wall-crawling friction, and web-slinging reflexes.",
  },
  {
    id: 2,
    title: "SPIDER-SENSE PROTOCOL",
    issue: "ISSUE #15",
    burst: "BAM!",
    color: "from-[#00F0FF] to-[#0055FF]",
    borderColor: "border-[#00F0FF]",
    badgeColor: "bg-[#00F0FF]",
    shadowGlow: "shadow-glow-cyan",
    icon: Eye,
    desc: "Precognitive hazard detection system triggers micro-second spatial awareness before incoming kinetic impact.",
  },
  {
    id: 3,
    title: "INTO THE SYNTH-VERSE",
    issue: "ISSUE #99",
    burst: "POW!",
    color: "from-[#FFE600] to-[#FF9900]",
    borderColor: "border-[#FFE600]",
    badgeColor: "bg-[#FFE600]",
    shadowGlow: "shadow-glow-gold",
    icon: Sparkles,
    desc: "Dimensional rift tears through Earth-616, uniting Spider-Heroes across infinite timelines and neon cityscapes.",
  },
  {
    id: 4,
    title: "SYMBIOTE OVERDRIVE",
    issue: "ISSUE #300",
    burst: "BOOM!",
    color: "from-[#8B5CF6] to-[#4C1D95]",
    borderColor: "border-[#8B5CF6]",
    badgeColor: "bg-[#8B5CF6]",
    shadowGlow: "shadow-glow-red",
    icon: Skull,
    desc: "Alien organism bonding sequence increases web mass and aggression metrics by 400% in high-octane battle mode.",
  },
];

export default function ComicPanels({ triggerWebShooter }) {
  const [activeBurst, setActiveBurst] = useState(null);

  const handleCardClick = (panel, e) => {
    // Canvas web shooter explosion
    if (triggerWebShooter) {
      triggerWebShooter(e.clientX, e.clientY);
    }

    // Trigger visual comic burst badge
    setActiveBurst({ id: panel.id, text: panel.burst, x: e.clientX, y: e.clientY });

    // Confetti effect
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#FF1E52', '#00F0FF', '#FFE600'],
    });

    setTimeout(() => {
      setActiveBurst(null);
    }, 1200);
  };

  return (
    <section id="comics" className="py-24 px-4 relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1E52]/10 border border-[#FF1E52]/30 text-[#FF1E52] text-xs font-mono tracking-widest uppercase mb-3">
            <Shield className="w-3.5 h-3.5" /> COMIC ARCHIVE DATABASE
          </div>
          <h2 className="font-comic text-5xl sm:text-7xl text-white tracking-wider">
            INTERACTIVE <span className="text-[#FF1E52]">STORY PANELS</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base font-light max-w-xl mx-auto">
            Click any panel to trigger high-octane comic action bursts and web-shooter force impacts!
          </p>
        </div>

        {/* 4 Comic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {COMIC_PANELS.map((panel) => {
            const IconComponent = panel.icon;
            return (
              <div
                key={panel.id}
                onClick={(e) => handleCardClick(panel, e)}
                className={`group relative bg-[#141824] rounded-2xl border-2 ${panel.borderColor} p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] ${panel.shadowGlow} overflow-hidden flex flex-col justify-between`}
              >
                {/* Background Diagonal Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${panel.color} opacity-15 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`} />

                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-[10px] font-mono font-bold tracking-widest text-black ${panel.badgeColor} px-2.5 py-1 rounded uppercase`}>
                      {panel.issue}
                    </span>
                    <div className="p-2 rounded-xl bg-[#0B0D12] border border-slate-800 text-slate-300 group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-comic text-2xl tracking-wide text-white group-hover:text-[#00F0FF] transition-colors mb-3">
                    {panel.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-light mb-6">
                    {panel.desc}
                  </p>
                </div>

                {/* Bottom Action Hint */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-[#00F0FF] group-hover:text-[#FF1E52] transition-colors">
                  <span className="flex items-center gap-1 font-bold">
                    TRIGGER ACTION <ExternalLink className="w-3 h-3" />
                  </span>
                  <span className="font-comic text-lg text-white group-hover:scale-110 transition-transform">
                    {panel.burst}
                  </span>
                </div>

                {/* Click Action Overlay Burst Text */}
                {activeBurst && activeBurst.id === panel.id && (
                  <div className="absolute inset-0 bg-[#0B0D12]/90 flex items-center justify-center animate-ping z-30">
                    <span className="font-comic text-6xl text-[#FFE600] drop-shadow-neon-gold rotate-[-12deg] tracking-widest">
                      {activeBurst.text}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

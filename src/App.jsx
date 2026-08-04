import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import GSAPSuitHangar from './components/GSAPSuitHangar';
import WebLabCustomizer from './components/WebLabCustomizer';
import MatterSpiderGame from './components/MatterSpiderGame';
import PixiWebOverlay from './components/PixiWebOverlay';
import WebCursorTrail from './components/WebCursorTrail';
import AnimatedSpiders from './components/AnimatedSpiders';
import DailyWisdom from './components/DailyWisdom';
import ComicPanels from './components/ComicPanels';
import { Shield, Zap, Terminal } from 'lucide-react';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [webBursts, setWebBursts] = useState([]);
  const [activeWebConfig, setActiveWebConfig] = useState({
    id: 'electric',
    name: 'ELECTRIC CYBER WEB',
    color: '#00F0FF',
    thickness: 3.5,
    speed: 0.22,
    elasticity: 0.05,
  });

  // Trigger web burst at coordinate (x, y)
  const triggerWebShooter = useCallback((x, y) => {
    setWebBursts((prev) => [...prev, { x, y, id: Date.now() }]);
  }, []);

  // Global click handler to fire web-shooter anywhere on the screen
  const handleGlobalClick = (e) => {
    triggerWebShooter(e.clientX, e.clientY);
  };

  return (
    <div 
      onClick={handleGlobalClick}
      className="min-h-screen bg-[#0B0D12] text-slate-100 relative selection:bg-[#FF1E52] selection:text-white overflow-x-hidden cursor-crosshair"
    >
      {/* Site-Wide Glowing Web Cursor Trail Effect */}
      <WebCursorTrail activeWebConfig={activeWebConfig} />

      {/* PixiJS GPU-Accelerated WebGL Web Shooter Overlay */}
      <PixiWebOverlay webBursts={webBursts} activeWebConfig={activeWebConfig} />

      {/* Physics-Driven Autonomous Crawling Spiders */}
      <AnimatedSpiders triggerWebShooter={triggerWebShooter} />

      {/* Navigation Header */}
      <Navbar 
        soundEnabled={soundEnabled} 
        setSoundEnabled={setSoundEnabled} 
        triggerWebShooter={triggerWebShooter} 
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroSection triggerWebShooter={triggerWebShooter} />

        {/* Advanced GSAP 3D Cyber Suit Vault & Hangar Engine */}
        <GSAPSuitHangar />

        {/* Web-Fluid Synthesis & Customizer Lab */}
        <WebLabCustomizer 
          activeWebConfig={activeWebConfig} 
          setActiveWebConfig={setActiveWebConfig} 
          soundEnabled={soundEnabled} 
        />

        {/* Matter.js 2D Rigid-Body Physics Spider Game */}
        <MatterSpiderGame soundEnabled={soundEnabled} activeWebConfig={activeWebConfig} />

        {/* Interactive Web Shooter Zone */}
        <section id="web-shooter" className="py-12 px-4 max-w-7xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#FF1E52]/10 via-[#00F0FF]/10 to-[#141824] border border-[#00F0FF]/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/20 border border-[#00F0FF] flex items-center justify-center text-[#00F0FF]">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-comic text-2xl text-white">INTERACTIVE WEB SHOOTER LAB</h4>
                <p className="text-xs text-slate-400 font-mono">ACTIVE FORMULA: {activeWebConfig.name} // CLICK ANYWHERE TO FIRE</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span 
                className="px-4 py-2 text-xs font-mono bg-[#0B0D12] border rounded-xl font-bold uppercase tracking-wider"
                style={{ borderColor: activeWebConfig.color, color: activeWebConfig.color }}
              >
                PIXIJS WEBGL: ACTIVE
              </span>
            </div>
          </div>
        </section>

        <DailyWisdom soundEnabled={soundEnabled} />
        <ComicPanels triggerWebShooter={triggerWebShooter} />
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800 bg-[#0B0D12] py-12 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#FF1E52]" />
            <span className="font-comic text-xl text-white tracking-wider">
              SPIDER-VERSE <span className="text-[#00F0FF]">CYBER LAB</span>
            </span>
          </div>

          <p className="text-xs font-mono text-[#00F0FF] flex items-center gap-1 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" /> PIXIJS WEBGL GPU ENGINE + MATTER.JS PHYSICS ACTIVE
          </p>

          <div className="text-xs font-mono text-slate-400">
            EARTH-616 APPROVED // 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

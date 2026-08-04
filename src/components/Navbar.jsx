import React, { useState } from 'react';
import { Shield, Volume2, VolumeX, Zap, Radio, Target, TestTube } from 'lucide-react';

export default function Navbar({ soundEnabled, setSoundEnabled, triggerWebShooter }) {
  const playThwipSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
      filter.Q.setValueAtTime(5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.15);
    } catch (err) {
      console.warn("Audio Context playback error:", err);
    }
  };

  const handleSoundToggle = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playThwipSound();
    }
  };

  const handleCtaClick = (e) => {
    playThwipSound();
    if (triggerWebShooter) {
      triggerWebShooter(e.clientX, e.clientY);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0D12]/80 backdrop-blur-md border-b border-[#00F0FF]/20 px-4 lg:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-[#FF1E52] to-[#990026] p-[2px] shadow-glow-red group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0B0D12] rounded-[6px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#FF1E52] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-comic text-2xl tracking-wider text-white flex items-center gap-1">
              SPIDER<span className="text-[#00F0FF]">-VERSE</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#00F0FF]/70 uppercase -mt-1 flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#FF1E52] animate-pulse" /> Earth-616 Online
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 font-medium text-sm">
          <a href="#hero" className="text-slate-300 hover:text-[#00F0FF] transition-colors py-1">
            Overview
          </a>
          <a href="#suit-hangar" className="text-slate-300 hover:text-[#00F0FF] transition-colors py-1">
            Suit Vault
          </a>
          <a href="#web-lab" className="text-[#00F0FF] font-semibold hover:text-[#FF1E52] transition-colors py-1 flex items-center gap-1">
            <TestTube className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" /> Web Lab
          </a>
          <a href="#game-arcade" className="text-[#FF1E52] font-semibold hover:text-[#00F0FF] transition-colors py-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-[#FF1E52] animate-spin" /> Arcade Game
          </a>
          <a href="#wisdom" className="text-slate-300 hover:text-[#00F0FF] transition-colors py-1">
            Spider-Sense
          </a>
          <a href="#comics" className="text-slate-300 hover:text-[#00F0FF] transition-colors py-1">
            Comic Archives
          </a>
        </nav>

        {/* Sound Toggle & Glowing CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSoundToggle}
            className="p-2.5 rounded-lg bg-[#141824] border border-[#00F0FF]/30 text-[#00F0FF] hover:border-[#FF1E52] hover:text-[#FF1E52] transition-colors shadow-sm"
            title={soundEnabled ? "Mute Web Audio" : "Enable Web Audio FX"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>

          <button
            onClick={handleCtaClick}
            className="relative inline-flex items-center gap-2 px-5 py-2.5 font-comic text-lg tracking-wider text-black bg-[#00F0FF] hover:bg-[#FF1E52] hover:text-white rounded-lg transition-all duration-300 shadow-glow-cyan hover:shadow-glow-red hover:scale-105 active:scale-95"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>THWIP ACCESS</span>
          </button>
        </div>

      </div>
    </header>
  );
}

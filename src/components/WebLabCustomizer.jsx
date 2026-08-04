import React, { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { Sliders, Zap, Flame, Shield, Sparkles, RefreshCw, Cpu, TestTube } from 'lucide-react';
import confetti from 'canvas-confetti';

const WEB_FLUID_TYPES = [
  {
    id: 'electric',
    name: 'ELECTRIC CYBER WEB',
    badge: 'HIGH VELOCITY ARC',
    color: '#00F0FF',
    secondaryColor: '#FFE600',
    thickness: 3.5,
    speed: 0.22,
    elasticity: 0.05,
    desc: 'Charged with 50,000 Volts of bio-electric energy. Produces high-speed arc blasts and instant web line extrusion.',
  },
  {
    id: 'symbiote',
    name: 'SYMBIOTE BIO-TENDRIL',
    badge: 'HEAVY ELASTIC DRAG',
    color: '#8B5CF6',
    secondaryColor: '#FF1E52',
    thickness: 5.5,
    speed: 0.14,
    elasticity: 0.16,
    desc: 'Alien organism fluid. Heavy bio-viscous tendrils with maximum elastic stretch and multi-strand branching.',
  },
  {
    id: 'impact',
    name: 'IMPACT GRENADE WEB',
    badge: 'EXPLOSIVE AOE SPLATTER',
    color: '#FFE600',
    secondaryColor: '#FF9900',
    thickness: 7.0,
    speed: 0.16,
    elasticity: 0.02,
    desc: 'High-density web fluid capsule that detonates on impact into a wide area-of-effect web splatter.',
  },
  {
    id: 'cryo',
    name: 'CRYO-ICE FREEZE WEB',
    badge: 'STIFF FROST CRYSTAL',
    color: '#E0F7FA',
    secondaryColor: '#00F0FF',
    thickness: 4.0,
    speed: 0.18,
    elasticity: 0.08,
    desc: 'Sub-zero cryo-cooled web fluid that freezes targets into solid frost crystal web matrices.',
  },
  {
    id: 'plasma',
    name: 'NANOTECH PLASMA WEB',
    badge: 'LASER BEAM TENSILE',
    color: '#7C3AED',
    secondaryColor: '#00F0FF',
    thickness: 2.5,
    speed: 0.28,
    elasticity: 0.01,
    desc: 'Ultra-thin nanotech plasma strands with laser-straight velocity and 100% rigid tensile strength.',
  },
];

export default function WebLabCustomizer({ activeWebConfig, setActiveWebConfig, soundEnabled }) {
  const [selectedPreset, setSelectedPreset] = useState(WEB_FLUID_TYPES[0]);
  const [customSettings, setCustomSettings] = useState({
    color: WEB_FLUID_TYPES[0].color,
    thickness: WEB_FLUID_TYPES[0].thickness,
    speed: WEB_FLUID_TYPES[0].speed,
    elasticity: WEB_FLUID_TYPES[0].elasticity,
  });

  const testStageRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const flyingWebsRef = useRef([]);

  // Sync active web config to parent state
  useEffect(() => {
    if (setActiveWebConfig) {
      setActiveWebConfig({
        id: selectedPreset.id,
        name: selectedPreset.name,
        color: customSettings.color,
        thickness: customSettings.thickness,
        speed: customSettings.speed,
        elasticity: customSettings.elasticity,
      });
    }
  }, [selectedPreset, customSettings, setActiveWebConfig]);

  // Handle Preset Switch
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setCustomSettings({
      color: preset.color,
      thickness: preset.thickness,
      speed: preset.speed,
      elasticity: preset.elasticity,
    });
  };

  // Matter.js Live Test Bench Setup
  useEffect(() => {
    const stage = testStageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const { Engine, World, Bodies } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 0.6 } });
    engineRef.current = engine;

    // Target Drones
    const target1 = Bodies.circle(width * 0.3, 160, 20, { restitution: 0.8, density: 0.002 });
    const target2 = Bodies.circle(width * 0.7, 140, 25, { restitution: 0.8, density: 0.002 });
    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, { isStatic: true });
    World.add(engine.world, [target1, target2, ground]);

    let reqId;
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const render = () => {
      Engine.update(engine, 1000 / 60);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);

      // Draw Target Drones
      [target1, target2].forEach((t) => {
        ctx.save();
        ctx.translate(t.position.x, t.position.y);
        ctx.rotate(t.angle);

        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#141824';
        ctx.strokeStyle = customSettings.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = customSettings.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = customSettings.color;
        ctx.fill();
        ctx.restore();
      });

      // Draw Flying Web Projectiles
      const flyingWebs = flyingWebsRef.current;
      for (let i = flyingWebs.length - 1; i >= 0; i--) {
        const web = flyingWebs[i];
        web.progress += customSettings.speed;
        if (web.progress > 1.0) web.progress = 1.0;

        const currX = lerp(web.startX, web.targetX, web.progress);
        const currY = lerp(web.startY, web.targetY, web.progress);

        // Web Line
        ctx.beginPath();
        ctx.moveTo(web.startX, web.startY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = customSettings.color;
        ctx.lineWidth = customSettings.thickness;
        ctx.shadowColor = customSettings.color;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Web Tendrils
        for (let t = 0; t < 6; t++) {
          const angle = (t / 6) * Math.PI * 2;
          const dist = web.progress * 24;
          ctx.beginPath();
          ctx.moveTo(currX, currY);
          ctx.lineTo(currX + Math.cos(angle) * dist, currY + Math.sin(angle) * dist);
          ctx.strokeStyle = customSettings.color;
          ctx.lineWidth = customSettings.thickness * 0.5;
          ctx.stroke();
        }

        web.alpha -= 0.04;
        if (web.alpha <= 0) {
          flyingWebs.splice(i, 1);
        }
      }

      reqId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(reqId);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [customSettings]);

  // Test Shoot Handler
  const handleTestShoot = (e) => {
    const stage = testStageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    flyingWebsRef.current.push({
      startX: stage.clientWidth / 2,
      startY: stage.clientHeight,
      targetX: clickX,
      targetY: clickY,
      progress: 0,
      alpha: 1.0,
    });

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: [customSettings.color, '#ffffff'],
    });
  };

  return (
    <section id="web-lab" className="py-24 px-4 relative z-20 bg-[#0B0D12]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono tracking-widest uppercase mb-4 shadow-glow-cyan">
            <TestTube className="w-4 h-4 text-[#00F0FF] animate-pulse" /> WEB-FLUID SYNTHESIS LAB
          </div>
          <h2 className="font-comic text-5xl sm:text-7xl text-white tracking-wider">
            CUSTOMIZE <span style={{ color: customSettings.color }} className="transition-colors duration-500">WEB TECH</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base font-light max-w-xl mx-auto">
            Switch web fluid formulas, tweak velocity, thickness & elasticity parameters, and test fire on the live Matter.js physics bench.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Preset Fluid Cards (Left - 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#FF1E52]" /> SELECT WEB FLUID FORMULA
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WEB_FLUID_TYPES.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-5 rounded-2xl bg-[#141824] border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    selectedPreset.id === preset.id
                      ? 'scale-[1.02] shadow-2xl'
                      : 'border-slate-800 hover:border-slate-700 opacity-80'
                  }`}
                  style={{
                    borderColor: selectedPreset.id === preset.id ? preset.color : undefined,
                    boxShadow: selectedPreset.id === preset.id ? `0 0 20px ${preset.color}66` : undefined,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-[#0B0D12] text-[#00F0FF]">
                        {preset.badge}
                      </span>
                      <Sparkles className="w-4 h-4" style={{ color: preset.color }} />
                    </div>

                    <h4 className="font-comic text-xl text-white mb-2">{preset.name}</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">{preset.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">VELOCITY: {(preset.speed * 100).toFixed(0)}%</span>
                    <span style={{ color: preset.color }} className="font-bold">ACTIVE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parameters & Live Test Bench (Right - 5 Cols) */}
          <div className="lg:col-span-5 bg-[#141824]/90 border border-[#00F0FF]/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
            
            <div>
              <h3 className="font-comic text-2xl text-white mb-6 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00F0FF]" /> FLUID PARAMETERS
              </h3>

              {/* Sliders */}
              <div className="space-y-6">
                
                {/* Thickness */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>WEB FLUID THICKNESS</span>
                    <span className="text-[#00F0FF] font-bold">{customSettings.thickness}px</span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="8.0"
                    step="0.5"
                    value={customSettings.thickness}
                    onChange={(e) => setCustomSettings({ ...customSettings, thickness: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-[#0B0D12] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
                  />
                </div>

                {/* Velocity Speed */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>SHOOTER VELOCITY SPEED</span>
                    <span className="text-[#00F0FF] font-bold">{(customSettings.speed * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.08"
                    max="0.30"
                    step="0.02"
                    value={customSettings.speed}
                    onChange={(e) => setCustomSettings({ ...customSettings, speed: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-[#0B0D12] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                    <span>GLOW COLOR THEME</span>
                    <span style={{ color: customSettings.color }} className="font-bold">{customSettings.color}</span>
                  </div>
                  <input
                    type="color"
                    value={customSettings.color}
                    onChange={(e) => setCustomSettings({ ...customSettings, color: e.target.value })}
                    className="w-full h-10 bg-[#0B0D12] border border-slate-800 rounded-xl cursor-pointer p-1"
                  />
                </div>

              </div>
            </div>

            {/* Live Test Bench Stage */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                <span>MATTER.JS LIVE TEST BENCH</span>
                <span className="text-[#00F0FF]">CLICK TO FIRE</span>
              </div>

              <div
                ref={testStageRef}
                onClick={handleTestShoot}
                className="relative w-full h-[150px] bg-[#0B0D12] border border-slate-800 rounded-2xl overflow-hidden cursor-crosshair flex items-center justify-center"
              >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
                <span className="text-[10px] font-mono text-slate-600 pointer-events-none">
                  TEST FIRE CUSTOM WEB FLUID
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

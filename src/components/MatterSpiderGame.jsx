import React, { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { Target, Trophy, Flame, RefreshCw, Zap, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MatterSpiderGame({ soundEnabled }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [defeated, setDefeated] = useState(0);
  const [popups, setPopups] = useState([]);

  const engineRef = useRef(null);
  const spiderObjectsRef = useRef([]);
  const flyingWebsRef = useRef([]);

  // Web Impact Audio Synthesizer
  const playWebShootSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.17);
    } catch (e) {}
  };

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // 1. MATTER.JS ENGINE & WORLD SETUP
    const { Engine, World, Bodies, Constraint, Body, Vector } = Matter;
    const engine = Engine.create({
      gravity: { x: 0, y: 0.8 },
    });
    engineRef.current = engine;

    // Stage Boundaries
    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, { isStatic: true });
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true });
    World.add(engine.world, [ground, leftWall, rightWall]);

    // 2. PHYSICS SPIDER SPAWNER FUNCTION
    const spawnPhysicsSpider = (xPos, silkLen) => {
      const anchor = Bodies.circle(xPos, 0, 4, { isStatic: true });
      const spiderBody = Bodies.circle(xPos, silkLen, 24, {
        density: 0.003,
        restitution: 0.6,
        frictionAir: 0.015,
        render: { fillStyle: '#1A202C' },
      });

      const silkConstraint = Constraint.create({
        bodyA: anchor,
        bodyB: spiderBody,
        stiffness: 0.04,
        damping: 0.03,
        length: silkLen,
      });

      World.add(engine.world, [anchor, spiderBody, silkConstraint]);

      const spiderObj = {
        id: Date.now() + Math.random(),
        anchor,
        spiderBody,
        silkConstraint,
        hit: false,
        fadeAlpha: 1.0,
      };

      spiderObjectsRef.current.push(spiderObj);
      return spiderObj;
    };

    // Initial Spiders
    spawnPhysicsSpider(width * 0.25, 170);
    spawnPhysicsSpider(width * 0.50, 220);
    spawnPhysicsSpider(width * 0.75, 190);

    // 3. MATTER.JS SIMULATION & CANVAS RENDER LOOP
    let reqId;

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const render = () => {
      Engine.update(engine, 1000 / 60);

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);

      // --- A. RENDER ANIMATED FLYING WEB SHOOTER PROJECTILES ---
      const flyingWebs = flyingWebsRef.current;
      for (let i = flyingWebs.length - 1; i >= 0; i--) {
        const web = flyingWebs[i];
        web.progress += web.speed;

        if (web.progress > 1.0) web.progress = 1.0;

        const currX = lerp(web.startX, web.targetX, web.progress);
        const currY = lerp(web.startY, web.targetY, web.progress);

        // Draw Extruding Web Line from Shooter Wrist to Current Tip
        ctx.beginPath();
        ctx.moveTo(web.startX, web.startY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Inner Core White Web Line
        ctx.beginPath();
        ctx.moveTo(web.startX, web.startY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw Branching Web Tendrils at Flying Web Tip
        const tendrilCount = 6;
        const spreadRadius = web.progress * 28;
        for (let t = 0; t < tendrilCount; t++) {
          const angle = (t / tendrilCount) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(currX, currY);
          ctx.lineTo(
            currX + Math.cos(angle) * spreadRadius,
            currY + Math.sin(angle) * spreadRadius
          );
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Web Arrival Impact Trigger
        if (web.progress >= 1.0 && !web.arrived) {
          web.arrived = true;
          executeWebImpact(web.targetX, web.targetY, web.event);
        }

        // Fade & Remove finished webs
        web.alpha -= 0.05;
        if (web.alpha <= 0) {
          flyingWebs.splice(i, 1);
        }
      }

      // --- B. RENDER PHYSICS SPIDERS & SILK THREADS ---
      const activeObjects = spiderObjectsRef.current;
      for (let i = activeObjects.length - 1; i >= 0; i--) {
        const obj = activeObjects[i];
        const { spiderBody, silkConstraint, anchor, hit } = obj;

        if (hit) {
          obj.fadeAlpha -= 0.03;
          if (obj.fadeAlpha <= 0) {
            World.remove(engine.world, [spiderBody]);
            if (silkConstraint) World.remove(engine.world, [silkConstraint]);
            if (anchor) World.remove(engine.world, [anchor]);
            activeObjects.splice(i, 1);
            continue;
          }
        }

        ctx.save();
        ctx.globalAlpha = obj.fadeAlpha;

        // Draw Silk Thread
        if (silkConstraint && !hit) {
          const pA = anchor.position;
          const pB = spiderBody.position;

          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 8;
          ctx.stroke();
        }

        // Draw Spider Body
        const pos = spiderBody.position;
        const angle = spiderBody.angle;

        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        // Body Shadow
        ctx.beginPath();
        ctx.ellipse(8, 8, 14, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fill();

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1A202C';
        ctx.shadowColor = hit ? '#00F0FF' : '#FF1E52';
        ctx.shadowBlur = 10;
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(0, -14, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#0B0D12';
        ctx.fill();

        // Red Hourglass
        ctx.beginPath();
        ctx.moveTo(-4, -4); ctx.lineTo(4, -4); ctx.lineTo(-1, 0); ctx.lineTo(-4, 4); ctx.lineTo(4, 4); ctx.lineTo(1, 0);
        ctx.closePath();
        ctx.fillStyle = '#FF1E52';
        ctx.fill();

        // Legs
        ctx.strokeStyle = hit ? '#00F0FF' : '#FF1E52';
        ctx.lineWidth = 2;
        for (let l = 0; l < 4; l++) {
          const legY = (l - 1.5) * 6;
          ctx.beginPath();
          ctx.moveTo(-6, legY);
          ctx.quadraticCurveTo(-18, legY - 10, -22, legY + (l < 2 ? -14 : 14));
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(6, legY);
          ctx.quadraticCurveTo(18, legY - 10, 22, legY + (l < 2 ? -14 : 14));
          ctx.stroke();
        }

        ctx.restore();
      }

      reqId = requestAnimationFrame(render);
    };

    render();

    // Automatic Respawner Interval
    const respawnTimer = setInterval(() => {
      if (spiderObjectsRef.current.length < 5) {
        const randX = Math.random() * (width - 160) + 80;
        const randLen = Math.random() * 100 + 140;
        spawnPhysicsSpider(randX, randLen);
      }
    }, 2200);

    return () => {
      cancelAnimationFrame(reqId);
      clearInterval(respawnTimer);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, []);

  // Execute Impact Physics when Flying Web reaches (clickX, clickY)
  const executeWebImpact = (clickX, clickY, e) => {
    const { Body, Vector, World } = Matter;
    let hitFound = false;

    spiderObjectsRef.current.forEach((obj) => {
      if (obj.hit) return;

      const pos = obj.spiderBody.position;
      const dist = Math.hypot(clickX - pos.x, clickY - pos.y);

      // Radius Check (50px)
      if (dist < 50) {
        hitFound = true;
        obj.hit = true;

        // Snap Silk String Constraint
        if (obj.silkConstraint) {
          World.remove(engineRef.current.world, obj.silkConstraint);
          obj.silkConstraint = null;
        }

        // Apply Explosion Physics Impulse Force (Ragdoll Fall)
        const forceDirection = Vector.normalise({ x: pos.x - clickX, y: pos.y - (clickY + 40) });
        const impulse = Vector.mult(forceDirection, 0.12);
        Body.applyForce(obj.spiderBody, pos, impulse);
        Body.setAngularVelocity(obj.spiderBody, (Math.random() - 0.5) * 0.6);

        // Update Score & Combo
        const added = 100 * combo;
        setScore((prev) => prev + added);
        setCombo((prev) => Math.min(prev + 1, 5));
        setDefeated((prev) => prev + 1);

        // Action Burst Text
        const popId = Date.now();
        setPopups((prev) => [
          ...prev,
          { id: popId, x: clickX, y: clickY, text: `+${added} PTS!`, combo: combo > 1 ? `COMBO x${combo}` : 'THWIP HIT!' },
        ]);
        setTimeout(() => {
          setPopups((prev) => prev.filter((p) => p.id !== popId));
        }, 1000);

        // Confetti Web Explosion
        if (e) {
          confetti({
            particleCount: 45,
            spread: 75,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
            colors: ['#FF1E52', '#00F0FF', '#FFE600'],
          });
        }
      }
    });

    if (!hitFound) {
      setCombo(1);
    }
  };

  // Stage Click: Trigger Animated Flying Web Projectile Throw!
  const handleStageClick = (e) => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    playWebShootSound();

    // Spawn Animated Flying Web Shooter Projectile Extruding Outwards
    flyingWebsRef.current.push({
      id: Date.now() + Math.random(),
      startX: stage.clientWidth / 2, // Bottom Center Shooter Wrist
      startY: stage.clientHeight,
      targetX: clickX,
      targetY: clickY,
      progress: 0.0,
      speed: 0.12, // Flying web speed
      alpha: 1.0,
      arrived: false,
      event: e,
    });
  };

  const handleReset = () => {
    setScore(0);
    setCombo(1);
    setDefeated(0);
  };

  return (
    <section id="game-arcade" className="py-24 px-4 relative z-20 bg-[#0B0D12]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] text-xs font-mono tracking-widest uppercase mb-4 shadow-glow-cyan">
            <Zap className="w-4 h-4 text-[#00F0FF] animate-pulse" /> ANIMATED WEB SHOOTER PROJECTILE GAME
          </div>
          <h2 className="font-comic text-5xl sm:text-7xl text-white tracking-wider">
            WEB-SHOOTER <span className="text-[#00F0FF]">THROW PROJECTILE</span>
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base font-light max-w-xl mx-auto">
            Click anywhere on the stage to shoot an animated web projectile outwards! Watch webs extrude across space before snapping silk threads.
          </p>
        </div>

        {/* Arcade Stage Box */}
        <div className="relative bg-[#141824]/90 border-2 border-[#00F0FF]/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Top HUD Metrics Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-slate-800 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D12] border border-[#FF1E52] flex items-center justify-center text-[#FF1E52] shadow-glow-red">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">TOTAL SCORE</div>
                <div className="font-comic text-3xl text-white tracking-wider">{score} PTS</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D12] border border-[#FFE600] flex items-center justify-center text-[#FFE600] shadow-glow-gold">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">COMBO STREAK</div>
                <div className="font-comic text-3xl text-[#FFE600] tracking-wider">{combo}x MULTIPLIER</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0B0D12] border border-[#00F0FF] flex items-center justify-center text-[#00F0FF] shadow-glow-cyan">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">PHYSICS SPIDERS CUT</div>
                <div className="font-comic text-3xl text-[#00F0FF] tracking-wider">{defeated} TARGETS</div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-comic text-base text-black bg-[#00F0FF] hover:bg-[#FF1E52] hover:text-white rounded-xl transition-all duration-300 shadow-glow-cyan cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RESTART GAME</span>
            </button>
          </div>

          {/* Interactive Stage */}
          <div
            ref={stageRef}
            onClick={handleStageClick}
            className="relative w-full h-[420px] bg-[#0B0D12] border border-slate-800 rounded-2xl overflow-hidden cursor-crosshair"
          >
            <div className="absolute inset-0 bg-spider-web-bg opacity-30 pointer-events-none" />

            {/* Matter.js & Animated Flying Web Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

            {/* Bottom Center Shooter Wrist Visual Node */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-t from-[#00F0FF] to-transparent rounded-t-full opacity-60 pointer-events-none blur-sm" />

            {/* Action Burst Popups */}
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

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <span className="text-[10px] font-mono text-slate-400 bg-[#141824]/80 px-3 py-1.5 rounded-lg border border-slate-700">
                🕸️ CLICK ANYWHERE TO THROW AN ANIMATED WEB PROJECTILE OUTWARDS FROM THE WRIST SHOOTER!
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

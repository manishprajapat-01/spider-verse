import React, { useEffect, useRef } from 'react';

export default function WebShooterCanvas({ webBursts, soundEnabled }) {
  const canvasRef = useRef(null);

  // Sound generator for canvas web impact
  const playImpactAudio = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio fallback silent
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let webs = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Render web strand structure on burst click
    const createWebBurst = (targetX, targetY) => {
      playImpactAudio();
      
      // Generate web origin anchor points from screen edges
      const origins = [
        { x: 0, y: 0 },
        { x: canvas.width, y: 0 },
        { x: 0, y: canvas.height },
        { x: canvas.width, y: canvas.height },
      ];

      const webNodes = [];
      const numRays = 12;
      const radiusStep = 25;
      const maxRings = 5;

      for (let r = 1; r <= maxRings; r++) {
        const ringRadius = r * radiusStep;
        for (let i = 0; i < numRays; i++) {
          const angle = (i / numRays) * Math.PI * 2;
          const jitterX = (Math.random() - 0.5) * 8;
          const jitterY = (Math.random() - 0.5) * 8;
          webNodes.push({
            x: targetX + Math.cos(angle) * ringRadius + jitterX,
            y: targetY + Math.sin(angle) * ringRadius + jitterY,
            ring: r,
            ray: i,
          });
        }
      }

      // Spark particles
      const particles = [];
      for (let i = 0; i < 25; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        particles.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.5 ? '#00F0FF' : '#FF1E52',
          radius: Math.random() * 3 + 1,
          life: 1.0,
        });
      }

      webs.push({
        targetX,
        targetY,
        origins,
        webNodes,
        particles,
        numRays,
        maxRings,
        alpha: 1.0,
        createdAt: Date.now(),
      });
    };

    // Watch for new burst triggers from prop
    if (webBursts && webBursts.length > 0) {
      const latest = webBursts[webBursts.length - 1];
      if (latest) {
        createWebBurst(latest.x, latest.y);
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let w = webs.length - 1; w >= 0; w--) {
        const web = webs[w];
        web.alpha -= 0.015; // Smooth fade out

        if (web.alpha <= 0) {
          webs.splice(w, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = web.alpha;

        // Draw main anchor web lines extending from target to corners
        web.origins.forEach((orig) => {
          ctx.beginPath();
          ctx.moveTo(orig.x, orig.y);
          ctx.lineTo(web.targetX, web.targetY);
          ctx.strokeStyle = '#00F0FF';
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 10;
          ctx.stroke();
        });

        // Draw radial web threads
        for (let i = 0; i < web.numRays; i++) {
          const angle = (i / web.numRays) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(web.targetX, web.targetY);
          ctx.lineTo(
            web.targetX + Math.cos(angle) * (web.maxRings * 28),
            web.targetY + Math.sin(angle) * (web.maxRings * 28)
          );
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Draw concentric web rings
        for (let r = 1; r <= web.maxRings; r++) {
          ctx.beginPath();
          const ringNodes = web.webNodes.filter((n) => n.ring === r);
          if (ringNodes.length > 0) {
            ctx.moveTo(ringNodes[0].x, ringNodes[0].y);
            for (let i = 1; i < ringNodes.length; i++) {
              ctx.lineTo(ringNodes[i].x, ringNodes[i].y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#FF1E52';
            ctx.shadowBlur = 8;
            ctx.stroke();
          }
        }

        // Render explosion sparks
        web.particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.03;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.fill();
        });

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [webBursts, soundEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
}

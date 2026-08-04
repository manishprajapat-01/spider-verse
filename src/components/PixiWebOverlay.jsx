import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export default function PixiWebOverlay({ webBursts, activeWebConfig }) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const burstsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Initialize PixiJS GPU-Accelerated WebGL Application
    const app = new PIXI.Application();
    
    // PixiJS v7/v8 init compatible setup
    const initPixi = async () => {
      if (app.init) {
        await app.init({
          resizeTo: window,
          backgroundAlpha: 0,
          antialias: true,
        });
      } else {
        // Fallback for PixiJS v7 synchronous setup
        app.renderer = PIXI.autoDetectRenderer({
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundAlpha: 0,
          antialias: true,
        });
      }

      container.appendChild(app.canvas || app.view);
      appRef.current = app;

      // WebGL Stage Container for Web Bursts
      const stageContainer = new PIXI.Container();
      app.stage.addChild(stageContainer);

      // PixiJS Ticker / 60-120 FPS WebGL Render Loop
      app.ticker.add(() => {
        const bursts = burstsRef.current;

        for (let i = bursts.length - 1; i >= 0; i--) {
          const b = bursts[i];
          b.alpha -= 0.02;

          if (b.alpha <= 0) {
            stageContainer.removeChild(b.graphics);
            b.graphics.destroy();
            bursts.splice(i, 1);
            continue;
          }

          b.graphics.alpha = b.alpha;

          // Update particles velocity in WebGL
          b.particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
          });

          // Redraw WebGL Graphics
          const g = b.graphics;
          g.clear();

          const webColor = activeWebConfig?.color ? parseInt(activeWebConfig.color.replace('#', '0x')) : 0x00F0FF;
          const webThickness = activeWebConfig?.thickness || 3.5;

          // Draw Anchor Rays
          b.origins.forEach((orig) => {
            g.lineStyle(webThickness, webColor, b.alpha);
            g.moveTo(orig.x, orig.y);
            g.lineTo(b.targetX, b.targetY);
          });

          // Draw Web Rings
          for (let r = 1; r <= b.maxRings; r++) {
            const ringNodes = b.nodes.filter((n) => n.ring === r);
            if (ringNodes.length > 0) {
              g.lineStyle(webThickness * 0.7, webColor, b.alpha * 0.8);
              g.moveTo(ringNodes[0].x, ringNodes[0].y);
              for (let n = 1; n < ringNodes.length; n++) {
                g.lineTo(ringNodes[n].x, ringNodes[n].y);
              }
              g.closePath();
            }
          }

          // Draw Spark Particles
          b.particles.forEach((p) => {
            g.beginFill(p.color, b.alpha);
            g.drawCircle(p.x, p.y, p.radius);
            g.endFill();
          });
        }
      });
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [activeWebConfig]);

  // Handle new Web Shoot Bursts
  useEffect(() => {
    if (!webBursts || webBursts.length === 0 || !appRef.current) return;
    const latest = webBursts[webBursts.length - 1];
    if (!latest) return;

    const targetX = latest.x;
    const targetY = latest.y;

    const app = appRef.current;
    if (!app || !app.stage) return;

    const graphics = new PIXI.Graphics();
    app.stage.addChild(graphics);

    const origins = [
      { x: 0, y: 0 },
      { x: window.innerWidth, y: 0 },
      { x: 0, y: window.innerHeight },
      { x: window.innerWidth, y: window.innerHeight },
    ];

    const nodes = [];
    const numRays = 12;
    const radiusStep = 28;
    const maxRings = 5;

    for (let r = 1; r <= maxRings; r++) {
      const ringRadius = r * radiusStep;
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2;
        nodes.push({
          x: targetX + Math.cos(angle) * ringRadius + (Math.random() - 0.5) * 8,
          y: targetY + Math.sin(angle) * ringRadius + (Math.random() - 0.5) * 8,
          ring: r,
        });
      }
    }

    const particles = [];
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      particles.push({
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.5 + 1.5,
        color: Math.random() > 0.4 ? (activeWebConfig?.color ? parseInt(activeWebConfig.color.replace('#', '0x')) : 0x00F0FF) : 0xFF1E52,
      });
    }

    burstsRef.current.push({
      targetX,
      targetY,
      origins,
      nodes,
      particles,
      maxRings,
      graphics,
      alpha: 1.0,
    });
  }, [webBursts, activeWebConfig]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
}

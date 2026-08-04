import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

// SVG Vector Black Widow Spider with Red Hourglass Emblem & Drop Shadow
function BlackWidowSVG({ className = "w-16 h-24" }) {
  return (
    <svg className={className} viewBox="-40 -65 80 135" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Glossy Black Body Radial Gradient */}
        <radialGradient id="bwGloss" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="35%" stopColor="#1A202C" />
          <stop offset="100%" stopColor="#080A0F" />
        </radialGradient>
        
        {/* Red Hourglass Glow Filter */}
        <filter id="hourglassGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Realistic Soft Drop Shadow */}
      <g opacity="0.35" transform="translate(10, 12) scale(0.95)">
        <ellipse cx="0" cy="18" rx="14" ry="18" fill="#000" />
        <circle cx="0" cy="-2" r="7" fill="#000" />
        <path d="M-4,-2 C-18,-15 -24,-35 -14,-52" stroke="#000" strokeWidth="4" strokeLinecap="round" />
        <path d="M4,-2 C18,-15 24,-35 14,-52" stroke="#000" strokeWidth="4" strokeLinecap="round" />
        <path d="M-5,0 C-24,-8 -30,-22 -20,-38" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M5,0 C24,-8 30,-22 20,-38" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M-5,4 C-26,12 -32,26 -22,42" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M5,4 C26,12 32,26 22,42" stroke="#000" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M-4,8 C-20,24 -26,48 -14,66" stroke="#000" strokeWidth="4" strokeLinecap="round" />
        <path d="M4,8 C20,24 26,48 14,66" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* 8 Arched Legs (Glossy Black) */}
      <path d="M-4,-2 C-18,-15 -24,-35 -14,-52 C-12,-55 -9,-52 -11,-46 C-17,-32 -12,-15 -2,-2" fill="url(#bwGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M4,-2 C18,-15 24,-35 14,-52 C12,-55 9,-52 11,-46 C17,-32 12,-15 2,-2" fill="url(#bwGloss)" stroke="#1A202C" strokeWidth="1" />

      <path d="M-5,0 C-24,-8 -30,-22 -20,-38 C-18,-41 -15,-38 -17,-33 C-23,-20 -18,-8 -3,0" fill="url(#bwGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M5,0 C24,-8 30,-22 20,-38 C18,-41 15,-38 17,-33 C23,-20 18,-8 3,0" fill="url(#bwGloss)" stroke="#1A202C" strokeWidth="1" />

      <path d="M-5,4 C-26,12 -32,26 -22,42 C-20,45 -17,42 -19,37 C-25,23 -19,10 -3,4" fill="url(#bwGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M5,4 C26,12 32,26 22,42 C20,45 17,42 19,37 C25,23 19,10 3,4" fill="url(#bwGloss)" stroke="#1A202C" strokeWidth="1" />

      <path d="M-4,8 C-20,24 -26,48 -14,66 C-12,69 -9,66 -11,60 C-19,44 -14,22 -2,8" fill="url(#bwGloss)" stroke="#1A202C" strokeWidth="1" />
      <path d="M4,8 C20,24 26,48 14,66 C12,69 9,66 11,60 C19,44 14,22 2,8" fill="url(#bwGloss)" stroke="#1A202C" strokeWidth="1" />

      {/* Cephalothorax */}
      <circle cx="0" cy="-2" r="7" fill="url(#bwGloss)" stroke="#303644" strokeWidth="0.8" />

      {/* Abdomen */}
      <ellipse cx="0" cy="18" rx="14" ry="18" fill="url(#bwGloss)" stroke="#303644" strokeWidth="0.8" />

      {/* Iconic Red Hourglass Emblem */}
      <path
        d="M-5,11 L5,11 L-2,18 L-6,25 L6,25 L2,18 Z"
        fill="#FF1E52"
        filter="url(#hourglassGlow)"
      />
    </svg>
  );
}

export default function AnimatedSpiders({ triggerWebShooter }) {
  const hangingSpider1Ref = useRef(null);
  const hangingSpider2Ref = useRef(null);
  const hangingSpider3Ref = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // 1. Anime.js Pendulous Swinging Animations for Black Widow Spiders
    anime({
      targets: hangingSpider1Ref.current,
      rotate: [-16, 16],
      duration: 2600,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
    });

    anime({
      targets: hangingSpider2Ref.current,
      rotate: [20, -20],
      duration: 3100,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
    });

    anime({
      targets: hangingSpider3Ref.current,
      rotate: [-14, 14],
      duration: 2200,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
    });

    // 2. Physics Engine for Background Crawling Spiders
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const spiders = [];
    for (let i = 0; i < 8; i++) {
      spiders.push({
        x: Math.random() * (window.innerWidth - 200) + 100,
        y: Math.random() * (window.innerHeight - 200) + 100,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        angle: Math.random() * Math.PI * 2,
        legCycle: Math.random() * Math.PI * 2,
        size: Math.random() * 5 + 15,
        scared: false,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spiders.forEach((spider) => {
        const dx = spider.x - mouse.x;
        const dy = spider.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          spider.scared = true;
          const angle = Math.atan2(dy, dx);
          const force = (180 - dist) / 180 * 4.5;
          spider.vx += Math.cos(angle) * force;
          spider.vy += Math.sin(angle) * force;
        } else {
          spider.scared = false;
          spider.vx += (Math.random() - 0.5) * 0.2;
          spider.vy += (Math.random() - 0.5) * 0.2;
        }

        const maxSpeed = spider.scared ? 5.5 : 1.8;
        const currentSpeed = Math.sqrt(spider.vx * spider.vx + spider.vy * spider.vy);
        if (currentSpeed > maxSpeed) {
          spider.vx = (spider.vx / currentSpeed) * maxSpeed;
          spider.vy = (spider.vy / currentSpeed) * maxSpeed;
        }

        spider.x += spider.vx;
        spider.y += spider.vy;
        spider.vx *= 0.94;
        spider.vy *= 0.94;

        if (Math.abs(spider.vx) > 0.1 || Math.abs(spider.vy) > 0.1) {
          spider.angle = Math.atan2(spider.vy, spider.vx) + Math.PI / 2;
        }

        spider.legCycle += currentSpeed * 0.35;

        // Draw Physics Crawling Spider
        ctx.save();
        ctx.translate(spider.x, spider.y);
        ctx.rotate(spider.angle);

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, spider.size * 0.45, spider.size * 0.65, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1A202C';
        ctx.shadowColor = spider.scared ? '#FF1E52' : '#00F0FF';
        ctx.shadowBlur = spider.scared ? 12 : 6;
        ctx.fill();

        // Red Hourglass Mark on Crawling Spiders
        ctx.beginPath();
        ctx.moveTo(-3, -2); ctx.lineTo(3, -2); ctx.lineTo(-1, 2); ctx.lineTo(-3, 6); ctx.lineTo(3, 6); ctx.lineTo(1, 2);
        ctx.closePath();
        ctx.fillStyle = '#FF1E52';
        ctx.fill();

        // Legs
        ctx.strokeStyle = '#FF1E52';
        ctx.lineWidth = 1.8;
        for (let i = 0; i < 4; i++) {
          const legPhase = Math.sin(spider.legCycle + i * 0.8) * 0.3;
          const legY = (i - 1.5) * (spider.size * 0.3);

          ctx.beginPath();
          ctx.moveTo(-spider.size * 0.3, legY);
          ctx.quadraticCurveTo(-spider.size * 1.2, legY + legPhase * 8, -spider.size * 1.5, legY + (i < 2 ? -6 : 6) + legPhase * 12);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(spider.size * 0.3, legY);
          ctx.quadraticCurveTo(spider.size * 1.2, legY - legPhase * 8, spider.size * 1.5, legY + (i < 2 ? -6 : 6) - legPhase * 12);
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSpiderClick = (targetRef, e) => {
    e.stopPropagation();
    if (triggerWebShooter) triggerWebShooter(e.clientX, e.clientY);

    anime({
      targets: targetRef.current,
      translateY: [-140, 0],
      scale: [1.4, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .5)',
    });
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {/* 2D Canvas Layer for Crawling Physics Spiders */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 1. Primary Black Widow Hanging Spider (Top Right) */}
      <div
        ref={hangingSpider1Ref}
        onClick={(e) => handleSpiderClick(hangingSpider1Ref, e)}
        className="pointer-events-auto absolute top-0 right-12 md:right-32 flex flex-col items-center cursor-pointer group"
      >
        {/* Luminous Web Silk Thread */}
        <div className="w-[1.5px] h-[210px] bg-gradient-to-b from-[#00F0FF] via-white to-transparent shadow-glow-cyan" />
        <div className="relative -mt-2 group-hover:scale-125 transition-transform duration-300">
          <BlackWidowSVG className="w-16 h-24" />
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            THWIP ZIP
          </span>
        </div>
      </div>

      {/* 2. Secondary Black Widow Hanging Spider (Top Left) */}
      <div
        ref={hangingSpider2Ref}
        onClick={(e) => handleSpiderClick(hangingSpider2Ref, e)}
        className="pointer-events-auto absolute top-0 left-10 md:left-24 flex flex-col items-center cursor-pointer group"
      >
        <div className="w-[1.5px] h-[160px] bg-gradient-to-b from-[#FF1E52] via-white to-transparent shadow-glow-red" />
        <div className="relative -mt-2 group-hover:scale-125 transition-transform duration-300">
          <BlackWidowSVG className="w-14 h-20" />
        </div>
      </div>

      {/* 3. Third Black Widow Hanging Spider (Middle Right Margin) */}
      <div
        ref={hangingSpider3Ref}
        onClick={(e) => handleSpiderClick(hangingSpider3Ref, e)}
        className="pointer-events-auto absolute top-1/3 right-6 hidden lg:flex flex-col items-center cursor-pointer group"
      >
        <div className="w-[1.5px] h-[260px] bg-gradient-to-b from-[#FFE600] via-white to-transparent shadow-glow-cyan" />
        <div className="relative -mt-2 group-hover:scale-125 transition-transform duration-300">
          <BlackWidowSVG className="w-12 h-18" />
        </div>
      </div>
    </div>
  );
}

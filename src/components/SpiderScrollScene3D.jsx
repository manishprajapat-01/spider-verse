import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';
import { Zap, Compass, ShieldAlert, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function SpiderScrollScene3D({ modelUrl }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const hudRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0B0D12, 0.03);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // --- 2. LIGHTING (CYBER-NEON) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Neon Red Point Light (Left)
    const redLight = new THREE.PointLight(0xFF1E52, 6, 15);
    redLight.position.set(-4, 2, 3);
    scene.add(redLight);

    // Cyber Cyan Point Light (Right)
    const cyanLight = new THREE.PointLight(0x00F0FF, 6, 15);
    cyanLight.position.set(4, -2, 3);
    scene.add(cyanLight);

    // --- 3. PROCEDURAL SPIDER-MAN MODEL (FALLBACK) & GLTFLOADER ---
    const spiderGroup = new THREE.Group();
    scene.add(spiderGroup);

    // Build procedural high-detail 3D Spider-Man hero mesh
    const heroMaterial = new THREE.MeshStandardMaterial({
      color: 0xFF1E52,
      roughness: 0.3,
      metalness: 0.7,
    });
    const blueArmorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0055FF,
      roughness: 0.2,
      metalness: 0.8,
    });
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00F0FF,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });

    // Head
    const headGeo = new THREE.SphereGeometry(0.5, 32, 32);
    headGeo.scale(1, 1.2, 0.9);
    const headMesh = new THREE.Mesh(headGeo, heroMaterial);
    headMesh.position.y = 1.6;
    spiderGroup.add(headMesh);

    // Eyes (Lenses)
    const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
    eyeGeo.scale(1.5, 0.6, 0.4);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    leftEye.position.set(-0.18, 1.68, 0.42);
    leftEye.rotation.z = -0.2;
    const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    rightEye.position.set(0.18, 1.68, 0.42);
    rightEye.rotation.z = 0.2;
    spiderGroup.add(leftEye, rightEye);

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.6, 0.4, 1.4, 16);
    const torsoMesh = new THREE.Mesh(torsoGeo, heroMaterial);
    torsoMesh.position.y = 0.6;
    spiderGroup.add(torsoMesh);

    // Spider Chest Emblem
    const emblemGeo = new THREE.OctahedronGeometry(0.2, 0);
    const emblemMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF, wireframe: true });
    const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
    emblemMesh.position.set(0, 0.8, 0.55);
    spiderGroup.add(emblemMesh);

    // Shoulders & Arms
    const armGeo = new THREE.CylinderGeometry(0.14, 0.12, 1.1, 16);
    const leftArm = new THREE.Mesh(armGeo, blueArmorMaterial);
    leftArm.position.set(-0.75, 0.7, 0);
    leftArm.rotation.z = 0.4;

    const rightArm = new THREE.Mesh(armGeo, heroMaterial);
    rightArm.position.set(0.75, 0.7, 0);
    rightArm.rotation.z = -0.4;
    spiderGroup.add(leftArm, rightArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.18, 0.14, 1.4, 16);
    const leftLeg = new THREE.Mesh(legGeo, blueArmorMaterial);
    leftLeg.position.set(-0.35, -0.7, 0);
    leftLeg.rotation.z = 0.1;

    const rightLeg = new THREE.Mesh(legGeo, heroMaterial);
    rightLeg.position.set(0.35, -0.7, 0);
    rightLeg.rotation.z = -0.1;
    spiderGroup.add(leftLeg, rightLeg);

    // Glowing Wireframe Outer Armor Suit-Up Layer
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const armorOuter = new THREE.Mesh(torsoGeo.clone().scale(1.1, 1.1, 1.1), wireframeMat);
    armorOuter.position.y = 0.6;
    spiderGroup.add(armorOuter);

    // If external GLTF Model is provided, load it over procedural group
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        gltf.scene.scale.set(1.5, 1.5, 1.5);
        gltf.scene.position.y = -1;
        spiderGroup.add(gltf.scene);
      });
    }

    // --- 4. 3D WEB STRAND VECTORS (PHASE 2) ---
    const webGroup = new THREE.Group();
    scene.add(webGroup);

    const webLineMat = new THREE.LineBasicMaterial({ color: 0x00F0FF, linewidth: 2 });
    for (let i = 0; i < 16; i++) {
      const points = [
        new THREE.Vector3(0, 0.6, 0.5),
        new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, 8),
      ];
      const webGeo = new THREE.BufferGeometry().setFromPoints(points);
      const webLine = new THREE.Line(webGeo, webLineMat);
      webLine.scale.set(0.01, 0.01, 0.01); // starts collapsed
      webGroup.add(webLine);
    }

    // --- 5. 3D TARGET VILLAIN MESH (PHASE 3) ---
    const villainGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const villainMat = new THREE.MeshStandardMaterial({
      color: 0x990026,
      wireframe: true,
      emissive: 0xFF1E52,
      emissiveIntensity: 0.5,
    });
    const villainMesh = new THREE.Mesh(villainGeo, villainMat);
    villainMesh.position.set(0, 0, -5); // Hidden far back initially
    scene.add(villainMesh);

    // Particle Swarm
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00F0FF,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Initial State
    spiderGroup.scale.set(0.2, 0.2, 0.2);
    spiderGroup.rotation.y = Math.PI * 2;

    // --- 6. GSAP SCROLLTRIGGER TIMELINE ---
    const st = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=300%', // 300% scroll depth
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          // HUD text update based on scroll phase
          if (hudRef.current) {
            const prog = self.progress;
            if (prog < 0.33) {
              hudRef.current.innerText = `PHASE 1: SUIT-UP SYNCHRONIZATION (${Math.round(prog * 300)}%)`;
            } else if (prog < 0.66) {
              hudRef.current.innerText = `PHASE 2: WEB-SHOOTER VECTOR LOCK (${Math.round(prog * 100)}%)`;
            } else {
              hudRef.current.innerText = `PHASE 3: KINETIC IMPACT OVERDRIVE (${Math.round(prog * 100)}%)`;
            }
          }
        },
      },
    });

    // PHASE 1: SUIT-UP ENTRY (0% - 33%)
    st.to(spiderGroup.scale, { x: 1, y: 1, z: 1, duration: 1 })
      .to(spiderGroup.rotation, { y: 0, x: 0.1, duration: 1 }, 0)
      .to(armorOuter.material, { opacity: 0.1, duration: 1 }, 0.5);

    // PHASE 2: WEB-SHOOTER POSE & WEB VECTORS (33% - 66%)
    st.to(spiderGroup.position, { z: 2, y: -0.2, duration: 1 })
      .to(spiderGroup.rotation, { x: 0.3, y: -0.4, duration: 1 }, '<')
      .to(rightArm.rotation, { x: -1.2, z: -0.8, duration: 1 }, '<')
      .to(webGroup.children.map((w) => w.scale), { x: 1, y: 1, z: 1, stagger: 0.02, duration: 1 }, '<');

    // PHASE 3: VILLAIN PUNCH & CAMERA SHAKE (66% - 100%)
    st.to(villainMesh.position, { z: 1, duration: 1 })
      .to(spiderGroup.position, { z: 3, x: -0.5, y: 0.2, duration: 1 }, '<')
      .to(spiderGroup.rotation, { y: 0.8, x: -0.2, duration: 1 }, '<')
      .to(camera.position, {
        z: 5,
        duration: 0.8,
        onStart: () => {
          // Anime.js camera shockwave impact shake
          anime({
            targets: camera.position,
            x: [0, 0.3, -0.3, 0.2, -0.2, 0],
            y: [0, -0.2, 0.2, -0.1, 0.1, 0],
            duration: 500,
            easing: 'easeInOutQuad',
          });
        },
      });

    // --- 7. ANIMATION LOOP ---
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      
      // Idle float & background rotations
      particles.rotation.y += 0.001;
      villainMesh.rotation.x += 0.01;
      villainMesh.rotation.y += 0.015;

      renderer.render(scene, camera);
    };
    animate();

    // --- 8. RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#0B0D12] overflow-hidden border-y border-[#00F0FF]/20"
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Cyber HUD Overlay (Anime.js / GSAP integrated) */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141824]/90 border border-[#00F0FF]/40 backdrop-blur-md shadow-glow-cyan">
          <Cpu className="w-4 h-4 text-[#00F0FF] animate-pulse" />
          <span ref={hudRef} className="font-mono text-xs text-[#00F0FF] uppercase tracking-widest">
            PHASE 1: SUIT-UP SYNCHRONIZATION (0%)
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-20 pointer-events-none text-right">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141824]/90 border border-[#FF1E52]/40 backdrop-blur-md shadow-glow-red">
          <ShieldAlert className="w-4 h-4 text-[#FF1E52] animate-bounce" />
          <span className="font-mono text-xs text-[#FF1E52] uppercase tracking-widest">
            SCROLL TO ENGAGE 3D SEQUENCES
          </span>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 opacity-80">
        <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">SCROLL DOWN</span>
        <div className="w-5 h-9 rounded-full border-2 border-[#00F0FF] flex items-start justify-center p-1">
          <div className="w-1.5 h-2.5 rounded-full bg-[#FF1E52] animate-bounce" />
        </div>
      </div>
    </section>
  );
}

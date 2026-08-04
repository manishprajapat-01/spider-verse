import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';
import { Film, Zap, Activity, Radio } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Custom Radial Impact Shockwave GLSL Shader
const ShockwaveShader = {
  uniforms: {
    tDiffuse: { value: null },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    time: { value: 0.0 },
    progress: { value: 0.0 },
    strength: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 center;
    uniform float progress;
    uniform float strength;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 dir = uv - center;
      float dist = length(dir);

      // Radial shockwave ring calculation
      float wave = sin(dist * 35.0 - progress * 20.0) * strength * exp(-dist * 4.0);
      vec2 offset = normalize(dir) * wave;

      // Chromatic aberration shift on shockwave
      vec4 r = texture2D(tDiffuse, uv + offset * 1.2);
      vec4 g = texture2D(tDiffuse, uv + offset);
      vec4 b = texture2D(tDiffuse, uv + offset * 0.8);

      gl_FragColor = vec4(r.r, g.g, b.b, 1.0);
    }
  `,
};

export default function CinematicSpiderScene3D({ modelUrl }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const hudRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- 1. THREE.JS SCENE & CAMERA SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0B0D12, 0.025);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1, 9);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 2. POST-PROCESSING PIPELINE (EFFECT COMPOSER) ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Unreal Bloom Pass for Glowing Neon Rim Lights
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.2, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);

    // Custom Radial Shockwave ShaderPass
    const shockwavePass = new ShaderPass(ShockwaveShader);
    composer.addPass(shockwavePass);

    // --- 3. CINEMATIC LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 12, 8);
    scene.add(dirLight);

    const neonRedLight = new THREE.PointLight(0xFF1E52, 8, 20);
    neonRedLight.position.set(-5, 3, 4);
    scene.add(neonRedLight);

    const cyberCyanLight = new THREE.PointLight(0x00F0FF, 8, 20);
    cyberCyanLight.position.set(5, -3, 4);
    scene.add(cyberCyanLight);

    // --- 4. SPIDER-MAN MODEL GROUP & SUIT ASSEMBLY PARTICLES ---
    const spiderGroup = new THREE.Group();
    scene.add(spiderGroup);

    // Procedural Suit Geometry
    const heroMat = new THREE.MeshStandardMaterial({ color: 0xFF1E52, roughness: 0.25, metalness: 0.75 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0055FF, roughness: 0.2, metalness: 0.8 });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), heroMat);
    head.position.y = 1.6;
    spiderGroup.add(head);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 1.4, 16), heroMat);
    torso.position.y = 0.6;
    spiderGroup.add(torso);

    const armGeo = new THREE.CylinderGeometry(0.14, 0.12, 1.1, 16);
    const leftArm = new THREE.Mesh(armGeo, blueMat);
    leftArm.position.set(-0.75, 0.7, 0);
    leftArm.rotation.z = 0.4;
    const rightArm = new THREE.Mesh(armGeo, heroMat);
    rightArm.position.set(0.75, 0.7, 0);
    rightArm.rotation.z = -0.4;
    spiderGroup.add(leftArm, rightArm);

    // Suit Assembly Energy Swarm Particles
    const assemblyCount = 300;
    const assemblyGeo = new THREE.BufferGeometry();
    const assemblyPos = new Float32Array(assemblyCount * 3);
    for (let i = 0; i < assemblyCount * 3; i++) {
      assemblyPos[i] = (Math.random() - 0.5) * 4;
    }
    assemblyGeo.setAttribute('position', new THREE.BufferAttribute(assemblyPos, 3));
    const assemblyMat = new THREE.PointsMaterial({
      color: 0x00F0FF,
      size: 0.06,
      transparent: true,
      opacity: 0.9,
    });
    const assemblyParticles = new THREE.Points(assemblyGeo, assemblyMat);
    spiderGroup.add(assemblyParticles);

    // GLTFLoader & Mixamo Animation Track Setup
    let mixer = null;
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        gltf.scene.scale.set(1.5, 1.5, 1.5);
        spiderGroup.add(gltf.scene);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      });
    }

    // --- 5. SPEED LINES VELOCITY TUNNEL (WEB SHOOT PHASE) ---
    const speedLineCount = 150;
    const speedLineGeo = new THREE.BufferGeometry();
    const speedLinePos = new Float32Array(speedLineCount * 6);
    for (let i = 0; i < speedLineCount; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = Math.random() * -20;
      speedLinePos[i * 6] = x;
      speedLinePos[i * 6 + 1] = y;
      speedLinePos[i * 6 + 2] = z;
      speedLinePos[i * 6 + 3] = x;
      speedLinePos[i * 6 + 4] = y;
      speedLinePos[i * 6 + 5] = z - 2; // streak length
    }
    speedLineGeo.setAttribute('position', new THREE.BufferAttribute(speedLinePos, 3));
    const speedLineMat = new THREE.LineBasicMaterial({
      color: 0x00F0FF,
      transparent: true,
      opacity: 0.0, // Hidden until web shoot phase
    });
    const speedLines = new THREE.LineSegments(speedLineGeo, speedLineMat);
    scene.add(speedLines);

    // --- 6. TARGET VILLAIN MESH ---
    const villainMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 1),
      new THREE.MeshStandardMaterial({ color: 0x990026, wireframe: true, emissive: 0xFF1E52, emissiveIntensity: 0.6 })
    );
    villainMesh.position.set(0, 0, -6);
    scene.add(villainMesh);

    // --- 7. SMOOTH LERP SCROLL TRACKING & GSAP SCROLLTRIGGER ---
    const targetState = {
      camZ: 9,
      camY: 1,
      camFov: 45,
      spiderZ: 0,
      spiderRotY: Math.PI * 2,
      speedOpacity: 0.0,
      villainZ: -6,
      shockwaveProgress: 0.0,
      shockwaveStrength: 0.0,
    };

    const currentState = { ...targetState };

    const st = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=350%',
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const p = self.progress;

          // Phase 1: Suit Up (0 - 0.33)
          if (p < 0.33) {
            const phaseP = p / 0.33;
            targetState.camZ = 9 - phaseP * 2;
            targetState.camFov = 45 + phaseP * 15; // Low-angle to dramatic FOV
            targetState.spiderRotY = (1 - phaseP) * Math.PI * 2;
            targetState.speedOpacity = 0.0;
            if (hudRef.current) hudRef.current.innerText = `PHASE 1: SUIT-UP PARTICLES (${Math.round(phaseP * 100)}%)`;
          } 
          // Phase 2: Web Shoot & Speed Lines (0.33 - 0.66)
          else if (p < 0.66) {
            const phaseP = (p - 0.33) / 0.33;
            targetState.spiderZ = phaseP * 2.5;
            targetState.speedOpacity = phaseP * 0.9; // Velocity streaks active
            targetState.camFov = 60 + phaseP * 20; // Wide cinematic FOV
            if (hudRef.current) hudRef.current.innerText = `PHASE 2: VELOCITY STREAKS (${Math.round(phaseP * 100)}%)`;
          } 
          // Phase 3: Villain Punch & Shockwave (0.66 - 1.0)
          else {
            const phaseP = (p - 0.66) / 0.34;
            targetState.villainZ = -6 + phaseP * 7;
            targetState.spiderZ = 2.5 + phaseP * 1.5;
            targetState.speedOpacity = (1 - phaseP) * 0.5;

            // Trigger Shockwave on Impact
            if (phaseP > 0.6 && targetState.shockwaveStrength === 0.0) {
              targetState.shockwaveStrength = 0.25;

              // Anime.js elastic shockwave & camera shake
              anime({
                targets: targetState,
                shockwaveProgress: [0, 1],
                shockwaveStrength: [0.3, 0],
                duration: 900,
                easing: 'easeOutElastic(1, .4)',
              });

              anime({
                targets: camera.position,
                x: [0, 0.4, -0.4, 0.2, -0.2, 0],
                y: [1, 1.3, 0.7, 1.1, 0.9, 1],
                duration: 600,
                easing: 'easeOutQuad',
              });
            }

            if (hudRef.current) hudRef.current.innerText = `PHASE 3: SHOCKWAVE IMPACT OVERDRIVE (${Math.round(phaseP * 100)}%)`;
          }
        },
      },
    });

    // --- 8. RENDER LOOP WITH LERP & POST-PROCESSING ---
    const clock = new THREE.Clock();
    let reqId;

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      // Smooth Frame-by-Frame Lerp Interpolation
      currentState.camZ = lerp(currentState.camZ, targetState.camZ, 0.08);
      currentState.camY = lerp(currentState.camY, targetState.camY, 0.08);
      currentState.camFov = lerp(currentState.camFov, targetState.camFov, 0.08);
      currentState.spiderZ = lerp(currentState.spiderZ, targetState.spiderZ, 0.08);
      currentState.spiderRotY = lerp(currentState.spiderRotY, targetState.spiderRotY, 0.08);
      currentState.speedOpacity = lerp(currentState.speedOpacity, targetState.speedOpacity, 0.1);
      currentState.villainZ = lerp(currentState.villainZ, targetState.villainZ, 0.08);

      // Update Camera & Objects
      camera.position.z = currentState.camZ;
      camera.fov = currentState.camFov;
      camera.updateProjectionMatrix();

      spiderGroup.position.z = currentState.spiderZ;
      spiderGroup.rotation.y = currentState.spiderRotY;
      speedLineMat.opacity = currentState.speedOpacity;
      villainMesh.position.z = currentState.villainZ;

      // Animate Velocity Tunnel Lines Rushing Past Camera
      if (currentState.speedOpacity > 0.05) {
        const positions = speedLineGeo.attributes.position.array;
        for (let i = 0; i < speedLineCount; i++) {
          positions[i * 6 + 2] += 0.8;
          positions[i * 6 + 5] += 0.8;
          if (positions[i * 6 + 2] > 10) {
            positions[i * 6 + 2] = -20;
            positions[i * 6 + 5] = -22;
          }
        }
        speedLineGeo.attributes.position.needsUpdate = true;
      }

      // Update Shockwave Shader Uniforms
      shockwavePass.uniforms.progress.value = targetState.shockwaveProgress;
      shockwavePass.uniforms.strength.value = targetState.shockwaveStrength;
      shockwavePass.uniforms.time.value += delta;

      // Render through Post-Processing Composer
      composer.render();
    };

    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      composer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#0B0D12] overflow-hidden border-y border-[#FF1E52]/30">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141824]/90 border border-[#FF1E52]/40 backdrop-blur-md shadow-glow-red">
          <Film className="w-4 h-4 text-[#FF1E52] animate-pulse" />
          <span ref={hudRef} className="font-mono text-xs text-[#FF1E52] uppercase tracking-widest">
            PHASE 1: SUIT-UP PARTICLES (0%)
          </span>
        </div>
      </div>
    </section>
  );
}

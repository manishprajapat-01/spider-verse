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
import { Sparkles, Shield, Cpu, Flame } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Custom GLSL Vignette & Color Correction Shader
const VignetteColorShader = {
  uniforms: {
    tDiffuse: { value: null },
    darkness: { value: 1.1 },
    offset: { value: 0.9 },
    contrast: { value: 1.15 },
    saturation: { value: 1.2 },
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
    uniform float darkness;
    uniform float offset;
    uniform float contrast;
    uniform float saturation;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      // Contrast adjustment
      vec3 c = (color.rgb - 0.5) * contrast + 0.5;

      // Saturation enhancement
      float gray = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(gray), c, saturation);

      // Vignette effect
      vec2 uv = (vUv - 0.5) * vec2(offset);
      float vig = 1.0 - dot(uv, uv) * darkness;
      c *= clamp(vig, 0.0, 1.0);

      gl_FragColor = vec4(c, color.a);
    }
  `,
};

// Procedural Normal Bump Canvas Generator for Suit Weave Fabric
function generateSuitNormalMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgb(128, 128, 255)'; // Base flat normal
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = 'rgb(200, 100, 255)';
  for (let i = 0; i < 256; i += 8) {
    for (let j = 0; j < 256; j += 8) {
      ctx.fillRect(i, j, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

export default function AAASpiderScene3D({ modelUrl }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const hudRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- 1. SCENE & CAMERA SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0B0D12, 0.02);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 8.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- 2. EFFECT COMPOSER & AAA POST-PROCESSING ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // High-Tech Eye Bloom & Rim Light Bloom Pass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.5, // Bloom Strength
      0.5, // Bloom Radius
      0.2  // Threshold (picks up bright glowing lenses & rim lights)
    );
    composer.addPass(bloomPass);

    // Color Correction & Vignette Shader Pass
    const vignettePass = new ShaderPass(VignetteColorShader);
    composer.addPass(vignettePass);

    // --- 3. CINEMATIC 3-POINT STUDIO LIGHTING SETUP ---
    // A. Key Light (High-Contrast Main Sunlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    // B. Warm Ambient / Fill Light (Dark Cyber Shadow Fill)
    const fillLight = new THREE.AmbientLight(0x141824, 0.8);
    scene.add(fillLight);

    // C. Strong Rim Light 1: Cyber Cyan Silhouette Edge Glow (Back Right)
    const rimCyan = new THREE.DirectionalLight(0x00F0FF, 5.0);
    rimCyan.position.set(8, 2, -6);
    scene.add(rimCyan);

    // D. Strong Rim Light 2: Neon Red Silhouette Edge Glow (Back Left)
    const rimRed = new THREE.DirectionalLight(0xFF1E52, 5.0);
    rimRed.position.set(-8, 2, -6);
    scene.add(rimRed);

    // --- 4. AAA PBR SPIDER-MAN MODEL & MATERIALS ---
    const spiderGroup = new THREE.Group();
    scene.add(spiderGroup);

    const normalMap = generateSuitNormalMap();

    // PBR Physical Red Suit Material
    const pbrRedSuitMat = new THREE.MeshPhysicalMaterial({
      color: 0xFF1E52,
      roughness: 0.25,
      metalness: 0.4,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
    });

    // PBR Physical Blue Armored Material
    const pbrBlueSuitMat = new THREE.MeshPhysicalMaterial({
      color: 0x0055FF,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 0.8,
      normalMap: normalMap,
    });

    // Emissive Glowing Optics Eye Lenses
    const eyeOpticsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00F0FF,
      emissiveIntensity: 3.5,
      roughness: 0.05,
    });

    // Construct High-Detail Procedural PBR Model
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), pbrRedSuitMat);
    headMesh.position.y = 1.6;
    spiderGroup.add(headMesh);

    // Lenses
    const eyeGeo = new THREE.SphereGeometry(0.16, 16, 16);
    eyeGeo.scale(1.5, 0.6, 0.4);
    const leftEye = new THREE.Mesh(eyeGeo, eyeOpticsMat);
    leftEye.position.set(-0.18, 1.68, 0.42);
    leftEye.rotation.z = -0.2;
    const rightEye = new THREE.Mesh(eyeGeo, eyeOpticsMat);
    rightEye.position.set(0.18, 1.68, 0.42);
    rightEye.rotation.z = 0.2;
    spiderGroup.add(leftEye, rightEye);

    const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 1.4, 32), pbrRedSuitMat);
    torsoMesh.position.y = 0.6;
    spiderGroup.add(torsoMesh);

    const armGeo = new THREE.CylinderGeometry(0.14, 0.12, 1.1, 16);
    const leftArm = new THREE.Mesh(armGeo, pbrBlueSuitMat);
    leftArm.position.set(-0.75, 0.7, 0);
    leftArm.rotation.z = 0.4;
    const rightArm = new THREE.Mesh(armGeo, pbrRedSuitMat);
    rightArm.position.set(0.75, 0.7, 0);
    rightArm.rotation.z = -0.4;
    spiderGroup.add(leftArm, rightArm);

    // GLTFLoader for custom PBR GLTF models
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.envMapIntensity = 1.5;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        spiderGroup.add(gltf.scene);
      });
    }

    // --- 5. HD DYNAMIC 3D TUBEGEOMETRY WEB SPLINES ---
    const webGroup = new THREE.Group();
    scene.add(webGroup);

    const webTubeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00F0FF,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.9,
    });

    const webTubes = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.6, 0.5),
        new THREE.Vector3(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 3),
        new THREE.Vector3(Math.cos(angle) * 4.5, Math.sin(angle) * 4.5, 7),
      ]);

      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, webTubeMat);
      tubeMesh.scale.set(0.001, 0.001, 0.001); // Inflates forward on scroll
      webGroup.add(tubeMesh);
      webTubes.push(tubeMesh);
    }

    // --- 6. GSAP SCROLLTRIGGER & LERP PHYSICS ---
    const targetState = {
      camZ: 8.5,
      camY: 1.2,
      camFov: 45,
      spiderZ: 0,
      spiderRotY: Math.PI * 2,
      webScale: 0.001,
      bloomStrength: 1.5,
    };
    const currentState = { ...targetState };

    gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=350%',
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.33) {
            targetState.camZ = 8.5 - p * 3;
            targetState.spiderRotY = (1 - p * 3) * Math.PI * 2;
            targetState.webScale = 0.001;
            if (hudRef.current) hudRef.current.innerText = `PHASE 1: PBR SUIT INITIALIZATION (${Math.round(p * 300)}%)`;
          } else if (p < 0.66) {
            const phaseP = (p - 0.33) / 0.33;
            targetState.spiderZ = phaseP * 2;
            targetState.webScale = phaseP * 1.0; // Dynamic 3D Tube web inflation
            targetState.camFov = 45 + phaseP * 25; // Dramatic FOV shift
            if (hudRef.current) hudRef.current.innerText = `PHASE 2: 3D SPLINE WEB INFLATION (${Math.round(phaseP * 100)}%)`;
          } else {
            const phaseP = (p - 0.66) / 0.34;
            targetState.bloomStrength = 1.5 + phaseP * 1.5;
            if (hudRef.current) hudRef.current.innerText = `PHASE 3: AAA OPTICS & RIM LIGHT BLOOM (${Math.round(phaseP * 100)}%)`;
          }
        },
      },
    });

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    // --- 7. RENDER LOOP ---
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Smooth Frame-by-Frame Lerp
      currentState.camZ = lerp(currentState.camZ, targetState.camZ, 0.08);
      currentState.camFov = lerp(currentState.camFov, targetState.camFov, 0.08);
      currentState.spiderZ = lerp(currentState.spiderZ, targetState.spiderZ, 0.08);
      currentState.spiderRotY = lerp(currentState.spiderRotY, targetState.spiderRotY, 0.08);
      currentState.webScale = lerp(currentState.webScale, targetState.webScale, 0.1);
      currentState.bloomStrength = lerp(currentState.bloomStrength, targetState.bloomStrength, 0.08);

      camera.position.z = currentState.camZ;
      camera.fov = currentState.camFov;
      camera.updateProjectionMatrix();

      spiderGroup.position.z = currentState.spiderZ;
      spiderGroup.rotation.y = currentState.spiderRotY;

      webTubes.forEach((t) => {
        t.scale.set(currentState.webScale, currentState.webScale, currentState.webScale);
      });

      bloomPass.strength = currentState.bloomStrength;

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
    <section ref={containerRef} className="relative w-full h-screen bg-[#0B0D12] overflow-hidden border-y border-[#00F0FF]/30">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141824]/90 border border-[#00F0FF]/40 backdrop-blur-md shadow-glow-cyan">
          <Sparkles className="w-4 h-4 text-[#00F0FF] animate-pulse" />
          <span ref={hudRef} className="font-mono text-xs text-[#00F0FF] uppercase tracking-widest">
            PHASE 1: PBR SUIT INITIALIZATION (0%)
          </span>
        </div>
      </div>
    </section>
  );
}

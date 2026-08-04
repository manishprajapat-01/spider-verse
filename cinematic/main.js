import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';

gsap.registerPlugin(ScrollTrigger);

// Custom Shockwave GLSL Shader
const ShockwaveShader = {
  uniforms: {
    tDiffuse: { value: null },
    center: { value: new THREE.Vector2(0.5, 0.5) },
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

      float wave = sin(dist * 35.0 - progress * 20.0) * strength * exp(-dist * 4.0);
      vec2 offset = normalize(dir) * wave;

      vec4 r = texture2D(tDiffuse, uv + offset * 1.2);
      vec4 g = texture2D(tDiffuse, uv + offset);
      vec4 b = texture2D(tDiffuse, uv + offset * 0.8);

      gl_FragColor = vec4(r.r, g.g, b.b, 1.0);
    }
  `,
};

const container = document.getElementById('scroll-cinematic-container');
const canvas = document.getElementById('three-canvas');
const hudStatus = document.getElementById('hud-status');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 9);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Post Processing Pipeline
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85);
composer.addPass(bloomPass);

const shockwavePass = new ShaderPass(ShockwaveShader);
composer.addPass(shockwavePass);

// Lights & Spider Mesh
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
dirLight.position.set(5, 12, 8);
scene.add(ambientLight, dirLight);

const spiderGroup = new THREE.Group();
scene.add(spiderGroup);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color: 0xFF1E52 }));
head.position.y = 1.6;
spiderGroup.add(head);

// Lerp & Scroll Setup
const targetState = { camZ: 9, fov: 45, spiderZ: 0, shockwaveProgress: 0, shockwaveStrength: 0 };
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
        targetState.camZ = 9 - p * 6;
        targetState.fov = 45 + p * 45;
        hudStatus.innerText = `PHASE 1: SUIT-UP PARTICLES (${Math.round(p * 300)}%)`;
      } else if (p < 0.66) {
        targetState.spiderZ = (p - 0.33) * 6;
        hudStatus.innerText = `PHASE 2: VELOCITY STREAKS (${Math.round((p - 0.33) * 300)}%)`;
      } else {
        if (targetState.shockwaveStrength === 0) {
          targetState.shockwaveStrength = 0.3;
          anime({ targets: targetState, shockwaveProgress: [0, 1], shockwaveStrength: [0.3, 0], duration: 900, easing: 'easeOutElastic(1, .4)' });
        }
        hudStatus.innerText = `PHASE 3: SHOCKWAVE IMPACT OVERDRIVE (${Math.round((p - 0.66) * 300)}%)`;
      }
    },
  },
});

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

function animate() {
  requestAnimationFrame(animate);
  currentState.camZ = lerp(currentState.camZ, targetState.camZ, 0.08);
  currentState.fov = lerp(currentState.fov, targetState.fov, 0.08);

  camera.position.z = currentState.camZ;
  camera.fov = currentState.fov;
  camera.updateProjectionMatrix();

  shockwavePass.uniforms.progress.value = targetState.shockwaveProgress;
  shockwavePass.uniforms.strength.value = targetState.shockwaveStrength;

  composer.render();
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

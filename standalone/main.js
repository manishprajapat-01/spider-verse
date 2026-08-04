import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';

gsap.registerPlugin(ScrollTrigger);

// Initialize Three.js Scene
const container = document.getElementById('scroll-3d-container');
const canvas = document.getElementById('three-canvas');
const statusHud = document.getElementById('hud-status');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0B0D12, 0.03);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 7);
const redLight = new THREE.PointLight(0xFF1E52, 6, 15);
redLight.position.set(-4, 2, 3);
const cyanLight = new THREE.PointLight(0x00F0FF, 6, 15);
cyanLight.position.set(4, -2, 3);
scene.add(ambientLight, dirLight, redLight, cyanLight);

// Procedural 3D Mesh Fallback
const spiderGroup = new THREE.Group();
scene.add(spiderGroup);

const heroMat = new THREE.MeshStandardMaterial({ color: 0xFF1E52, roughness: 0.3, metalness: 0.7 });
const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x00F0FF, emissiveIntensity: 0.8 });

const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), heroMat);
head.position.y = 1.6;
spiderGroup.add(head);

const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 1.4, 16), heroMat);
torso.position.y = 0.6;
spiderGroup.add(torso);

// 3D Web Lines
const webGroup = new THREE.Group();
scene.add(webGroup);

const webMat = new THREE.LineBasicMaterial({ color: 0x00F0FF });
for (let i = 0; i < 16; i++) {
  const points = [new THREE.Vector3(0, 0.6, 0.5), new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, 8)];
  const webGeo = new THREE.BufferGeometry().setFromPoints(points);
  const webLine = new THREE.Line(webGeo, webMat);
  webLine.scale.set(0.01, 0.01, 0.01);
  webGroup.add(webLine);
}

// GSAP ScrollTrigger Sequence
const st = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: 'top top',
    end: '+=300%',
    scrub: 1,
    pin: true,
    onUpdate: (self) => {
      const p = self.progress;
      if (p < 0.33) statusHud.innerText = `PHASE 1: SUIT-UP SYNCHRONIZATION (${Math.round(p * 300)}%)`;
      else if (p < 0.66) statusHud.innerText = `PHASE 2: WEB-SHOOTER LOCK (${Math.round(p * 100)}%)`;
      else statusHud.innerText = `PHASE 3: KINETIC PUNCH OVERDRIVE (${Math.round(p * 100)}%)`;
    },
  },
});

// Phase 1 (Suit Up)
st.to(spiderGroup.scale, { x: 1, y: 1, z: 1, duration: 1 })
  .to(spiderGroup.rotation, { y: 0, x: 0.1, duration: 1 }, 0);

// Phase 2 (Web Shooting Pose)
st.to(spiderGroup.position, { z: 2, y: -0.2, duration: 1 })
  .to(webGroup.children.map(w => w.scale), { x: 1, y: 1, z: 1, stagger: 0.02, duration: 1 }, '<');

// Phase 3 (Kinetic Punch)
st.to(spiderGroup.position, { z: 3, x: -0.5, duration: 1 })
  .to(camera.position, {
    z: 5,
    duration: 0.8,
    onStart: () => {
      anime({
        targets: camera.position,
        x: [0, 0.3, -0.3, 0.2, -0.2, 0],
        y: [0, -0.2, 0.2, -0.1, 0.1, 0],
        duration: 500,
        easing: 'easeInOutQuad',
      });
    },
  });

// Render Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

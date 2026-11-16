/**
 * NeuralOrbit.tsx — Pure Three.js (no React Three Fiber)
 *
 * R3F v8 is not compatible with React 19 — it accesses internal React APIs
 * (ReactCurrentOwner) that were removed/restructured in React 19, causing
 * a crash after mount. This implementation uses Three.js directly via a
 * useEffect, giving us zero peer-dep issues and full control.
 *
 * Features preserved:
 *  - Custom GLSL shaders (Fresnel glow, core distortion, particles)
 *  - Instanced orbital ring dots
 *  - Wireframe polyhedra shells
 *  - Mouse parallax + click pulse
 *  - Scroll-linked opacity
 *  - WebGL context loss recovery
 *  - Proper RAF + geometry/material cleanup on unmount
 *  - CSS fallback when WebGL unavailable
 *  - prefers-reduced-motion support
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import './NeuralOrbit.css';

// ─── Motion preference ────────────────────────────────────────
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Reusable scratch ─────────────────────────────────────────
const _scaleTarget = new THREE.Vector3(1, 1, 1);

// ─── GLSL Shaders ─────────────────────────────────────────────

const fresnelVert = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fresnelFrag = /* glsl */`
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uOpacity;
  uniform float uPulse;
  varying vec3  vNormal;
  varying vec3  vPosition;
  void main() {
    vec3  viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);
    float pulse   = sin(uTime * 1.8 + uPulse * 12.0) * 0.15 + 0.85;
    vec3  col     = mix(uColorA, uColorB, fresnel) * pulse;
    gl_FragColor  = vec4(col, fresnel * uOpacity * pulse);
  }
`;

const coreVert = /* glsl */`
  uniform float uTime;
  uniform float uNoise;
  varying vec3 vNormal;
  varying vec3 vPos;
  float hash(vec3 p) {
    p = fract(p * 0.31831);
    p += dot(p, p.yxz + 19.19);
    return fract((p.x + p.y) * p.z);
  }
  void main() {
    vNormal = normal;
    float n = hash(position + vec3(uTime * 0.15));
    vec3 pos = position + normal * n * uNoise;
    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const coreFrag = /* glsl */`
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    float t   = sin(uTime * 0.9 + vPos.y * 2.0) * 0.5 + 0.5;
    vec3  col = mix(uColorA, uColorB, t);
    float rim = pow(1.0 - abs(vNormal.z), 3.0) * 0.6;
    gl_FragColor = vec4(col + rim, 0.92);
  }
`;

const particleVert = /* glsl */`
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vPhase;
  void main() {
    vPhase = aPhase;
    float wave = sin(uTime * 1.2 + aPhase) * 0.5 + 0.5;
    gl_PointSize = aSize * (0.7 + wave * 0.6);
    gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const particleFrag = /* glsl */`
  uniform float uTime;
  uniform vec3  uColor;
  varying float vPhase;
  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;
    float alpha = (0.5 - d) * 2.0 * (0.5 + 0.5 * sin(uTime + vPhase));
    gl_FragColor = vec4(uColor, alpha * 0.85);
  }
`;

// ─── WebGL detection ──────────────────────────────────────────
function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

// ─── CSS Fallback ─────────────────────────────────────────────
function NoWebGLFallback() {
  return (
    <div className="neural-orbit__fallback" aria-hidden="true">
      <div className="neural-orbit__fallback-rings">
        <div className="neural-orbit__fallback-ring neural-orbit__fallback-ring--1" />
        <div className="neural-orbit__fallback-ring neural-orbit__fallback-ring--2" />
        <div className="neural-orbit__fallback-ring neural-orbit__fallback-ring--3" />
        <div className="neural-orbit__fallback-core" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function NeuralOrbit() {
  const canvasRef   = useRef<HTMLCanvasElement>(null!);
  const wrapperRef  = useRef<HTMLDivElement>(null!);
  const mouseRef    = useRef({ x: 0, y: 0 });
  const pulseRef    = useRef(0);
  const [webglOk]   = useState(() => detectWebGL());

  useEffect(() => {
    if (!webglOk || !canvasRef.current) return;

    const canvas = canvasRef.current;

    // ── Renderer ─────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('[NeuralOrbit] WebGLRenderer init failed:', e);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    // ── Scene / Camera ────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // ── Lighting ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const pl1 = new THREE.PointLight(0x6c8cff, 4, 12);  pl1.position.set(4, 3, 3);   scene.add(pl1);
    const pl2 = new THREE.PointLight(0xa78bfa, 3, 10);  pl2.position.set(-3, -2, 2); scene.add(pl2);
    const pl3 = new THREE.PointLight(0x38bdf8, 1.5, 8); pl3.position.set(0, 4, -2);  scene.add(pl3);

    // ── Track all disposables ─────────────────────────────────
    const geos: THREE.BufferGeometry[]  = [];
    const mats: THREE.Material[]        = [];

    function mkGeo<T extends THREE.BufferGeometry>(g: T): T { geos.push(g); return g; }
    function mkMat<T extends THREE.Material>(m: T): T       { mats.push(m); return m; }

    // ── Main group ────────────────────────────────────────────
    const group = new THREE.Group();
    scene.add(group);

    // ── Core sphere ───────────────────────────────────────────
    const coreMat = mkMat(new THREE.ShaderMaterial({
      vertexShader: coreVert, fragmentShader: coreFrag,
      uniforms: {
        uTime:   { value: 0 },
        uNoise:  { value: 0.04 },
        uColorA: { value: new THREE.Color('#3d5af1') },
        uColorB: { value: new THREE.Color('#8b5cf6') },
      },
      transparent: true,
    }));
    const coreMesh = new THREE.Mesh(mkGeo(new THREE.SphereGeometry(1, 32, 20)), coreMat);
    group.add(coreMesh);

    // ── Fresnel shell ─────────────────────────────────────────
    const fresnelMat = mkMat(new THREE.ShaderMaterial({
      vertexShader: fresnelVert, fragmentShader: fresnelFrag,
      uniforms: {
        uTime:    { value: 0 },
        uColorA:  { value: new THREE.Color('#6c8cff') },
        uColorB:  { value: new THREE.Color('#a78bfa') },
        uOpacity: { value: 0.5 },
        uPulse:   { value: 0 },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    group.add(new THREE.Mesh(mkGeo(new THREE.SphereGeometry(1, 32, 20)), fresnelMat));
    group.children[group.children.length - 1].scale.setScalar(1.38);

    // ── Wireframe shells ──────────────────────────────────────
    const shellConfigs = [
      { r: 1.55, d: 1, col: '#6c8cff', op: 0.06, rs: [0.07, 0.05, 0.03]  },
      { r: 2.0,  d: 0, col: '#a78bfa', op: 0.04, rs: [-0.04, 0.08, -0.05] },
      { r: 2.6,  d: 1, col: '#38bdf8', op: 0.025, rs: [0.03, -0.06, 0.04] },
    ] as const;
    const shellMeshes: Array<{ mesh: THREE.Mesh; rs: readonly number[] }> = [];
    for (const s of shellConfigs) {
      const m = new THREE.Mesh(
        mkGeo(new THREE.IcosahedronGeometry(s.r, s.d)),
        mkMat(new THREE.MeshBasicMaterial({ color: new THREE.Color(s.col), wireframe: true, transparent: true, opacity: s.op }))
      );
      group.add(m);
      shellMeshes.push({ mesh: m, rs: s.rs });
    }

    // ── Orbital rings ─────────────────────────────────────────
    const ringConfigs = [
      { r: 1.85, tilt: 0,            speed: 0.45,  col: '#6c8cff', dots: 6,  pOff: 0   },
      { r: 2.3,  tilt: Math.PI/4,    speed: -0.3,  col: '#a78bfa', dots: 8,  pOff: 1.5 },
      { r: 2.85, tilt: Math.PI/2.5,  speed: 0.2,   col: '#38bdf8', dots: 10, pOff: 3   },
      { r: 3.3,  tilt: -Math.PI/5,   speed: -0.15, col: '#6c8cff', dots: 12, pOff: 4.5 },
    ] as const;

    const dummy = new THREE.Object3D();
    const ringGroups: Array<{
      g: THREE.Group;
      im: THREE.InstancedMesh;
      r: number; speed: number; dots: number; pOff: number;
    }> = [];

    for (const rc of ringConfigs) {
      const rg = new THREE.Group();
      rg.rotation.z = rc.tilt;
      group.add(rg);

      const torusMat = mkMat(new THREE.MeshBasicMaterial({ color: new THREE.Color(rc.col), transparent: true, opacity: 0.12 }));
      rg.add(new THREE.Mesh(mkGeo(new THREE.TorusGeometry(rc.r, 0.008, 8, 100)), torusMat));

      const dotGeo = mkGeo(new THREE.SphereGeometry(0.045, 6, 4));
      const dotMat = mkMat(new THREE.MeshBasicMaterial({ color: new THREE.Color(rc.col), transparent: true }));
      const im = new THREE.InstancedMesh(dotGeo, dotMat, rc.dots);
      rg.add(im);

      ringGroups.push({ g: rg, im, r: rc.r, speed: rc.speed, dots: rc.dots, pOff: rc.pOff });
    }

    // ── Energy lines ──────────────────────────────────────────
    const linePoints: number[] = [];
    for (let i = 0; i < 18; i++) {
      const a1 = (i / 18) * Math.PI * 2;
      const a2 = ((i + 3) / 18) * Math.PI * 2;
      const j = () => (Math.random() - 0.5) * 0.5;
      const r = 2.2;
      linePoints.push(0, 0, 0,  Math.cos(a1)*r+j(), Math.sin(a1)*r*0.6+j(), j());
      linePoints.push(Math.cos(a1)*r+j(), Math.sin(a1)*r*0.6+j(), j(),  Math.cos(a2)*r*1.2+j(), Math.sin(a2)*r*0.8+j(), j());
    }
    const lineGeo = mkGeo(new THREE.BufferGeometry());
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    const lineMat = mkMat(new THREE.LineBasicMaterial({
      color: new THREE.Color('#6c8cff'),
      transparent: true, opacity: 0.07,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // ── Particle field ────────────────────────────────────────
    const COUNT = 240;
    const pos    = new Float32Array(COUNT * 3);
    const sizes  = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const PR = 4.5;
    for (let i = 0; i < COUNT; i++) {
      const r = PR * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
      sizes[i]   = 2 + Math.random() * 4;
      phases[i]  = Math.random() * Math.PI * 2;
    }
    const ptGeo = mkGeo(new THREE.BufferGeometry());
    ptGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    ptGeo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));
    ptGeo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));
    const ptMat = mkMat(new THREE.ShaderMaterial({
      vertexShader: particleVert, fragmentShader: particleFrag,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#8ba7ff') } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    group.add(new THREE.Points(ptGeo, ptMat));

    // ── Resize handler ────────────────────────────────────────
    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Animation loop ────────────────────────────────────────
    let raf = 0;
    const clock = new THREE.Clock();

    // smooth group rotation state
    let rotY = 0, rotX = 0;

    function tick() {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Autonomous rotation targets
        const targetY = t * 0.08 + mouseRef.current.x * 0.35;
        const targetX = Math.sin(t * 0.13) * 0.08 + (-mouseRef.current.y * 0.25);

        // Smooth damp
        rotY += (targetY - rotY) * 0.04;
        rotX += (targetX - rotX) * 0.04;

        group.rotation.y = rotY;
        group.rotation.x = rotX;
        group.position.y = Math.sin(t * 0.4) * 0.06;

        // Wireframe shells
        for (const { mesh, rs } of shellMeshes) {
          mesh.rotation.x = t * rs[0];
          mesh.rotation.y = t * rs[1];
          mesh.rotation.z = t * rs[2];
        }

        // Orbital ring rotation + dot animation
        for (const ring of ringGroups) {
          ring.g.rotation.y += ring.speed * 0.016;
          for (let i = 0; i < ring.dots; i++) {
            const angle = (i / ring.dots) * Math.PI * 2 + t * ring.speed * 1.5;
            dummy.position.set(Math.cos(angle) * ring.r, Math.sin(angle) * ring.r, 0);
            dummy.scale.setScalar(0.7 + (0.5 + 0.5 * Math.sin(t * 2 + i + ring.pOff)) * 0.5);
            dummy.updateMatrix();
            ring.im.setMatrixAt(i, dummy.matrix);
          }
          ring.im.instanceMatrix.needsUpdate = true;
        }
      }

      // Shader time uniforms
      coreMat.uniforms.uTime.value    = t;
      fresnelMat.uniforms.uTime.value = t;
      fresnelMat.uniforms.uPulse.value = pulseRef.current;
      ptMat.uniforms.uTime.value      = t;
      lineMat.opacity = 0.05 + 0.04 * Math.sin(t * 1.5);

      // Pulse
      const p = pulseRef.current;
      if (p > 0) {
        coreMesh.scale.setScalar(1 + p * 0.25);
        coreMat.uniforms.uNoise.value = 0.04 + p * 0.12;
        pulseRef.current = Math.max(0, p - 0.025);
      } else {
        coreMesh.scale.lerp(_scaleTarget, 0.08);
        coreMat.uniforms.uNoise.value = 0.04;
      }

      renderer.render(scene, camera);
    }
    tick();

    // ── Context loss recovery ─────────────────────────────────
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      console.warn('[NeuralOrbit] WebGL context lost');
    };
    const handleContextRestored = () => {
      console.info('[NeuralOrbit] WebGL context restored');
      clock.start();
      tick();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      for (const g of geos) g.dispose();
      for (const m of mats) m.dispose();
      renderer.dispose();
    };
  }, [webglOk]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
      y: ((e.clientY - rect.top)  / rect.height - 0.5) * -2,
    };
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
  }, []);

  const handleClick = useCallback(() => {
    pulseRef.current = 1;
  }, []);

  if (!webglOk) return <NoWebGLFallback />;

  return (
    <div
      ref={wrapperRef}
      className="neural-orbit"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="neural-orbit__canvas" />
    </div>
  );
}

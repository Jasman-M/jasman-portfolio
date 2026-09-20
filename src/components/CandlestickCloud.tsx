"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ---------------------------------------------------------------
   A candlestick series rendered as a voxel/particle point cloud.
   Bars print off the right edge and drift left; drag to orbit.
----------------------------------------------------------------*/

const SPACING = 0.3;   // distance between candle centres
const BODY_W  = 0.19;  // candle body width
const BODY_D  = 0.19;  // candle body depth
const MIN_BODY = 0.05; // so a doji still reads as a bar
const GRID = 0.017;    // position quantisation -> voxel grain

const THETA = 0.08;    // mean reversion, keeps the walk framed
const SIGMA = 0.5;
const WICK_SIGMA = 0.42;
const Y_SCALE = 1.5;   // price units -> world units

type Candle = { x: number; lo: number; hi: number; bodyLo: number; bodyHi: number; up: boolean };

type Tier = { candles: number; body: number; wick: number; size: number };

const DESKTOP: Tier = { candles: 40, body: 380, wick: 70, size: 0.40 };
const MOBILE: Tier  = { candles: 40, body: 108, wick: 24, size: 0.46 };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function probeWebGL() {
  if (typeof document === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const VERT = /* glsl */ `
  attribute float aUp;
  attribute float aShade;
  uniform float uDrift;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFadeStart;
  uniform float uFadeEnd;
  uniform vec3 uUp;
  uniform vec3 uDown;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    vColor = mix(uDown, uUp, aUp) * aShade;

    // Fade on the series axis (pre-rotation) so bars dissolve at both ends.
    float d = abs(position.x + uDrift);
    vFade = 1.0 - smoothstep(uFadeStart, uFadeEnd, d);

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio * (90.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.12, r);
    if (a < 0.01 || vFade < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vFade * uOpacity);
  }
`;

function readThemeColors() {
  const s = getComputedStyle(document.documentElement);
  const up = s.getPropertyValue("--mesh-up").trim() || "#d97757";
  const down = s.getPropertyValue("--mesh-down").trim() || "#6f6c64";
  return { up: new THREE.Color(up), down: new THREE.Color(down) };
}

export default function CandlestickCloud() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [hint, setHint] = useState(true);
  const [supported, setSupported] = useState(probeWebGL);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supported) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tier: Tier = window.innerWidth < 768 ? MOBILE : DESKTOP;
    const PER = tier.body + tier.wick;
    const TOTAL = tier.candles * PER;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      // The probe passed but context creation still failed — drop to the static panel.
      queueMicrotask(() => setSupported(false));
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === MOBILE ? 1.5 : 2));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.style.cursor = "grab";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.7, 16);
    camera.lookAt(0, 0, 0);

    const pivot = new THREE.Group();
    const drift = new THREE.Group();
    pivot.add(drift);
    scene.add(pivot);

    /* ---- data -------------------------------------------------- */
    const rand = mulberry32(20260220);
    const gauss = () => {
      const u = Math.max(rand(), 1e-6);
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
    };

    let close = 0;
    const nextCandle = (x: number): Candle => {
      const open = close;
      close = open - THETA * open + SIGMA * gauss();
      const bodyLo = Math.min(open, close);
      const bodyHi = Math.max(open, close);
      const pad = Math.max(0, MIN_BODY - (bodyHi - bodyLo)) / 2;
      return {
        x,
        bodyLo: (bodyLo - pad) * Y_SCALE,
        bodyHi: (bodyHi + pad) * Y_SCALE,
        lo: (bodyLo - Math.abs(gauss()) * WICK_SIGMA) * Y_SCALE,
        hi: (bodyHi + Math.abs(gauss()) * WICK_SIGMA) * Y_SCALE,
        up: close >= open,
      };
    };

    const half = (tier.candles - 1) / 2;
    const candles: Candle[] = [];
    for (let i = 0; i < tier.candles; i++) candles.push(nextCandle((i - half) * SPACING));

    /* ---- geometry ---------------------------------------------- */
    const positions = new Float32Array(TOTAL * 3);
    const ups = new Float32Array(TOTAL);
    const shades = new Float32Array(TOTAL);
    const snap = (v: number) => Math.round(v / GRID) * GRID;

    const writeCandle = (slot: number, c: Candle) => {
      let p = slot * PER * 3;
      let a = slot * PER;
      for (let i = 0; i < tier.body; i++) {
        positions[p++] = snap(c.x + (rand() - 0.5) * BODY_W);
        positions[p++] = snap(c.bodyLo + rand() * (c.bodyHi - c.bodyLo));
        positions[p++] = snap((rand() - 0.5) * BODY_D);
        ups[a] = c.up ? 1 : 0;
        shades[a] = 0.78 + rand() * 0.42;
        a++;
      }
      for (let i = 0; i < tier.wick; i++) {
        positions[p++] = snap(c.x + (rand() - 0.5) * 0.035);
        positions[p++] = snap(c.lo + rand() * (c.hi - c.lo));
        positions[p++] = snap((rand() - 0.5) * 0.035);
        ups[a] = c.up ? 1 : 0;
        shades[a] = 0.62 + rand() * 0.34;
        a++;
      }
    };

    candles.forEach((c, i) => writeCandle(i, c));

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aUp", new THREE.BufferAttribute(ups, 1));
    geo.setAttribute("aShade", new THREE.BufferAttribute(shades, 1));

    const halfSpan = (tier.candles * SPACING) / 2;
    const theme = readThemeColors();
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uDrift: { value: 0 },
        uSize: { value: tier.size },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uFadeStart: { value: halfSpan * 0.40 },
        uFadeEnd: { value: halfSpan * 0.95 },
        uUp: { value: theme.up },
        uDown: { value: theme.down },
        uOpacity: { value: 0.88 },
      },
    });

    const points = new THREE.Points(geo, mat);
    drift.add(points);

    /* ---- theme sync -------------------------------------------- */
    const themeObserver = new MutationObserver(() => {
      const next = readThemeColors();
      mat.uniforms.uUp.value = next.up;
      mat.uniforms.uDown.value = next.down;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    /* ---- interaction ------------------------------------------- */
    let rotY = -0.34, rotX = 0.16;
    let velY = 0, velX = 0;
    let dragging = false, lastX = 0, lastY = 0, moved = 0;

    const el = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      dragging = true; moved = 0;
      lastX = e.clientX; lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 8) setHint(false);
      velY = dx * 0.0045;
      velX = dy * 0.0032;
      rotY += velY;
      rotX = Math.max(-0.62, Math.min(0.62, rotX + velX));
      // A horizontal drag on touch is an orbit; let vertical stay a page scroll.
      if (e.pointerType === "touch" && Math.abs(dx) > Math.abs(dy)) e.preventDefault();
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      el.style.cursor = "grab";
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove, { passive: false });
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    /* ---- resize ------------------------------------------------ */
    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      camera.fov = aspect < 1 ? 48 : 38;
      const tan = Math.tan(((camera.fov * Math.PI) / 180) / 2);
      camera.position.z = Math.max(7, Math.min(32, (halfSpan * 0.95) / (tan * aspect)));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      mat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      mat.uniforms.uFadeStart.value = halfSpan * 0.40;
      mat.uniforms.uFadeEnd.value = halfSpan * 0.95;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    /* ---- loop -------------------------------------------------- */
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(host);

    let shift = 0;
    let oldestSlot = 0;
    let rightmost = candles[candles.length - 1].x;
    let raf = 0;
    const start = performance.now();
    let prev = start;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      if (!visible) return;

      if (!reduced) {
        shift -= SPACING * dt * 0.34;          // ~1 new bar every 3s
        while (shift <= -SPACING) {
          shift += SPACING;
          rightmost += SPACING;
          const fresh = nextCandle(rightmost);
          candles[oldestSlot] = fresh;
          writeCandle(oldestSlot, fresh);
          oldestSlot = (oldestSlot + 1) % tier.candles;
          geo.attributes.position.needsUpdate = true;
          geo.attributes.aUp.needsUpdate = true;
          geo.attributes.aShade.needsUpdate = true;
        }
      }

      // Keep the series centred: the visual midpoint of the live window.
      const mid = rightmost - half * SPACING;
      drift.position.x = -mid + shift;
      mat.uniforms.uDrift.value = drift.position.x;

      if (!dragging) {
        rotY += velY;
        rotX = Math.max(-0.62, Math.min(0.62, rotX + velX));
        velY *= 0.94;
        velX *= 0.94;
        if (Math.abs(velY) < 1e-5) velY = 0;
        if (Math.abs(velX) < 1e-5) velX = 0;
      }

      const sway = reduced ? 0 : Math.sin(((now - start) / 1000) * 0.22) * 0.16;
      pivot.rotation.y = rotY + sway;
      pivot.rotation.x = rotX;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    const hintTimer = window.setTimeout(() => setHint(false), 9000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hintTimer);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [supported]);

  if (!supported) {
    return <div className="heroCanvasFallback" aria-hidden="true" />;
  }

  return (
    <div className="heroCanvasWrap">
      <div
        ref={hostRef}
        className="heroCanvas"
        role="img"
        aria-label="An abstract three-dimensional candlestick chart rendered as a cloud of particles. Decorative."
      />
      <span className="heroCanvasHint" data-on={hint ? "true" : "false"} aria-hidden="true">
        drag to rotate
      </span>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * A soft ambient light that trails the cursor. It sits at z-index 0, beneath
 * all content and beneath the hero canvas, so it never washes out the 3D piece.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx;
    let y = ty;
    let raf = 0;
    let awake = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!awake) {
        awake = true;
        el.style.opacity = "1";
      }
    };
    const onLeave = () => {
      el.style.opacity = "0";
      awake = false;
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      x += (tx - x) * 0.38;
      y += (ty - y) * 0.38;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="cursorGlow" aria-hidden="true" />;
}

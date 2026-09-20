"use client";

import { useRef, type ReactNode } from "react";

/**
 * Pulls its child a few pixels toward the cursor on hover. Disabled on
 * coarse pointers and when reduced motion is requested.
 */
export default function Magnetic({
  children,
  strength = 0.28,
  max = 5,
  className,
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const allowed = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || !allowed()) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const cx = Math.max(-max, Math.min(max, dx * strength));
    const cy = Math.max(-max, Math.min(max, dy * strength));
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <span
      ref={ref}
      className={className ? `magnetic ${className}` : "magnetic"}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </span>
  );
}

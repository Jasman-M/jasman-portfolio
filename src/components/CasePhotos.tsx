"use client";

import { useState } from "react";
import Image from "next/image";

type Photo = { src: string; alt: string; caption: string; event: string };

/**
 * The Recognition photo strip. Each photo is monochrome until hovered or
 * opened; clicking one reveals a short caption naming the event it's from.
 * Only one caption is open at a time.
 */
export default function CasePhotos({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div
      className="photoStrip"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(null);
      }}
    >
      {photos.map((p, i) => {
        const isOpen = open === i;
        const captionId = `case-photo-caption-${i}`;
        return (
          <figure className={isOpen ? "photo photoOpen" : "photo"} key={p.src}>
            <button
              type="button"
              className="photoButton"
              aria-expanded={isOpen}
              aria-controls={captionId}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 720px) 80vw, 33vw"
                className="photoImg"
              />
              <span className="photoBadge" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </span>
            </button>
            <figcaption id={captionId} className="photoCaption" aria-hidden={!isOpen}>
              <span className="photoCaptionLine">{p.caption}</span>
              <span className="mono photoCaptionEvent">{p.event}</span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

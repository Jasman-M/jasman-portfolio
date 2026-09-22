"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * A framed poster with a play button. The video element only mounts once the
 * visitor asks for it, so the page doesn't load the MP4 up front.
 */
export default function VideoCard({
  src,
  poster,
  title,
  kind,
  meta,
}: {
  src: string;
  poster: string;
  title: string;
  kind: string;
  meta: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <div className="videoFrame">
        {playing ? (
          <video className="video" controls autoPlay playsInline poster={poster}>
            <source src={src} type="video/mp4" />
            Your browser doesn&rsquo;t support embedded video.{" "}
            <a href={src}>Download the {title} launch video</a>.
          </video>
        ) : (
          <Image
            src={poster}
            alt={`Opening frame of the ${title} launch video.`}
            fill
            sizes="(max-width: 720px) 85vw, 560px"
            className="videoPoster"
          />
        )}
      </div>
      {!playing && (
        <>
          <button
            type="button"
            className="playButton"
            onClick={() => setPlaying(true)}
            aria-label={`Play the ${title} launch video`}
          >
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </button>
          <span className="mono mediaLabel mediaLabelLeft">({kind})</span>
          <span className="mono mediaLabel mediaLabelRight">{meta}</span>
        </>
      )}
    </>
  );
}

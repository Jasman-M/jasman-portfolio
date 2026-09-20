"use client";

import dynamic from "next/dynamic";

const CandlestickCloud = dynamic(() => import("./CandlestickCloud"), {
  ssr: false,
  loading: () => <div className="heroCanvasFallback" aria-hidden="true" />,
});

export default function HeroCanvas() {
  return <CandlestickCloud />;
}

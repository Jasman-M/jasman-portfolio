/**
 * Card art for Gambler's Ruin: sample paths of a simple random walk between a
 * target barrier and a ruin barrier, with one path highlighted as it's absorbed
 * at ruin. Seeded, so every build draws the same picture.
 */

const W = 560;
const H = 420;
const X0 = 40;
const TOP = 70;
const BOTTOM = H - 70;
const START = (TOP + BOTTOM) / 2;
const DX = 8;
const DY = 14;

type Pt = [number, number];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function walk(rand: () => number) {
  const pts: Pt[] = [[X0, START]];
  let x = X0;
  let y = START;
  while (x < W - X0) {
    x += DX;
    y += rand() < 0.5 ? DY : -DY;
    pts.push([x, y]);
    if (y <= TOP) return { pts, ruined: false };
    if (y >= BOTTOM) return { pts, ruined: true };
  }
  return { pts, ruined: false };
}

function samplePaths() {
  const rand = mulberry32(5);
  const others: Pt[][] = [];
  let ruin: Pt[] | null = null;
  while (others.length < 7 || !ruin) {
    const { pts, ruined } = walk(rand);
    const endX = pts[pts.length - 1][0];
    // Highlight a path that's absorbed mid-chart, so the story reads left to right.
    if (!ruin && ruined && endX > 180 && endX < W - 120) ruin = pts;
    else if (others.length < 7) others.push(pts);
  }
  if (!ruin) throw new Error("unreachable: loop exits only once a ruin path is found");
  return { others, ruin };
}

const { others, ruin } = samplePaths();
const toD = (pts: Pt[]) => "M" + pts.map(([x, y]) => `${x} ${y}`).join(" L");
const [endX, endY] = ruin[ruin.length - 1];

export default function RandomWalks() {
  return (
    <svg
      className="walks"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Sample random walks between a target barrier and a ruin barrier; one highlighted path is absorbed at ruin."
    >
      <line className="walksBarrier" x1={X0} y1={TOP} x2={W - X0} y2={TOP} />
      <line className="walksBarrier" x1={X0} y1={BOTTOM} x2={W - X0} y2={BOTTOM} />
      <text className="walksLabel" x={X0} y={TOP - 14}>
        N — target
      </text>
      <text className="walksLabel" x={X0} y={BOTTOM + 26}>
        0 — ruin
      </text>
      {others.map((pts, i) => (
        <path key={i} className="walksPath" d={toD(pts)} />
      ))}
      <path className="walksRuin" d={toD(ruin)} />
      <circle className="walksDot" cx={endX} cy={endY} r={6} />
      <circle className="walksDot" cx={X0} cy={START} r={4} />
    </svg>
  );
}

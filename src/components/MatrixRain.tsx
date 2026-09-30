"use client";

import { useEffect, useRef } from "react";
import { createStream, pickTheme } from "@/lib/rain-streams";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const CELL = 16; // px per glyph cell (font size and column width)
const MAX_COLUMNS = 140; // hard cap so wide/high-DPI screens can't spawn unbounded columns
const FRAME_INTERVAL_MS = 50; // ~20fps: smooth enough, far below display refresh
const BG = "#040605";
const FADE = "rgba(4, 6, 5, 0.045)"; // per-frame fade; lower = longer trails

/**
 * Two depth tiers give the texture parallax instead of a flat wall:
 * most streams sit "far" (dim, slow), a few sit "near" (brighter head,
 * faster). Only near heads glow, so the eye gets a few focal points
 * rather than a field of flicker.
 */
const TIERS = {
  far: { share: 0.72, speed: [0.3, 0.55], head: "#4ade80", trail: "#15803d" },
  near: { share: 0.28, speed: [0.55, 0.9], head: "#dcfce7", trail: "#22c55e" },
} as const;

// Frames a column waits between passes: keeps ~70% of columns active at
// once, so there is always open space and the rain never becomes a wall.
const IDLE_FRAMES: [number, number] = [10, 70];

interface Column {
  row: number; // fractional row of the head
  speed: number; // rows per frame
  tier: keyof typeof TIERS;
  next: () => string; // character source for this pass
  lastRow: number; // row the head last occupied
  lastChar: string; // glyph drawn there (kept when it cools into the trail)
  idle: number; // frames left before (re)spawning
}

const between = ([a, b]: readonly [number, number]) =>
  a + Math.random() * (b - a);

function spawn(col: Column) {
  col.tier = Math.random() < TIERS.far.share ? "far" : "near";
  col.speed = between(TIERS[col.tier].speed);
  col.next = createStream(pickTheme(Math.random), Math.random);
  col.row = 0;
  col.lastRow = -1;
  col.lastChar = " ";
}

/**
 * Background rain built from real terminal tokens (see rain-streams.ts).
 *
 * Each column descends one pass with a single theme; the head glyph is
 * fixed per cell (no per-frame shuffling), and when the head moves on
 * that same glyph cools to the trail color, so trails stay readable as
 * code. Performance: capped column count, DPR capped at 2, manual frame
 * throttle, paused while the tab is hidden. Under prefers-reduced-motion
 * a single still frame is rendered instead of animating.
 */
export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let columns: Column[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${CELL - 2}px "JetBrains Mono Variable", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const count = Math.min(Math.ceil(width / CELL), MAX_COLUMNS);
      columns = Array.from({ length: count }, () => {
        const col = {} as Column;
        spawn(col);
        // Stagger the start so the screen fills in gradually, not in a line.
        col.idle = Math.floor(Math.random() * 90);
        return col;
      });
    }

    function drawCell(x: number, row: number, ch: string, color: string) {
      if (!ctx) return;
      const y = row * CELL;
      ctx.fillStyle = BG;
      ctx.fillRect(x, y, CELL, CELL);
      ctx.fillStyle = color;
      ctx.fillText(ch, x + CELL / 2, y + 1);
    }

    function frame() {
      if (!ctx) return;
      ctx.fillStyle = FADE;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.idle > 0) {
          col.idle--;
          continue;
        }

        const x = i * CELL;
        const tier = TIERS[col.tier];
        const row = Math.floor(col.row);

        if (row !== col.lastRow) {
          // Head moved: cool the old head into the trail, keeping its glyph.
          if (col.lastRow >= 0 && col.lastChar !== " ") {
            drawCell(x, col.lastRow, col.lastChar, tier.trail);
          }
          // Advance the stream by exactly one glyph per row, so tokens
          // spell correctly top-to-bottom.
          col.lastChar = col.next();
          col.lastRow = row;
          if (col.lastChar !== " ") drawCell(x, row, col.lastChar, tier.head);
        }

        col.row += col.speed;
        if (row * CELL > height) {
          spawn(col);
          col.idle = Math.floor(between(IDLE_FRAMES));
        }
      }
    }

    resize();

    if (prefersReducedMotion) {
      const still = () => {
        resize();
        for (let n = 0; n < 220; n++) frame();
      };
      still();
      window.addEventListener("resize", still);
      return () => window.removeEventListener("resize", still);
    }

    window.addEventListener("resize", resize);
    let rafId = 0;
    let last = 0;
    const loop = (time: number) => {
      rafId = requestAnimationFrame(loop);
      if (time - last < FRAME_INTERVAL_MS) return;
      last = time;
      if (document.visibilityState !== "visible") return;
      frame();
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
    />
  );
}

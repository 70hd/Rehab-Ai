// hero.jsx
"use client";

import React, { useEffect, useState } from "react";
import ArrowText from "./arrow-text";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex w-full items-center justify-center">
      {/* relative so ArrowText absolute positions anchor here */}
      <div className="relative w-[606px] flex flex-col gap-3 pb-24 pt-32 text-center">
        {/* Floaty tags */}
        <ArrowText
          text={"1M+ chats completed"}
          direction={-138.93}
          x={600}
          y={325}
          delay={0}
          mounted={mounted}
        />
        <ArrowText
          text={"4.9★ average rating"}
          direction={-31.61}
          x={-200}
          y={200}
          side="right"
          delay={120}
          mounted={mounted}
        />

        {/* Main content slides up */}
        <div
          style={{
            transform: mounted ? "translateY(0px)" : "translateY(18px)",
            opacity: mounted ? 1 : 0,
            transition:
              "transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 800ms ease",
            willChange: "transform, opacity",
          }}
        >
          <h1 className="w-full">Rehab Ai, Feel calmer in minutes.</h1>
          <p className="w-full">
            Talk it out, get grounded, and leave with a clear next step. Rehab
            Ai helps when life feels heavy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
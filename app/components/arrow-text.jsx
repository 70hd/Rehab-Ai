"use client";

import React from "react";
import Arrow from "./arrow";

const ArrowText = ({
  direction = 0,
  text,
  x = 0,
  y = 0,
  side = "left", // "left" | "right"
  mounted = true,
  delay = 0,
}) => {
  const isRight = side === "right";

  return (
    // Outer wrapper ONLY sets absolute position (no transforms here)
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      {/* Inner wrapper animates in without changing left/top anchoring */}
      <div
        className={`flex items-center gap-3  ${
          isRight ? "flex-row-reverse" : "flex-row"
        }`}
        style={{
          transform: mounted ? "translateY(0px)" : "translateY(14px)",
          opacity: mounted ? 1 : 0,
          transition: `transform 900ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 900ms ease ${delay}ms`,
          willChange: "transform, opacity",
        }}
      >
        <Arrow direction={direction} />

     <p
  className="
    whitespace-nowrap
    shrink-0
    rounded-xl px-5 py-1.5 small-text
    bg-[linear-gradient(90deg,rgba(113,154,208,0.10)_0%,rgba(255,255,255,0.10)_100%)]
    backdrop-blur-3xl
    border border-white/10
    text-white
  "
>
  {text}
</p>
      </div>
    </div>
  );
};

export default ArrowText;
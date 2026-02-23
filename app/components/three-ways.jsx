"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

const CARDS = [
  {
    key: "wide",
    title: "Like texting your best friend",
    body: "Say what’s on your mind and get a supportive, real-time response that helps you feel understood and grounded.",
    image: { src: "/Messages.svg", width: 414, height: 842, alt: "Message chat preview" },
    type: "wide",
    imageClass: "absolute top-[0px] right-[-813px] w-[420px] max-w-none",
  },
  {
    key: "halfLeft",
    title: "AI-powered guidance, not generic advice",
    body: "Get clear next steps, reframes, and coping tools tailored to what you’re feeling — in seconds.",
    image: { src: "/ai-graphic.svg", width: 414, height: 842, alt: "AI guidance graphic" },
    type: "half",
    imageClass: "absolute top-[224.46px] right-[-20px] w-[320px] max-w-none",
  },
  {
    key: "halfRight",
    title: "Fast, secure, always available",
    body: "Open the app anytime you need support — built for speed, privacy, and peace of mind.",
    image: { src: "/coding.svg", width: 414, height: 842, alt: "Secure app illustration" },
    type: "half",
    imageClass: "absolute top-[205px] left-[370px] w-[320px] max-w-none",
  },
];

function getNeighborGlow(hovered, target) {
  if (!hovered || hovered === target) return "none";

  // Layout:
  // [ wide spans both ]
  // [ halfLeft | halfRight ]
  if (hovered === "wide") {
    if (target === "halfLeft" || target === "halfRight") return "top";
  }

  if (hovered === "halfLeft") {
    if (target === "wide") return "bl";
    if (target === "halfRight") return "left";
  }

  if (hovered === "halfRight") {
    if (target === "wide") return "br";
    if (target === "halfLeft") return "right";
  }

  return "none";
}

function CardShell({ hovered, neighborDir, children, className = "", onEnter, onLeave }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={[
        "relative overflow-hidden rounded-3xl bg-[#151515] p-6",
        className,
      ].join(" ")}
    >
      {/* Stronger white base stroke */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl card-stroke-base" />

      {/* Blue stroke fully replaces white on hover */}
      <div
        className={[
          "pointer-events-none absolute inset-0 rounded-3xl card-stroke-blue",
          hovered ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* Ambient fill glow (slower animation, light blur) */}
      <div
        className={[
          "pointer-events-none absolute inset-0 rounded-3xl card-glow",
          hovered ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* Neighbor hint = ONLY a little border tint (no blur) */}
      {neighborDir !== "none" && (
        <div
          className={[
            "pointer-events-none absolute inset-0 rounded-3xl card-neighbor-stroke",
            `card-neighbor-stroke--${neighborDir}`,
          ].join(" ")}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function ThreeWays() {
  const [hoveredKey, setHoveredKey] = useState(null);

  const wide = useMemo(() => CARDS.find((c) => c.type === "wide"), []);
  const halves = useMemo(() => CARDS.filter((c) => c.type === "half"), []);

  return (
    <section className="dynamic-padding flex flex-col gap-9">
      <header className="flex flex-col gap-3 py-6 w-[606px]">
        <h1>Three ways Rehab AI supports you</h1>
        <p>
          Text it like a friend, get AI-powered guidance, and rely on a fast,
          secure app built to be there anytime.
        </p>
      </header>

      <div className="flex flex-col gap-9">
        {/* Wide card */}
        <CardShell
          hovered={hoveredKey === wide.key}
          neighborDir={getNeighborGlow(hoveredKey, wide.key)}
          onEnter={() => setHoveredKey(wide.key)}
          onLeave={() => setHoveredKey(null)}
          className="w-full h-[392px] flex justify-between items-start"
        >
          <div className="flex flex-col w-[392px] gap-3">
            <h2>{wide.title}</h2>
            <p>{wide.body}</p>
          </div>

          <Image
            src={wide.image.src}
            width={wide.image.width}
            height={wide.image.height}
            alt={wide.image.alt}
            className={wide.imageClass || ""}
            priority
          />
        </CardShell>

        {/* Two-up row */}
        <div className="flex gap-9 w-full">
          {halves.map((card) => (
            <CardShell
              key={card.key}
              hovered={hoveredKey === card.key}
              neighborDir={getNeighborGlow(hoveredKey, card.key)}
              onEnter={() => setHoveredKey(card.key)}
              onLeave={() => setHoveredKey(null)}
              className="w-full h-[392px] flex justify-between items-start"
            >
              <div className="flex flex-col w-[392px] gap-3">
                <h2>{card.title}</h2>
                <p>{card.body}</p>
              </div>

              <Image
                src={card.image.src}
                width={card.image.width}
                height={card.image.height}
                alt={card.image.alt}
                className={card.imageClass || ""}
              />
            </CardShell>
          ))}
        </div>
      </div>

      <style jsx global>{`
        :root {
          --rehab-blue: #1c88c7;
        }

        /* ===== Masked border helper (stroke-only) ===== */
        .card-stroke-base,
        .card-stroke-blue,
        .card-neighbor-stroke {
          padding: 1px; /* same thickness = perfect replacement */
          border-radius: 24px;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
        }

        /* Stronger white border */
        .card-stroke-base {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.34),
            rgba(255, 255, 255, 0.14),
            rgba(255, 255, 255, 0.26)
          );
          opacity: 1;
        }

        /* Hover border: full blue replacement */
        .card-stroke-blue {
          transition: opacity 420ms ease;
          background: linear-gradient(
              120deg,
              rgba(28, 136, 199, 1),
              rgba(28, 136, 199, 0.28),
              rgba(28, 136, 199, 1)
            ),
            radial-gradient(1200px 380px at 10% 10%, rgba(28, 136, 199, 0.32), transparent 55%);
          background-size: 220% 220%;
          animation: cardStrokeMove 4.8s linear infinite; /* slowed slightly */
          filter: drop-shadow(0 0 16px rgba(28, 136, 199, 0.36));
        }

        @keyframes cardStrokeMove {
          0% {
            background-position: 0% 50%, 0% 0%;
          }
          50% {
            background-position: 100% 50%, 50% 50%;
          }
          100% {
            background-position: 0% 50%, 100% 100%;
          }
        }

        /* ===== Ambient fill (slower) ===== */
        .card-glow {
          transition: opacity 520ms ease;
          background: radial-gradient(
              900px 360px at 20% 20%,
              rgba(28, 136, 199, 0.22),
              transparent 58%
            ),
            radial-gradient(
              900px 360px at 80% 45%,
              rgba(28, 136, 199, 0.16),
              transparent 62%
            );
          background-size: 140% 140%;
          animation: cardGlowDrift 10s ease-in-out infinite; /* slowed down */
          filter: blur(8px); /* keep soft ambient; neighbor has NO blur */
          transform: scale(1.02);
          opacity: 0;
        }

        @keyframes cardGlowDrift {
          0% {
            background-position: 0% 0%, 100% 40%;
          }
          50% {
            background-position: 30% 20%, 70% 60%;
          }
          100% {
            background-position: 0% 0%, 100% 40%;
          }
        }

        /* ===== Neighbor hint = border tint only (no blur) ===== */
        .card-neighbor-stroke {
          opacity: 0.9;
          transition: opacity 250ms ease;
          filter: none; /* important: no blur */
        }

        /* These gradients only lightly tint the closest edge of the BORDER */
        .card-neighbor-stroke--left {
          background: linear-gradient(
            90deg,
            rgba(28, 136, 199, 0.55),
            rgba(28, 136, 199, 0.18) 24%,
            rgba(28, 136, 199, 0) 48%
          );
        }

        .card-neighbor-stroke--right {
          background: linear-gradient(
            270deg,
            rgba(28, 136, 199, 0.55),
            rgba(28, 136, 199, 0.18) 24%,
            rgba(28, 136, 199, 0) 48%
          );
        }

        .card-neighbor-stroke--top {
          background: linear-gradient(
            180deg,
            rgba(28, 136, 199, 0.5),
            rgba(28, 136, 199, 0.16) 26%,
            rgba(28, 136, 199, 0) 52%
          );
        }

        /* Corner hints for the wide card when bottom cards are hovered */
        .card-neighbor-stroke--bl {
          background: radial-gradient(
            420px 260px at 0% 100%,
            rgba(28, 136, 199, 0.55),
            rgba(28, 136, 199, 0.18) 35%,
            rgba(28, 136, 199, 0) 62%
          );
        }

        .card-neighbor-stroke--br {
          background: radial-gradient(
            420px 260px at 100% 100%,
            rgba(28, 136, 199, 0.55),
            rgba(28, 136, 199, 0.18) 35%,
            rgba(28, 136, 199, 0) 62%
          );
        }
      `}</style>
    </section>
  );
}
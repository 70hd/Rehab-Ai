"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Lottie from "lottie-react";
import { cn } from "./cn";
// import Button from "./Button";

export default function FeatureRow({
  reverse,
  imageSrc,
  imageAlt,
  title,
  body,
  cta,
  minititle,
  lottieData, // optional
}) {
  const containerRef = useRef(null);
  const lottieRef = useRef(null);

  const [animData, setAnimData] = useState(lottieData || null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const shouldLoadFromPath = useMemo(() => {
    if (lottieData) return false;
    if (!imageSrc) return false;
    return /\.json(\?.*)?$/i.test(imageSrc);
  }, [imageSrc, lottieData]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!shouldLoadFromPath) return;
      try {
        const res = await fetch(imageSrc);
        const json = await res.json();
        if (!cancelled) setAnimData(json);
      } catch {
        // silent
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [imageSrc, shouldLoadFromPath]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -20% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const inst = lottieRef.current;
    if (!inst || hasPlayed) return;

    if (inView) {
      if (!started) {
        inst.goToAndPlay?.(0, true);
        setStarted(true);
      } else {
        inst.play?.();
      }
    } else {
      if (started) inst.pause?.();
    }
  }, [inView, started, hasPlayed]);

  useEffect(() => {
    const inst = lottieRef.current;
    if (!inst || hasPlayed) return;

    const onComplete = () => {
      setHasPlayed(true);

      const totalFrames = inst.getDuration?.(true);
      const last = Math.max(0, Math.floor((totalFrames ?? 1) - 1));
      inst.goToAndStop?.(last, true);
    };

    inst.addEventListener?.("complete", onComplete);
    return () => inst.removeEventListener?.("complete", onComplete);
  }, [hasPlayed]);

  return (
    <div
      className={cn(
        "flex w-full items-center",
        "flex-col md:flex-row",
        "gap-6 md:gap-9",
        reverse && "md:flex-row-reverse"
      )}
    >
      {/* Media */}
      <div
        ref={containerRef}
        className={cn(
          "w-full md:w-auto",
          "flex justify-center md:justify-start",
          "shrink-0"
        )}
        aria-label={imageAlt}
      >
        <div className="w-full max-w-[606px]">
          {animData ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={animData}
              autoplay={false}
              loop={false}
              // scales to container on all screens
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          ) : (
            // responsive placeholder with the same aspect ratio as 606x341
            <div className="w-full aspect-[606/341]" />
          )}
        </div>
      </div>

      {/* Copy */}
      <div className="w-full flex-1 flex flex-col gap-3">
        <div>
          <p className="small-text  text-[#1A90F2]">{minititle}</p>
          <h2>{title}</h2>
          <p>{body}</p>

          {/* {cta ? (
            <Button variant="link" href={cta.href} className="inline-block py-3 px-0">
              {cta.label}
            </Button>
          ) : null} */}
        </div>
      </div>
    </div>
  );
}


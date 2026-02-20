"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function FlipDigit({ digit }: { digit: string }) {
  const [displayDigit, setDisplayDigit] = useState(digit);
  const container = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (digit !== displayDigit) {
        const tl = gsap.timeline({
          onComplete: () => {
            // 1. Sync React state with the new digit
            setDisplayDigit(digit);
            // 2. IMMEDIATELY reset the flapper position for the next second
            gsap.delayedCall(0.05, () => {
              gsap.set(flipperRef.current, { rotationX: 0 });
            });
          },
        });

        // The Flip animation
        tl.to(flipperRef.current, {
          rotationX: -180,
          duration: 0.6,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [digit], scope: container },
  );

  return (
    <div
      ref={container}
      className="relative w-12 h-20 md:w-20 md:h-32 perspective-1000 select-none"
    >
      {/* 1. TOP STATIC (Shows the NEXT number's top half) */}
      <div className="absolute inset-0 h-1/2 w-full bg-[#1a1a1a] rounded-t-lg overflow-hidden flex items-end justify-center border-b border-black/40">
        <span className="text-white text-5xl md:text-7xl font-bold translate-y-1/2">
          {digit}
        </span>
      </div>

      {/* 2. BOTTOM STATIC (Shows the CURRENT number's bottom half) */}
      <div className="absolute bottom-0 h-1/2 w-full bg-[#121212] rounded-b-lg overflow-hidden flex items-start justify-center">
        <span className="text-white text-5xl md:text-7xl font-bold -translate-y-1/2">
          {displayDigit}
        </span>
      </div>

      {/* 3. THE FLAPPER (The moving part) */}
      <div
        ref={flipperRef}
        className="absolute top-0 left-0 w-full h-1/2 preserve-3d origin-bottom z-20"
      >
        {/* FRONT: Current Top (Visibility hidden when flipped) */}
        <div className="absolute inset-0 bg-[#1a1a1a] rounded-t-lg overflow-hidden flex items-end justify-center backface-hidden border-b border-black/40">
          <span className="text-white text-5xl md:text-7xl font-bold translate-y-1/2">
            {displayDigit}
          </span>
        </div>

        {/* BACK: Next Bottom (Rotated -180 so it's upright when it falls) */}
        <div
          className="absolute inset-0 bg-[#121212] rounded-b-lg overflow-hidden flex items-start justify-center backface-hidden"
          style={{ transform: "rotateX(-180deg)" }}
        >
          <span className="text-white text-5xl md:text-7xl font-bold -translate-y-1/2">
            {digit}
          </span>
        </div>
      </div>

      <div className="absolute top-1/2 left-0 w-full h-px bg-black/50 z-30" />
    </div>
  );
}

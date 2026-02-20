"use client";
import React from "react";
import FlipDigit from "./FlipDigit";

// Define the interface to match your JSX call
interface FlipClockProps {
  dd?: string; // Adding days in case you want them
  hh: string;
  mm: string;
  ss: string;
}

const FlipUnit = ({ value, label }: { value: string; label: string }) => {
  const digits = value.padStart(2, "0").split("");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {digits.map((d, i) => (
          <FlipDigit key={`${label}-${i}`} digit={d} />
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
        {label}
      </span>
    </div>
  );
};

const FlipClock: React.FC<FlipClockProps> = ({ dd, hh, mm, ss }) => {
  return (
    <div className="flex gap-4 md:gap-8">
      {dd && <FlipUnit value={dd} label="Days" />}
      <FlipUnit value={hh} label="Hours" />
      <FlipUnit value={mm} label="Minutes" />
      <FlipUnit value={ss} label="Seconds" />
    </div>
  );
};

export default FlipClock;

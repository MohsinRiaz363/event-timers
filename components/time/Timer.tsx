"use client";
import React from "react";
import FlipDigit from "./FlipDigit";
import { useTimerEngine } from "./timeHooks";
import { formatTimeDisplay } from "./timeUtils";
import { TimerEvent } from "../models/types";

interface TimerTheme {
  "site-1"?: string;
  "site-2"?: string;
  "site-3"?: string;
  "site-4"?: string;
  "site-5"?: string;
}

interface TimerConfig {
  title: string;
  timezone: string;
  backgroundUrl?: string;
  theme?: TimerTheme;
  events: TimerEvent[];
}

interface TimerProps {
  config: TimerConfig;
  serverTimeMs: number;
}

export default function Timer({ config, serverTimeMs }: TimerProps) {
  const { title, timezone, events, theme, backgroundUrl } = config;

  // Use our optimized engine
  const { timeLeft, currentEvent, nextEvent } = useTimerEngine(
    events,
    serverTimeMs,
    timezone,
  );

  // Inject JSON colors into CSS variables for the background gradients
  const dynamicStyles = {
    "--site-1": theme?.["site-1"],
    "--site-2": theme?.["site-2"],
    "--site-3": theme?.["site-3"],
    "--site-4": theme?.["site-4"],
    "--site-5": theme?.["site-5"],
    "--bg-url": backgroundUrl ? `url("${backgroundUrl}")` : undefined,
  } as React.CSSProperties;

  if (!currentEvent) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0a0a0a] text-neutral-500">
        <p>No upcoming events found for this schedule.</p>
      </div>
    );
  }

  const renderUnit = (val: string, label: string) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {val.split("").map((d, i) => (
          // Fixed Key: Position-based to allow FlipDigit to animate prop changes
          <FlipDigit key={`${label}-${i}`} digit={d} />
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black">
        {label}
      </span>
    </div>
  );

  return (
    <div
      style={dynamicStyles}
      className="site-background svg-background w-full flex flex-col items-center justify-center p-6 transition-all duration-1000"
    >
      <div className="flex flex-col items-center gap-10 p-12 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-4xl transition-all">
        {/* Header Section */}
        <div className="text-center text-white">
          <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-3">
            {title}
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {currentEvent.name}
          </h3>
          <p className="text-sm text-neutral-400">
            Ends at:{" "}
            <span className="text-neutral-200">
              {formatTimeDisplay(currentEvent.time)}
            </span>
            <span className="ml-2 opacity-30">({timezone})</span>
          </p>
        </div>

        {/* The Flip Clock Section */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {renderUnit(timeLeft.days, "Days")}
          {renderUnit(timeLeft.hours, "Hours")}
          {renderUnit(timeLeft.minutes, "Minutes")}
          {renderUnit(timeLeft.seconds, "Seconds")}
        </div>

        {/* Footer / Next Event Section */}
        {nextEvent && (
          <div className="w-full pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center px-6 gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-tighter opacity-60">
                Up Next:
              </span>
              <b className="text-neutral-300">{nextEvent.name}</b>
            </div>
            <div className="font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5">
              {formatTimeDisplay(nextEvent.time)}
            </div>
          </div>
        )}
      </div>

      {/*<p className="mt-8 text-[10px] text-white/20 uppercase tracking-[0.5em] font-medium">
        Powered by LoveLetter Timer Engine
      </p>*/}
    </div>
  );
}

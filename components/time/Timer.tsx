"use client";
import React from "react";
import FlipDigit from "./FlipDigit";
import { useTimerEngine } from "./timeHooks";
import { formatTimeDisplay } from "./timeUtils";
import { TimerConfig } from "../models/types";

interface TimerProps {
  config: TimerConfig;
  serverTimeMs: number;
}

export default function Timer({ config, serverTimeMs }: TimerProps) {
  const { title, timezone, events, theme, backgroundUrl, urduMode, grace } =
    config;

  // Pass dynamic grace minutes from JSON (default to 20 if missing)
  const graceMinutes = grace?.minutes || 20;

  const { timeLeft, currentEvent, nextEvent, isGracePeriod } = useTimerEngine(
    events,
    serverTimeMs,
    timezone,
    graceMinutes,
  );

  const dynamicStyles = {
    "--site-1": theme?.["site-1"],
    "--site-2": theme?.["site-2"],
    "--site-3": theme?.["site-3"],
    "--site-4": theme?.["site-4"],
    "--site-5": theme?.["site-5"],
    "--bg-url": backgroundUrl ? `url("${backgroundUrl}")` : undefined,
  } as React.CSSProperties;

  // Helper to get custom messages from JSON
  const getGraceMessage = (name: string) => {
    return grace?.messages?.[name] || `${name} has started.`;
  };

  if (!currentEvent) {
    return (
      <div className="flex w-full items-center justify-center bg-[#0a0a0a] text-neutral-500">
        <p>No upcoming events found for this schedule.</p>
      </div>
    );
  }

  const renderUnit = (val: string, label: string) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1" dir="ltr">
        {" "}
        {/* Digits always stay LTR */}
        {val.split("").map((d, i) => (
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
      className={`site-background svg-background w-full flex flex-col items-center justify-center p-6 transition-all duration-1000 ${
        urduMode ? "urdu-text" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-10 p-12 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-4xl transition-all">
        {/* Header Section */}
        <div className="text-center text-white">
          <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] mb-3">
            {title}
          </h2>
          <h3
            className={`font-bold tracking-tight mb-2 ${urduMode ? "text-5xl md:text-6xl mb-4" : "text-4xl md:text-5xl"}`}
          >
            {currentEvent.name}
          </h3>
          <p className="text-sm text-neutral-400" dir="ltr">
            {isGracePeriod ? "Started at: " : "Ends at: "}
            <span className="text-neutral-200">
              {formatTimeDisplay(currentEvent.time)}
            </span>
            <span className="ml-2 opacity-30">({timezone})</span>
          </p>
        </div>

        {/* Display Area: Grace Message or Timer */}
        <div className="w-full flex justify-center min-h-[160px] items-center">
          {isGracePeriod ? (
            <div className="animate-pulse text-center px-8 py-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 max-w-2xl">
              <p
                className={`text-emerald-400 leading-relaxed ${urduMode ? "text-3xl md:text-4xl py-2" : "text-2xl font-medium"}`}
              >
                {getGraceMessage(currentEvent.name)}
              </p>
              <p
                className="mt-4 text-[10px] uppercase tracking-widest text-emerald-500/40"
                dir="ltr"
              >
                Next update in ~{graceMinutes} mins
              </p>
            </div>
          ) : (
            <div
              className="flex flex-wrap justify-center gap-4 md:gap-8"
              dir="ltr"
            >
              {renderUnit(timeLeft.days, "Days")}
              {renderUnit(timeLeft.hours, "Hours")}
              {renderUnit(timeLeft.minutes, "Minutes")}
              {renderUnit(timeLeft.seconds, "Seconds")}
            </div>
          )}
        </div>

        {/* Next Event Footer */}
        {nextEvent && (
          <div
            className={`w-full pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center px-6 gap-4 text-sm text-neutral-500 ${urduMode ? "flex-row-reverse" : ""}`}
          >
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-tighter opacity-60">
                {urduMode ? ":اگلا ایونٹ" : "Up Next:"}
              </span>
              <b className="text-neutral-300">{nextEvent.name}</b>
            </div>
            <div
              className="font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5"
              dir="ltr"
            >
              {formatTimeDisplay(nextEvent.time)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

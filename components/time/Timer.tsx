"use client";
import React, { useEffect } from "react";
import FlipDigit from "./FlipDigit";
import { useTimerEngine } from "./timeHooks";
import { formatTimeDisplay } from "./timeUtils";
import { TimerConfig } from "../models/types";
import { useAppStore } from "@/store/useAppStore";

interface TimerProps {
  config: TimerConfig;
  serverTimeMs: number;
}

export default function Timer({ config, serverTimeMs }: TimerProps) {
  const { title, timezone, events, theme, backgroundUrl, urduMode, grace } =
    config;

  const setSiteTitle = useAppStore((state) => state.setSiteTitle);
  const setUrduMode = useAppStore((state) => state.setUrduMode);
  const setActiveEventId = useAppStore((state) => state.setActiveEventId);

  const graceMinutes = grace?.minutes || 20;
  const { timeLeft, currentEvent, nextEvent, isGracePeriod } = useTimerEngine(
    events,
    serverTimeMs,
    timezone,
    graceMinutes,
  );

  const isUrduActive = urduMode || config.mode === "ur";

  useEffect(() => {
    if (config.siteTitle) setSiteTitle(config.siteTitle);
    setUrduMode(!!isUrduActive);

    // Sync active ID to store for the EventList to use
    if (currentEvent?.id) {
      setActiveEventId(currentEvent.id);
    }

    const root = document.documentElement;
    if (theme) {
      Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value as string);
      });
      root.style.setProperty("--accent", theme["site-1"] || "#10b981");
    }

    if (backgroundUrl)
      root.style.setProperty("--bg-url", `url("${backgroundUrl}")`);

    return () => {
      ["1", "2", "3", "4", "5"].forEach((n) =>
        root.style.removeProperty(`--site-${n}`),
      );
      root.style.removeProperty("--bg-url");
      root.style.removeProperty("--accent");
    };
  }, [
    theme,
    backgroundUrl,
    config.siteTitle,
    isUrduActive,
    setSiteTitle,
    setUrduMode,
    currentEvent?.id,
    setActiveEventId,
  ]);

  const getGraceMessage = (name: string) =>
    grace?.messages?.[name] || `${name} has started.`;

  if (!currentEvent) return null;

  const renderUnit = (val: string, label: string) => (
    <div className="flex flex-col items-center">
      <div
        className="flex gap-0.5 sm:gap-1 scale-[0.85] xs:scale-100 origin-center"
        dir="ltr"
      >
        {val.split("").map((d, i) => (
          <FlipDigit key={`${label}-${i}`} digit={d} />
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black mt-3">
        {label}
      </span>
    </div>
  );

  return (
    <div
      className={`site-background svg-background w-full flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-1000 ${isUrduActive ? "urdu-text" : ""}`}
    >
      <div className="flex flex-col items-center gap-8 sm:gap-10 p-6 sm:p-12 bg-black/40 backdrop-blur-3xl rounded-bl-4xl sm:rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-360 transition-all overflow-hidden">
        {/* Header */}
        <div className="text-center text-white">
          <h2 className="text-[10px] sm:text-sm md:text-lg font-black text-(--site-4) uppercase tracking-[0.3em] mb-3 opacity-80">
            {title}
          </h2>
          <h3
            className={`font-bold tracking-tight mb-2 ${isUrduActive ? "text-5xl sm:text-6xl py-4" : "text-4xl sm:text-5xl"}`}
          >
            {currentEvent.name}
          </h3>
          <p className="text-lg text-(--site-4)" dir="ltr">
            {isGracePeriod ? "Started at: " : "Ends at: "}
            <span className="text-neutral-200">
              {formatTimeDisplay(currentEvent.time)}
            </span>
            <span className="ml-2 text-(--site-4) opacity-70">
              ({timezone})
            </span>
          </p>
        </div>

        {/* The Clock Section */}
        <div className="w-full flex justify-center items-center">
          {isGracePeriod ? (
            /* FIXED: Corrected the brackets for the variables here */
            <div className="animate-pulse text-center px-4 py-6 rounded-2xl bg-(--accent)/5 border border-(--accent)/20 w-full max-w-2xl">
              <p
                className={`text-(--accent) leading-relaxed ${isUrduActive ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl font-medium"}`}
              >
                {getGraceMessage(currentEvent.name)}
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-y-10 place-items-center"
              dir="ltr"
            >
              {renderUnit(timeLeft.days, "Days")}
              {renderUnit(timeLeft.hours, "Hours")}
              {renderUnit(timeLeft.minutes, isUrduActive ? "Minutes" : "Mins")}
              {renderUnit(timeLeft.seconds, isUrduActive ? "Seconds" : "Secs")}
            </div>
          )}
        </div>

        {/* Footer */}
        {nextEvent && (
          <div
            className={`w-full pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center px-2 sm:px-6 gap-6 text-[11px] sm:text-sm text-neutral-500 ${isUrduActive ? "sm:flex-row-reverse" : ""}`}
          >
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-tighter text-(--site-4)">
                {isUrduActive ? "آگے:" : "Up Next:"}
              </span>
              <b className="text-neutral-300">{nextEvent.name}</b>
            </div>
            <div
              className="font-mono bg-white/5 text-white px-4 py-1.5 rounded-full border border-white/10"
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

"use client";
import { useState, useEffect, useMemo } from "react";
import { TimerEvent, ProcessedEvent, TimeLeft } from "../models/types";

const getUtcTimestamp = (dateStr: string, timeZone: string): number => {
  const date = new Date(dateStr.replace(" ", "T"));
  return new Date(date.toLocaleString("en-US", { timeZone })).getTime();
};

export const useTimerEngine = (
  events: TimerEvent[],
  serverTimeMs: number,
  timeZone: string = "UTC",
) => {
  const [nowMs, setNowMs] = useState<number>(serverTimeMs);

  useEffect(() => {
    const timer = setInterval(() => setNowMs((prev) => prev + 1000), 1000);
    return () => clearInterval(timer);
  }, []);

  const minuteStamp = Math.floor(nowMs / 60000);

  // Explicitly type the return as ProcessedEvent or null
  const { currentEvent, nextEvent } = useMemo(() => {
    const referenceTime = minuteStamp * 60000;

    const sorted: ProcessedEvent[] = events
      .map((e) => ({
        ...e,
        ts: getUtcTimestamp(e.time, timeZone),
      }))
      .filter((e) => e.ts > referenceTime)
      .sort((a, b) => a.ts - b.ts);

    return {
      currentEvent: sorted[0] || null,
      nextEvent: sorted[1] || null,
    };
  }, [events, minuteStamp, timeZone]);

  const timeLeft: TimeLeft = useMemo(() => {
    // No more 'any' needed here
    if (!currentEvent) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const diff = Math.max(0, currentEvent.ts - nowMs);

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24))
        .toString()
        .padStart(2, "0"),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24)
        .toString()
        .padStart(2, "0"),
      minutes: Math.floor((diff / 1000 / 60) % 60)
        .toString()
        .padStart(2, "0"),
      seconds: Math.floor((diff / 1000) % 60)
        .toString()
        .padStart(2, "0"),
    };
  }, [currentEvent, nowMs]);

  return { timeLeft, currentEvent, nextEvent, nowMs };
};

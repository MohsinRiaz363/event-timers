"use client";
import { useState, useEffect, useMemo } from "react";
import { TimerEvent, ProcessedEvent, TimeLeft } from "../models/types";

const getUtcTimestamp = (dateStr: string, timeZone: string): number => {
  // Handle the space to T conversion for Safari/Mobile compatibility
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

  // We use minuteStamp to prevent the heavy 'filter/sort' from running every second.
  const minuteStamp = Math.floor(nowMs / 60000);

  const { currentEvent, nextEvent } = useMemo(() => {
    // 20 minute buffer in milliseconds
    const BUFFER_MS = 20 * 60 * 1000;

    // The trick: We look for events that are still "upcoming" relative to 20 mins ago
    const referenceTimeWithDelay = minuteStamp * 60000 - BUFFER_MS;

    const sorted: ProcessedEvent[] = events
      .map((e) => ({
        ...e,
        ts: getUtcTimestamp(e.time, timeZone),
      }))
      // Keep event until it is older than the current time MINUS 20 minutes
      .filter((e) => e.ts > referenceTimeWithDelay)
      .sort((a, b) => a.ts - b.ts);

    return {
      currentEvent: sorted[0] || null,
      nextEvent: sorted[1] || null,
    };
  }, [events, minuteStamp, timeZone]);

  const timeLeft: TimeLeft = useMemo(() => {
    if (!currentEvent) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    // Math.max(0, ...) ensures that once the time hits 0, it stays at 0
    // for the remainder of the 20-minute delay window.
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

  const isGracePeriod = useMemo(() => {
    if (!currentEvent) return false;
    return nowMs >= currentEvent.ts;
  }, [currentEvent, nowMs]);

  return { timeLeft, currentEvent, nextEvent, nowMs, isGracePeriod };
};

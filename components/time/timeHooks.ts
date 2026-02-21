"use client";
import { useState, useEffect, useMemo } from "react";
import { TimerEvent, ProcessedEvent, TimeLeft } from "../models/types";

const getUtcTimestamp = (dateStr: string, timeZone: string): number => {
  // Compatibility fix: replaces space with 'T' for ISO parsing
  const date = new Date(dateStr.replace(" ", "T"));
  return new Date(date.toLocaleString("en-US", { timeZone })).getTime();
};

export const useTimerEngine = (
  events: TimerEvent[],
  serverTimeMs: number,
  timeZone: string = "UTC",
  graceMinutes: number = 20, // Added dynamic grace period
) => {
  const [nowMs, setNowMs] = useState<number>(serverTimeMs);

  useEffect(() => {
    const timer = setInterval(() => setNowMs((prev) => prev + 1000), 1000);
    return () => clearInterval(timer);
  }, []);

  // Use minuteStamp to optimize useMemo; calculations only run once per minute
  const minuteStamp = Math.floor(nowMs / 60000);

  const { currentEvent, nextEvent } = useMemo(() => {
    const BUFFER_MS = graceMinutes * 60 * 1000;

    // We look for events that are "ahead" of (Current Time - Buffer)
    // This keeps the event in the 'sorted[0]' slot for the duration of the grace period.
    const referenceTimeWithDelay = minuteStamp * 60000 - BUFFER_MS;

    const sorted: ProcessedEvent[] = events
      .map((e) => ({
        ...e,
        ts: getUtcTimestamp(e.time, timeZone),
      }))
      .filter((e) => e.ts > referenceTimeWithDelay)
      .sort((a, b) => a.ts - b.ts);

    return {
      currentEvent: sorted[0] || null,
      nextEvent: sorted[1] || null,
    };
  }, [events, minuteStamp, timeZone, graceMinutes]);

  const isGracePeriod = useMemo(() => {
    if (!currentEvent) return false;
    // It's a grace period if the current time has passed the event's timestamp
    return nowMs >= currentEvent.ts;
  }, [currentEvent, nowMs]);

  const timeLeft: TimeLeft = useMemo(() => {
    if (!currentEvent) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    // Math.max(0, ...) keeps the timer at 00:00:00 during the grace period
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

  return { timeLeft, currentEvent, nextEvent, nowMs, isGracePeriod };
};

// Restored useNow to prevent build errors in components like SystemClock
export const useNow = (serverTimeMs: number) => {
  const [nowMs, setNowMs] = useState<number>(serverTimeMs);

  useEffect(() => {
    const timer = setInterval(() => setNowMs((prev) => prev + 1000), 1000);
    return () => clearInterval(timer);
  }, []);

  return nowMs;
};

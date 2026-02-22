"use client";
import React from "react";
import { formatTimeDisplay } from "@/components/time/timeUtils";

interface EventRowProps {
  dayNumber: string;
  leftEvent: { name: string; time: string; id: string };
  rightEvent?: { name: string; time: string; id: string };
  isActive: boolean;
  isUrdu: boolean | undefined;
}

export default function EventRowItem({
  dayNumber,
  leftEvent,
  rightEvent,
  isActive,
  isUrdu,
}: EventRowProps) {
  const formatDateLabel = (isoString: string) => {
    const date = new Date(isoString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return { month, day };
  };

  const { month, day } = formatDateLabel(leftEvent.time);

  return (
    <div
      className={`
        relative flex flex-col p-4 rounded-3xl transition-all duration-500 border
        ${
          isActive
            ? "bg-(--site-4)/15 border-(--site-4) shadow-[0_0_30px_rgba(var(--site-4-rgb),0.2)] scale-[1.05] z-10"
            : "bg-black/20 border-white/10 hover:border-white/30"
        }
      `}
    >
      {/* HEADER: Day & Date side-by-side */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <div
          className={`flex items-center justify-center h-10 px-5 rounded-lg font-black text-sm xl:text-lg
          ${isActive ? "bg-(--site-4) text-(--site-5)" : "bg-(--site-5) text-white"}`}
        >
          {dayNumber}
        </div>
        <div
          className={`font-mono font-bold text-lg ${isActive ? "text-(--site-4)" : "text-white"}`}
        >
          {month} {day}
        </div>
      </div>

      {/* BODY: Events List */}
      <div className="flex flex-col gap-4">
        {/* Left Event (e.g. Sehr) */}
        <div className="flex flex-col">
          <span
            className={`text-[10px] uppercase tracking-widest font-black mb-1
            ${isActive ? "text-(--site-4)" : "text-white"}`}
          >
            {leftEvent.name}
          </span>
          <span
            className={`text-2xl font-mono leading-none ${isActive ? "text-white" : "text-neutral-300"}`}
          >
            {formatTimeDisplay(leftEvent.time)}
          </span>
        </div>

        {/* Divider if rightEvent exists */}
        {rightEvent && <div className="h-px w-full bg-white/5" />}

        {/* Right Event (e.g. Iftar) */}
        {rightEvent && (
          <div className="flex flex-col">
            <span
              className={`text-[10px] uppercase tracking-widest font-black mb-1
              ${isActive ? "text-(--site-4)" : "text-white"}`}
            >
              {rightEvent.name}
            </span>
            <span
              className={`text-2xl font-mono leading-none ${isActive ? "text-white" : "text-neutral-300"}`}
            >
              {formatTimeDisplay(rightEvent.time)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { forwardRef } from "react";
import { formatTimeDisplay } from "@/components/time/timeUtils";

interface EventRowProps {
  dayNumber: string;
  leftEvent: { name: string; time: string; id: string };
  rightEvent?: { name: string; time: string; id: string };
  isActive: boolean;
  isUrdu: boolean | undefined;
  dayTitle: string | undefined;
}

const EventRowItem = forwardRef<HTMLDivElement, EventRowProps>(
  ({ dayNumber, leftEvent, rightEvent, isActive, isUrdu, dayTitle }, ref) => {
    const formatDateData = (isoString: string) => {
      const date = new Date(isoString);
      const month = date.toLocaleString(isUrdu ? "ur-PK" : "default", {
        month: "short",
      });
      const day = date.getDate();
      return { month, day };
    };

    const { month, day } = formatDateData(leftEvent.time);

    return (
      <div
        ref={ref}
        style={{
          // Direct variable injection for better compatibility
          backgroundColor: isActive
            ? "var(--site-4-transparent, rgba(var(--site-4-rgb), 0.15))"
            : "",
          borderColor: isActive ? "var(--site-4)" : "",
        }}
        className={`relative flex flex-col p-5 rounded-4xl border transition-all duration-500 scroll-mt-10
        ${
          isActive
            ? "z-10 scale-[1.02] opacity-100 shadow-[0_0_30px_rgba(var(--site-4-rgb),0.3)]"
            : "bg-black/20 border-white/10 opacity-50 hover:opacity-100 hover:border-white/20"
        }`}
      >
        <div
          className={`flex items-center justify-between mb-4 ${isUrdu ? "flex-row-reverse" : ""}`}
        >
          <div className="flex items-center gap-x-2 justify-center h-10 px-4 rounded-xl font-black text-sm bg-(--site-5) text-white shadow-lg">
            <span>{dayTitle}</span> <span>{dayNumber}</span>
          </div>

          <div
            className={`font-bold flex gap-x-2 text-lg transition-colors duration-500`}
            style={{ color: isActive ? "var(--site-4)" : "white" }}
          >
            <span>{day}</span> <span>{month}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span
              className="text-[10px] uppercase tracking-widest mb-1 opacity-60"
              style={{ color: isActive ? "var(--site-4)" : "white" }}
            >
              {leftEvent.name}
            </span>
            <span className="text-2xl font-mono text-white leading-none">
              {formatTimeDisplay(leftEvent.time)}
            </span>
          </div>

          {rightEvent && (
            <div
              className="flex flex-col pt-3 border-t transition-colors"
              style={{
                borderTopColor: isActive
                  ? "rgba(var(--site-4-rgb), 0.2)"
                  : "rgba(255,255,255,0.05)",
              }}
            >
              <span
                className="text-[10px] uppercase tracking-widest mb-1 opacity-60"
                style={{ color: isActive ? "var(--site-4)" : "white" }}
              >
                {rightEvent.name}
              </span>
              <span className="text-2xl font-mono text-white leading-none">
                {formatTimeDisplay(rightEvent.time)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

EventRowItem.displayName = "EventRowItem";
export default EventRowItem;

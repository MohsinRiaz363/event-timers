"use client";
import React, { useEffect, useRef, useMemo } from "react";
import EventRowItem from "./EventRowItem";
import { TimerConfig } from "../models/types";
import { useAppStore } from "@/store/useAppStore";

export default function EventList({ config }: { config: TimerConfig }) {
  const { events, urduMode, siteTitle, dayTitle } = config;
  const isUrdu = urduMode;
  const activeEventId = useAppStore((state) => state.activeEventId);

  const gridRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const groupedEvents = useMemo(() => {
    return events.reduce((acc: any, curr: any) => {
      const groupId = curr.id.split("-")[0];
      if (!acc[groupId]) acc[groupId] = [];
      acc[groupId].push(curr);
      return acc;
    }, {});
  }, [events]);

  useEffect(() => {
    const scrollActiveIntoView = () => {
      if (activeRef.current && gridRef.current) {
        // OffsetTop is relative to the grid container
        const cardTop = activeRef.current.offsetTop;

        gridRef.current.scrollTo({
          top: cardTop - 20, // Clean scroll to card
          behavior: "smooth",
        });
      }
    };

    // Delay slightly to ensure layout is painted
    const timer = setTimeout(scrollActiveIntoView, 200);
    return () => clearTimeout(timer);
  }, [activeEventId]); // Trigger when active event changes

  return (
    <div
      className={`w-full flex flex-col items-center p-4 sm:p-6 ${isUrdu ? "urdu-text" : ""}`}
    >
      <div className="flex flex-col gap-10 w-full max-w-7xl p-8 sm:p-12 bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <header className="flex flex-col gap-2 border-b border-white/5 pb-8">
          <h2 className="text-site-4 text-3xl sm:text-5xl font-black uppercase tracking-[0.3em]">
            {isUrdu ? `${siteTitle} کیلنڈر` : `${siteTitle} Calendar`}
          </h2>
          <p className="text-teal-400 text-lg tracking-[0.2em] opacity-80">
            {Object.keys(groupedEvents).length}{" "}
            {isUrdu ? "دن" : "Days Scheduled"}
          </p>
        </header>

        {/* Container MUST be relative for offsetTop logic to work
            and MUST have height + overflow-y-auto
        */}
        <div
          ref={gridRef}
          className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-2 overflow-y-auto max-h-[80vh] scroll-smooth custom-scrollbar"
        >
          {Object.keys(groupedEvents).map((dayNum) => {
            const dayData = groupedEvents[dayNum];
            const isActive = dayData.some((e: any) => e.id === activeEventId);
            const today = new Date().toISOString().split("T")[0];
            const isActuallyToday = dayData.some((e: any) =>
              e.time.startsWith(today),
            );

            return (
              <EventRowItem
                key={dayNum}
                ref={isActive ? activeRef : null}
                dayNumber={dayNum}
                leftEvent={dayData[0]}
                rightEvent={dayData[1]}
                isActive={isActuallyToday}
                isUrdu={isUrdu}
                dayTitle={dayTitle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

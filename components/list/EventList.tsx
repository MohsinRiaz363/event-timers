"use client";
import React from "react";
import EventRowItem from "./EventRowItem";
import { TimerConfig } from "../models/types";
import { useAppStore } from "@/store/useAppStore";

export default function EventList({ config }: { config: TimerConfig }) {
  const { events, urduMode, siteTitle } = config;
  const isUrdu = urduMode;
  const activeEventId = useAppStore((state) => state.activeEventId);

  const groupedEvents = events.reduce((acc: any, curr: any) => {
    const groupId = curr.id.split("-")[0];
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(curr);
    return acc;
  }, {});

  return (
    <div
      className={`w-full flex flex-col items-center p-4 sm:p-6 ${isUrdu ? "urdu-text" : ""}`}
    >
      <div className="flex flex-col gap-10 w-full max-w-360 p-8 sm:p-12 bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
        <header className="flex flex-col gap-2 border-b border-white/5 pb-8">
          <h2 className="text-(--site-4) text-3xl sm:text-5xl font-black uppercase tracking-[0.3em]">
            {isUrdu ? `${siteTitle} کیلنڈر` : `${siteTitle} Calendar`}
          </h2>
          <p className="text-teal-400 text-lg tracking-[0.2em]">
            {Object.keys(groupedEvents).length}{" "}
            {isUrdu ? "دن" : "Days Scheduled"}
          </p>
        </header>

        {/* The Grid: 5 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 custom-scrollbar p-2">
          {Object.keys(groupedEvents).map((dayNum) => {
            const dayData = groupedEvents[dayNum];
            const isActive = dayData.some((e: any) => e.id === activeEventId);

            return (
              <EventRowItem
                key={dayNum}
                dayNumber={dayNum}
                leftEvent={dayData[0]}
                rightEvent={dayData[1]}
                isActive={isActive}
                isUrdu={isUrdu}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

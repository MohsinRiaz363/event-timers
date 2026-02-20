"use client";

import { useMemo } from "react";
import { useNow } from "./timeHooks";
import { getTimeZoneLabel } from "./timeUtils";
import FlipClock from "./FlipClock";

type Props = {
  title?: string;
  tickMs?: number;
  className?: string;
};

export default function SystemClock({
  title = "Local Time",
  tickMs = 1000,
  className = "",
}: Props) {
  const nowMs = useNow(tickMs);

  const { hh, mm, ss } = useMemo(() => {
    const d = new Date(nowMs);
    return {
      hh: String(d.getHours()).padStart(2, "0"),
      mm: String(d.getMinutes()).padStart(2, "0"),
      ss: String(d.getSeconds()).padStart(2, "0"),
    };
  }, [nowMs]);

  const tz = useMemo(() => getTimeZoneLabel(new Date(nowMs)), [nowMs]);

  return (
    <section
      className={[
        "w-full rounded-2xl bg-black/35 backdrop-blur-xl ring-1 ring-white/10",
        "p-6 text-white shadow-2xl",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <div className="text-sm font-medium text-white/80">{tz}</div>
      </div>

      <div className="mt-5 flex justify-center">
        <div className="scale-[0.95] sm:scale-100 origin-top">
          <FlipClock hh={hh} mm={mm} ss={ss} />
        </div>
      </div>
    </section>
  );
}

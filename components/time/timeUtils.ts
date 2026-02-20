export const formatTimeDisplay = (dateStr: string): string => {
  const date = new Date(dateStr.replace(" ", "T"));
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Updated in timeUtils.ts
export const formatEventTime = (dateStr: string, timezone: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(new Date(dateStr.replace(" ", "T")));
};

export const formatToTwoDigits = (num: number): string[] => {
  return num.toString().padStart(2, "0").split("");
};

export const formatReadableTime = (dateStr: string) => {
  const date = new Date(dateStr.replace(" ", "T"));
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getTimeRemaining = (targetDate: string) => {
  // Replace space with T to ensure cross-browser compatibility for local time
  const target = new Date(targetDate.replace(" ", "T")).getTime();
  const now = new Date().getTime();
  const total = target - now;

  return {
    total,
    days: Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((total / 1000 / 60) % 60)),
    seconds: Math.max(0, Math.floor((total / 1000) % 60)),
  };
};

export interface TimerEvent {
  id: string;
  name: string;
  time: string; // Format: "YYYY-MM-DD HH:mm"
}

export interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export interface ProcessedEvent extends TimerEvent {
  ts: number;
}

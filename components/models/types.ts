export interface TimerEvent {
  id: string;
  name: string;
  time: string;
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

export interface TimerConfig {
  title: string;
  timezone: string;
  urduMode?: boolean; // Add this
  backgroundUrl?: string;
  theme?: any;
  grace?: {
    minutes: number;
    messages: Record<string, string>;
  };
  events: TimerEvent[];
}

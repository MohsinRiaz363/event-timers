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
  mode: string;
  siteTitle: string;
  title: string;
  dayTitle?: string;
  timezone: string;
  urduMode?: boolean;
  backgroundUrl?: string;
  theme?: any;
  grace?: {
    minutes: number;
    messages: Record<string, string>;
  };
  events: TimerEvent[];
}

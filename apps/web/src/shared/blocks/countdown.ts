export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const FINISHED: CountdownParts = { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };

/**
 * The parts are read off the difference between two absolute instants, so a visitor's timezone never
 * moves the target: an ISO string carries its own offset and `Date.parse` resolves it to one instant.
 * A target that is not a date has nothing to count down to, so it is finished rather than a crash.
 */
export function countdownParts(targetIso: string, now: Date): CountdownParts {
  const remaining = Date.parse(targetIso) - now.getTime();
  if (Number.isNaN(remaining) || remaining <= 0) return { ...FINISHED };

  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    /* Whole seconds only: the last fraction of a second before the target shows 0, never 1. */
    seconds: Math.floor((remaining % MINUTE) / SECOND),
    finished: false,
  };
}

/**
 * The parts as the one line a screen reader reads instead of four stray numbers: `5d 02:03:04`, or
 * `02:03:04` while there are no days. The visible grid splits the same parts into boxes.
 */
export function formatCountdown(parts: CountdownParts): string {
  const clock = [parts.hours, parts.minutes, parts.seconds].map((part) => String(part).padStart(2, "0")).join(":");
  return parts.days > 0 ? `${parts.days}d ${clock}` : clock;
}

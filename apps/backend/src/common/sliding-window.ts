import { TooManyRequestsException } from "./too-many-requests.exception";

/** Every window in this app measures one minute. */
const windowMs = 60_000;

export interface SlidingWindowLimits {
  /** How many requests one key may make in a window. */
  perKey: number;
  /** How many requests every key in one scope may make together in a window. */
  perScope: number;
}

export interface WindowMessages {
  /** Said when the key's own window is full. */
  key: string;
  /** Said when the scope's window is full, whichever key asked. */
  scope: string;
}

/**
 * A sliding window counted on two keys at once: the request's own key (one block) and the scope it belongs
 * to (one page). The scope ceiling is what stops a page from multiplying its budget by its block count — a
 * public write is limited per block so one busy block cannot silence the rest of the page, and per page so
 * the rest of the page cannot add up to an unbounded stream.
 *
 * It runs to completion without awaiting anything, so two requests arriving in the same tick cannot both
 * read a count below a limit and overrun it. The keys are content, never a caller: this app stores nothing
 * that identifies a visitor, so there is no per-visitor key to spend a window on.
 *
 * Nothing here is content-bounded any more, so the window sweeps itself: a key whose timestamps have all
 * aged out is dropped on the next `admit()`. Without that, every key ever seen would stay for the life of
 * the process. The sweep is the only place the maps shrink, and it costs one pass over them per request —
 * affordable at the size this app reaches, and the price of not leaking.
 */
export class SlidingWindow {
  private readonly keys = new Map<string, number[]>();
  private readonly scopes = new Map<string, number[]>();

  constructor(private readonly limits: SlidingWindowLimits) {}

  /**
   * Counts one request against both windows, or throws before counting: a refused request must not spend a
   * slot another one could have used. The messages belong to the caller, which owns the copy a visitor reads.
   */
  admit(scope: string, key: string, messages: WindowMessages): void {
    const now = Date.now();

    this.sweep(now);

    const keyTimes = this.recent(this.keys, key, now);
    const scopeTimes = this.recent(this.scopes, scope, now);

    if (keyTimes.length >= this.limits.perKey) throw new TooManyRequestsException(messages.key);
    if (scopeTimes.length >= this.limits.perScope) throw new TooManyRequestsException(messages.scope);

    keyTimes.push(now);
    scopeTimes.push(now);
    this.keys.set(key, keyTimes);
    this.scopes.set(scope, scopeTimes);
  }

  /** The timestamps still inside the window; an entry whose timestamps have all aged out is replaced. */
  private recent(map: Map<string, number[]>, key: string, now: number) {
    return (map.get(key) ?? []).filter((at) => at > now - windowMs);
  }

  /** Drops every entry no future request could be counted against, keys and scopes alike. */
  private sweep(now: number): void {
    this.dropEmptied(this.keys, now);
    this.dropEmptied(this.scopes, now);
  }

  private dropEmptied(map: Map<string, number[]>, now: number): void {
    for (const [key, times] of map) if (!times.some((at) => at > now - windowMs)) map.delete(key);
  }

  /** How many entries each map holds right now — the window's memory, and what proves the sweep works. */
  get keyCount(): number {
    return this.keys.size;
  }

  get scopeCount(): number {
    return this.scopes.size;
  }
}

import { createHash } from "node:crypto";

/**
 * What one visitor looks like to the database on one UTC day: sixteen hex characters, derived from the
 * address and the user agent and nothing else. Neither the address nor the agent is ever stored, so this is
 * the only visitor artefact that exists anywhere in the system.
 *
 * Three properties, each pinned by a test:
 * - the same visitor twice on one day hashes the same, which is what a distinct count needs;
 * - the salt rotates at UTC midnight, so yesterday's hashes cannot be joined to today's, which is why a
 *   range's visitor count is the sum of its days rather than distinct people over the range;
 * - the hash carries no readable part of its input.
 */
export function visitorHashOf(input: { ip: string; userAgent: string; at: Date }): string {
  return sha256(`${input.ip}|${input.userAgent.slice(0, 256)}|${dailySalt(input.at)}`).slice(0, 16);
}

/** The secret for one UTC day: stable across restarts, worthless against yesterday's rows. */
function dailySalt(at: Date): string {
  const secret = process.env.ANALYTICS_SALT ?? process.env.JWT_SECRET ?? "links-dev";

  return sha256(`${secret}|${at.toISOString().slice(0, 10)}`);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

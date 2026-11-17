import type { EventSourceDto } from "./dto/event-source.dto";

/** The source of one event, as it is stored: the raw facts, never the label the dashboard prints. */
export interface SourceColumns {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerHost: string | null;
  referrerInternal: boolean;
}

const tagLimit = 100;
const hostLimit = 253;

/**
 * Normalises what the page sent into what the table holds. Lowercasing and capping happen here rather than
 * in the DTO so one function covers both endpoints, and so the classification further down reads values it
 * already knows the shape of.
 */
export function toSourceColumns(dto: EventSourceDto): SourceColumns {
  return {
    utmSource: tag(dto.utmSource),
    utmMedium: tag(dto.utmMedium),
    utmCampaign: tag(dto.utmCampaign),
    referrerHost: host(dto.referrerHost),
    referrerInternal: dto.referrerInternal ?? false,
  };
}

/** An empty tag is an absent tag: `?utm_source=` says nothing, and must not become a label of its own. */
function tag(value?: string): string | null {
  const normalized = value?.trim().toLowerCase();

  return normalized ? normalized.slice(0, tagLimit) : null;
}

function host(value?: string): string | null {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/^www\./, "");

  return normalized ? normalized.slice(0, hostLimit) : null;
}

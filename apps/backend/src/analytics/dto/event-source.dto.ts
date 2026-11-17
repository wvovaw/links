import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * Where a visit came from, as the page itself reports it. The beacon is cross-origin, so the browser's own
 * `Referer` header carries our page rather than the site the visitor left; the real referrer and the utm
 * tags have to travel in the body or they do not arrive at all.
 *
 * Naming every field is what makes the global `forbidNonWhitelisted` pipe answer 400 to an `ip` or a
 * `userAgent` somebody adds by hand: this endpoint takes no visitor data and refuses to look like it does.
 */
export class EventSourceDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmSource?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmMedium?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  utmCampaign?: string;

  /** An external host: 253 characters is what a hostname may be. */
  @IsOptional()
  @IsString()
  @MaxLength(253)
  referrerHost?: string;

  /** The referrer was this site's own address — a real visit, but not one the page acquired. */
  @IsOptional()
  @IsBoolean()
  referrerInternal?: boolean;
}

/** A page load reports nothing but its source. */
export class RecordPageViewDto extends EventSourceDto {}

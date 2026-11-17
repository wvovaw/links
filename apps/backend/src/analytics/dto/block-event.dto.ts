import { IsIn, IsISO8601, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import type { BlockEventKind } from "../block-event.entity";

import { blockEventKinds } from "../block-event.entity";
import { EventSourceDto } from "./event-source.dto";

/**
 * What a public page reports. The global pipe runs `whitelist` + `forbidNonWhitelisted`, so naming every
 * field here — and every field of the source it extends — is also what makes any other field — an ip, a
 * user agent — a 400.
 */
export class RecordBlockEventDto extends EventSourceDto {
  /** A block id is a handful of random characters; the bounds keep a public write from storing a novel. */
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  blockId!: string;

  @IsIn(blockEventKinds)
  kind!: BlockEventKind;
}

/** `from`/`to` bound the window a caller asks about; an absent bound is unbounded on that side. */
export class StatsQueryDto {
  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;
}

import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

/**
 * How many rows of the live feed to answer with. `limit` is a request, not a command: the service clamps it
 * to 50, so asking for 100 is not an error — but a zero, a fraction or a word is not an amount at all, and
 * the pipe refuses it.
 *
 * There is deliberately no `from`/`to` here: the feed is not a period view, and the pipe's whitelist turns a
 * bound on this route into a 400.
 */
export class ActivityQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

import { Type } from "class-transformer";
import { IsEmail, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

import type { FormSubmissionKind } from "../form-submission.entity";

import { formSubmissionKinds } from "../form-submission.entity";

/**
 * What a form block on a public page sends. The global pipe runs `whitelist` + `forbidNonWhitelisted`, so
 * naming every field here is also what makes any other field a 400 — including the honeypot, which must be
 * named or the pipe would refuse every form that carries one.
 */
export class CreateSubmissionDto {
  /** A block id is a handful of random characters; the bounds keep a public write from storing a novel. */
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  blockId!: string;

  @IsIn(formSubmissionKinds)
  kind!: FormSubmissionKind;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsEmail()
  @MaxLength(200)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  /**
   * The honeypot: a person never sees this field, so a submission that fills it was written by a robot.
   * It is read and then dropped — it is never part of the stored payload.
   */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}

/** `blockId` narrows the list to one form; `limit` is the page's size, newest first. */
export class SubmissionsQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  blockId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}

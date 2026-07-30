import { IsArray, IsEnum, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

import { LinkStatus } from "../link-status";

export const defaultBackground =
  "background-image: linear-gradient(to top, #13b7c6, #00a1da, #0085e4, #635cd2, #a3009c);";
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateLinkDto {
  @IsString()
  @MinLength(3)
  @Matches(slugPattern)
  slug!: string;

  @IsOptional()
  @IsString()
  @MinLength(12)
  @MaxLength(60)
  title?: string;
}

export class UpdateContentDto {
  @IsOptional()
  @IsArray()
  blocks?: unknown[];

  @IsOptional()
  @IsString()
  background?: string;

  @IsOptional()
  @IsEnum(LinkStatus)
  status?: LinkStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageFileIds?: string[];
}

export class UpdateMetadataDto {
  @IsOptional()
  @IsString()
  @MinLength(12)
  @MaxLength(60)
  title?: string;

  @IsOptional()
  @IsObject()
  seo?: Record<string, unknown>;

  @IsOptional()
  @IsEnum(LinkStatus)
  status?: LinkStatus;
}

export class UpdateSlugDto {
  @IsString()
  @MinLength(3)
  @Matches(slugPattern)
  slug!: string;
}

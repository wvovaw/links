import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { CreateSubmissionDto, SubmissionsQueryDto } from "./dto/submission.dto";
import type { FormSubmissionPayload } from "./form-submission.entity";

import { TooManyRequestsException } from "../common/too-many-requests.exception";
import { toSubmissionDto } from "./form-submission.dto";
import { FormSubmission } from "./form-submission.entity";

/** One minute, per block: how many submissions one form takes before its window closes. */
const windowMs = 60_000;
const windowLimit = 30;

/** A list without an explicit `limit` is one screen of rows, not the page's whole history. */
const defaultLimit = 50;

@Injectable()
export class FormsService {
  /**
   * Recent accepted submission timestamps per `${linkId}:${blockId}`. The keys are page blocks, not visitors —
   * nothing about a caller is stored, so there is nothing to key a window on but the form it wrote to. A
   * page with two forms has two budgets: a flood on one must not lock visitors out of the other.
   */
  private readonly recent = new Map<string, number[]>();

  constructor(@InjectRepository(FormSubmission) private readonly submissions: Repository<FormSubmission>) {}

  /**
   * Stores an accepted submission. A honeypot hit is answered as if it were stored and leaves no row: the
   * bot learns nothing, and the page's owner does not have to read its spam. It does not open the window
   * either — a robot filling the trap must not be able to spend the minute a real visitor needs.
   */
  async create(linkId: string, body: CreateSubmissionDto) {
    if (body.company) return;

    this.admit(linkId, body.blockId);

    await this.submissions.save(
      this.submissions.create({
        linkId,
        blockId: body.blockId,
        kind: body.kind,
        payload: payloadOf(body),
      }),
    );
  }

  /** The owner's own list: one page's rows, newest first, optionally of one form block. */
  async list(linkId: string, query: SubmissionsQueryDto) {
    const submissions = this.submissions
      .createQueryBuilder("submission")
      .where("submission.linkId = :linkId", { linkId })
      .orderBy("submission.createdAt", "DESC")
      /*
        `createdAt` is stored to the second, so a burst of rows shares one value; rowid — SQLite's
        insertion counter — breaks those ties by the order they arrived, oldest last.
      */
      .addOrderBy("submission.rowid", "DESC")
      .take(query.limit ?? defaultLimit);

    if (query.blockId) submissions.andWhere("submission.blockId = :blockId", { blockId: query.blockId });

    return (await submissions.getMany()).map(toSubmissionDto);
  }

  /**
   * The sliding window. It runs to completion without awaiting anything, so two submissions arriving in the
   * same tick cannot both read a count below the limit and overrun it.
   */
  private admit(linkId: string, blockId: string) {
    const key = `${linkId}:${blockId}`;
    const now = Date.now();
    const recent = (this.recent.get(key) ?? []).filter((at) => at > now - windowMs);

    if (recent.length >= windowLimit) {
      this.recent.set(key, recent);
      throw new TooManyRequestsException("Too many submissions for this form. Try again in a minute.");
    }

    recent.push(now);
    this.recent.set(key, recent);
  }
}

/**
 * Only the fields the form asked for reach the table: the honeypot and every field an empty input sends as
 * `undefined` are left out, so a stored payload reads exactly what a visitor filled in.
 */
function payloadOf(body: CreateSubmissionDto): FormSubmissionPayload {
  const payload: FormSubmissionPayload = { email: body.email };
  if (body.name !== undefined) payload.name = body.name;
  if (body.message !== undefined) payload.message = body.message;

  return payload;
}

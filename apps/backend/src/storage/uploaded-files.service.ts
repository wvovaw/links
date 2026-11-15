import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type { User } from "../users/user.entity";
import type { UploadedFileKind } from "./uploaded-file.entity";

import { UploadedFile } from "./uploaded-file.entity";

@Injectable()
export class UploadedFilesService {
  constructor(@InjectRepository(UploadedFile) private readonly files: Repository<UploadedFile>) {}

  /** Remembers who uploaded a file. Called by the upload route that just wrote its bytes. */
  async record(owner: User, kind: UploadedFileKind, fileId: string) {
    await this.files.save(this.files.create({ owner, kind, fileId }));
  }

  /**
   * The id of the user who uploaded a file, or `null` when nothing recorded it — a file stored before this
   * table existed, whose uploader the database can no longer name. Callers decide what an unattributed file
   * means for them: nothing may newly claim it, and nobody may delete it by its id.
   */
  async ownerOf(kind: UploadedFileKind, fileId: string): Promise<string | null> {
    const file = await this.files.findOne({ where: { fileId, kind }, select: { ownerId: true } });

    return file?.ownerId ?? null;
  }

  /**
   * Removes a file's bytes and the record of who uploaded it, but only for the account that uploaded it —
   * every path that deletes bytes goes through here, because the page naming a file is not proof of who owns
   * it. A claim made before this table existed has no uploader to compare against, so its bytes stay on disk
   * when the claim goes away: a file nobody can attribute is a storage leak, and a leak is the failure this
   * rule accepts rather than one account deleting another's file.
   *
   * Returns whether anything was removed, so a route can answer a delete it refused the way it answers an
   * unknown id.
   */
  async discard(
    ownerId: string,
    kind: UploadedFileKind,
    fileId: string,
    removeBytes: (fileId: string) => Promise<void>,
  ): Promise<boolean> {
    if ((await this.ownerOf(kind, fileId)) !== ownerId) return false;

    await removeBytes(fileId);
    await this.files.delete({ fileId, kind });

    return true;
  }
}

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
}
